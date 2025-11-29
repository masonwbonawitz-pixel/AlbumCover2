import io
import os
from typing import List, Tuple

import numpy as np
from PIL import Image
import streamlit as st

# Geometry loaders
import trimesh
from stl import mesh as numpy_stl_mesh


# Try both bindings; some environments publish lib3mf as 'lib3mf', others as 'py3mf'
_three_mf = None
_three_mf_import_error = None
for _modname in ("lib3mf", "py3mf"):
    try:
        _three_mf = __import__(_modname)
        break
    except Exception as exc:  # noqa: BLE001
        _three_mf_import_error = exc


FOUR_COLORS_RGB: List[Tuple[int, int, int]] = [
    (0, 0, 0),
    (85, 85, 85),
    (170, 170, 170),
    (255, 255, 255),
]


def require_three_mf():
    if _three_mf is None:
        raise RuntimeError(
            "Neither lib3mf nor py3mf is available. Install one of them: 'pip install lib3mf' or 'pip install py3mf'."
        )
    return _three_mf


def _get_wrapper(mf):
    # lib3mf exposes get_wrapper() in many wheels; otherwise Wrapper()
    if hasattr(mf, "get_wrapper"):
        return mf.get_wrapper()
    if hasattr(mf, "Wrapper"):
        return mf.Wrapper()
    # Fallback: some re-exports provide CreateModel directly
    return mf


def _make_position(mf, x: float, y: float, z: float):
    # Try multiple struct constructions
    if hasattr(mf, "Position"):
        try:
            return mf.Position(float(x), float(y), float(z))
        except Exception:  # noqa: BLE001
            try:
                pos = mf.Position()
                if hasattr(pos, "Coordinates"):
                    pos.Coordinates = (float(x), float(y), float(z))
                    return pos
            except Exception:  # noqa: BLE001
                pass
    # Fallback named fields
    pos = getattr(mf, "Position", object)()
    if hasattr(pos, "X") and hasattr(pos, "Y") and hasattr(pos, "Z"):
        pos.X = float(x)
        pos.Y = float(y)
        pos.Z = float(z)
        return pos
    # As a last resort, return a tuple; some wrappers accept (x,y,z)
    return (float(x), float(y), float(z))


def _make_triangle(mf, i0: int, i1: int, i2: int):
    if hasattr(mf, "Triangle"):
        try:
            return mf.Triangle(int(i0), int(i1), int(i2))
        except Exception:  # noqa: BLE001
            try:
                tri = mf.Triangle()
                if hasattr(tri, "Indices"):
                    tri.Indices = (int(i0), int(i1), int(i2))
                    return tri
            except Exception:  # noqa: BLE001
                pass
    tri = getattr(mf, "Triangle", object)()
    if hasattr(tri, "Indices"):
        tri.Indices = (int(i0), int(i1), int(i2))
        return tri
    # Some wrappers accept raw tuples for triangles
    return (int(i0), int(i1), int(i2))


def _make_color(mf, r: int, g: int, b: int, a: int = 255):
    # Try integer RGBA
    if hasattr(mf, "Color"):
        try:
            return mf.Color(int(r), int(g), int(b), int(a))
        except Exception:  # noqa: BLE001
            pass
        try:
            return mf.Color(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0, float(a) / 255.0)
        except Exception:  # noqa: BLE001
            pass
    # Fallback packed 32-bit RGBA (A in MSB) if wrapper accepts ints
    packed = ((int(a) & 0xFF) << 24) | ((int(r) & 0xFF) << 16) | ((int(g) & 0xFF) << 8) | (int(b) & 0xFF)
    return packed


def _set_mesh_geometry(mf, mesh_obj, vertices, triangles):
    # Wrapper differences around SetGeometry signature
    if hasattr(mesh_obj, "SetGeometry"):
        return mesh_obj.SetGeometry(vertices, triangles)
    if hasattr(mesh_obj, "SetGeometry2"):
        return mesh_obj.SetGeometry2(vertices, triangles)
    # Last resort: try attributes
    if hasattr(mesh_obj, "Vertices"):
        mesh_obj.Vertices = vertices
    if hasattr(mesh_obj, "Triangles"):
        mesh_obj.Triangles = triangles


def _add_color_and_get_index(color_group, color):
    # Returns (resource_id, color_index)
    if hasattr(color_group, "AddColor"):
        idx = color_group.AddColor(color)
    elif hasattr(color_group, "AddColorRGBa"):
        idx = color_group.AddColorRGBa(color)
    else:
        # Try appending to internal list
        if not hasattr(color_group, "_colors"):
            color_group._colors = []  # type: ignore[attr-defined]
        color_group._colors.append(color)  # type: ignore[attr-defined]
        idx = len(color_group._colors) - 1  # type: ignore[attr-defined]
    rid = color_group.GetResourceID() if hasattr(color_group, "GetResourceID") else getattr(color_group, "ResourceID", 0)
    return rid, idx


def _set_triangle_color(mf, mesh_obj, tri_index: int, resource_id: int, color_index: int):
    # Try several known signatures for triangle property assignment
    # 1) Property struct
    try:
        props = getattr(mf, "TriangleProperties", None)
        if props is not None:
            tp = props()
            # Common field names used by bindings
            if hasattr(tp, "m_ResourceID"):
                tp.m_ResourceID = resource_id
            elif hasattr(tp, "ResourceID"):
                tp.ResourceID = resource_id
            # Corner color indices
            if hasattr(tp, "m_Colors"):
                tp.m_Colors = [color_index, color_index, color_index]
            elif hasattr(tp, "Colors"):
                tp.Colors = [color_index, color_index, color_index]
            elif hasattr(tp, "m_Properties"):
                # Some bindings use nested properties per corner
                for k in range(3):
                    if hasattr(tp.m_Properties[k], "m_ColorIndex"):
                        tp.m_Properties[k].m_ColorIndex = color_index
            if hasattr(mesh_obj, "SetTriangleProperties"):
                mesh_obj.SetTriangleProperties(int(tri_index), tp)
                return
    except Exception:
        pass

    # 2) Signature (idx, resource_id, [c0,c1,c2])
    try:
        if hasattr(mesh_obj, "SetTriangleProperties"):
            mesh_obj.SetTriangleProperties(int(tri_index), int(resource_id), [int(color_index)] * 3)
            return
    except Exception:
        pass

    # 3) Signature (idx, [c0,c1,c2], resource_id) or other permutations
    try:
        if hasattr(mesh_obj, "SetTriangleProperties"):
            mesh_obj.SetTriangleProperties(int(tri_index), [int(color_index)] * 3, int(resource_id))
            return
    except Exception:
        pass

    # If we reach here, coloring failed silently for this triangle; continue
    return


def load_png(image_bytes: bytes) -> Image.Image:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    if img.size != (75, 75):
        img = img.resize((75, 75), Image.NEAREST)
    return img


def get_png_as_array(img: Image.Image) -> np.ndarray:
    """Just return the PNG as-is, no color quantization"""
    arr = np.asarray(img, dtype=np.uint8)
    return arr


def load_stl_vertices_faces(stl_bytes: bytes) -> Tuple[np.ndarray, np.ndarray]:
    # Use trimesh for robust STL ingestion
    mesh = trimesh.load(io.BytesIO(stl_bytes), file_type='stl', force='mesh', process=False)
    if mesh.is_empty:
        raise ValueError("Failed to load STL mesh or mesh is empty.")
    
    # Check and repair mesh to ensure it's watertight (manifold)
    if not mesh.is_watertight:
        # Fill holes in the mesh
        trimesh.repair.fill_holes(mesh)
        
        # Fix normals (ensure they all point outward)
        trimesh.repair.fix_normals(mesh)
        
        # Remove duplicate and degenerate faces
        mesh.remove_duplicate_faces()
        mesh.remove_degenerate_faces()
        
        # Merge duplicate vertices
        mesh.merge_vertices()
    
    # Trimesh already loads as triangles; STL files are triangle meshes
    # Each cube in your grid is made of 12 triangles (2 per face)
    vertices = mesh.vertices.view(np.ndarray)
    faces = mesh.faces.view(np.ndarray)
    return vertices, faces


def get_triangle_colors_from_image(vertices: np.ndarray, faces: np.ndarray, img_rgb: np.ndarray) -> np.ndarray:
    """
    Map each triangle to its corresponding pixel color in the image.
    Returns the actual RGB colors from the PNG (no quantization).
    Returns shape: (num_triangles, 3) with RGB values
    """
    min_xy = vertices[:, :2].min(axis=0)
    max_xy = vertices[:, :2].max(axis=0)
    size_xy = np.maximum(max_xy - min_xy, 1e-9)

    tri_verts = vertices[faces]
    centroids = tri_verts.mean(axis=1)[:, :2]

    uv = (centroids - min_xy) / size_xy
    px = np.clip((uv[:, 0] * 75.0).astype(int), 0, 74)
    py = np.clip((uv[:, 1] * 75.0).astype(int), 0, 74)
    py_from_top = 74 - py

    # Get the actual color from the PNG for each triangle
    triangle_colors = img_rgb[py_from_top, px, :]
    return triangle_colors


def write_3mf(vertices: np.ndarray, faces: np.ndarray, triangle_colors: np.ndarray) -> bytes:
    mf = require_three_mf()
    wrapper = _get_wrapper(mf)
    model = wrapper.CreateModel() if hasattr(wrapper, "CreateModel") else mf.CreateModel()

    mesh_obj = model.AddMeshObject()
    if hasattr(mesh_obj, "SetName"):
        mesh_obj.SetName("Colored Mesh")

    # Build geometry
    verts_list = [_make_position(mf, float(x), float(y), float(z)) for x, y, z in vertices.tolist()]
    tris_list = [_make_triangle(mf, int(a), int(b), int(c)) for a, b, c in faces.tolist()]
    _set_mesh_geometry(mf, mesh_obj, verts_list, tris_list)

    # Create color group with all unique colors from the PNG
    color_group = model.AddColorGroup()
    color_group_id = color_group.GetResourceID()
    
    # Find unique colors and create a mapping
    unique_colors_list = []
    color_to_index = {}
    
    for tri_color in triangle_colors:
        color_tuple = tuple(tri_color)
        if color_tuple not in color_to_index:
            r, g, b = color_tuple
            color_obj = _make_color(mf, int(r), int(g), int(b), 255)
            idx = color_group.AddColor(color_obj)
            color_to_index[color_tuple] = idx
            unique_colors_list.append(color_tuple)
    
    # Set triangle properties - assign each triangle to its color
    # Create property resource and link to mesh
    if hasattr(mesh_obj, "CreatePropertyResource"):
        prop_resource = mesh_obj.CreatePropertyResource(color_group_id)
    
    # Assign colors to triangles
    for tri_idx, tri_color in enumerate(triangle_colors):
        color_idx = color_to_index[tuple(tri_color)]
        try:
            # Try to set triangle properties with color group
            if hasattr(mesh_obj, "SetTriangleProperties"):
                # All three vertices get the same color
                mesh_obj.SetTriangleProperties(tri_idx, color_group_id, color_idx, color_idx, color_idx)
        except Exception:
            # Silent fail - some triangles might not accept properties
            pass

    # Add to build
    identity = None
    if hasattr(wrapper, "GetIdentityTransform"):
        identity = wrapper.GetIdentityTransform()
    elif hasattr(mf, "Transform"):
        identity = mf.Transform()
    model.AddBuildItem(mesh_obj, identity)

    # Write to memory buffer
    # Write to temporary file then read back
    # lib3mf's WriteToBuffer doesn't accept a buffer argument, needs WriteToFile
    tmp_path = "/tmp/output_temp.3mf"
    try:
        writer = model.QueryWriter("3mf")
        writer.WriteToFile(tmp_path)
        with open(tmp_path, "rb") as f:
            return f.read()
    except Exception as e:
        # Fallback: try direct model write
        try:
            model.WriteToFile(tmp_path)
            with open(tmp_path, "rb") as f:
                return f.read()
        except Exception:
            raise RuntimeError(f"Failed to write 3MF file: {e}")


def generate_3mf_from_inputs(stl_bytes: bytes, png_bytes: bytes) -> bytes:
    img = load_png(png_bytes)
    img_array = get_png_as_array(img)  # Get PNG colors as-is
    vertices, faces = load_stl_vertices_faces(stl_bytes)
    triangle_colors = get_triangle_colors_from_image(vertices, faces, img_array)
    three_mf_bytes = write_3mf(vertices, faces, triangle_colors)
    return three_mf_bytes


def main():
    st.set_page_config(page_title="Album Cover 3D Color Mapper", page_icon="🧱", layout="centered")
    st.title("🧱 Album Cover 3D Color Mapper")

    st.caption("Upload a 75×75 PNG (4 shades) and a voxelized 75×75 STL grid; get a colorized 3MF for Bambu Studio.")

    col1, col2 = st.columns(2)
    with col1:
        stl_file = st.file_uploader("Upload STL", type=["stl"], accept_multiple_files=False, key="stl")
    with col2:
        png_file = st.file_uploader("Upload PNG", type=["png"], accept_multiple_files=False, key="png")

    if png_file is not None:
        try:
            img = load_png(png_file.read())
            st.image(img, caption="PNG preview (resized to 75×75 if needed)", use_container_width=True)
        except Exception as exc:  # noqa: BLE001
            st.error(f"Failed to read PNG: {exc}")

    if stl_file is not None:
        st.info("STL uploaded. Streamlit lacks a native 3D viewer; proceed to Generate 3MF.")

    disabled = stl_file is None or png_file is None
    if st.button("Generate 3MF", type="primary", disabled=disabled):
        if _three_mf is None:
            st.error(
                "3MF binding not found. Please install 'lib3mf' or 'py3mf'. For example: pip install lib3mf"
            )
            return
        try:
            with st.spinner("Processing and colorizing..."):
                png_bytes = png_file.getvalue()
                stl_bytes = stl_file.getvalue()
                three_mf_bytes = generate_3mf_from_inputs(stl_bytes, png_bytes)
                # Also write to /tmp for convenience
                tmp_out = "/tmp/output.3mf"
                try:
                    with open(tmp_out, "wb") as f:
                        f.write(three_mf_bytes)
                except Exception:
                    pass
            st.success("Done! Your 3MF is ready.")
            st.download_button(
                "Download 3MF",
                data=three_mf_bytes,
                file_name="output.3mf",
                mime="application/vnd.ms-package.3dmanufacturing-3dmodel+xml",
            )
        except Exception as exc:  # noqa: BLE001
            st.error(f"Error generating 3MF: {exc}")


if __name__ == "__main__":
    main()


