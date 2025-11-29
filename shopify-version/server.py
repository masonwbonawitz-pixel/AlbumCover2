"""
Flask backend API for 3MF color mapping
Exposes a /generate endpoint that accepts STL + PNG and returns 3MF
"""
import io
import os
import uuid
from typing import List, Tuple

import numpy as np
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import trimesh

# Try both bindings; some environments publish lib3mf as 'lib3mf', others as 'py3mf'
_three_mf = None
for _modname in ("lib3mf", "py3mf"):
    try:
        _three_mf = __import__(_modname)
        break
    except Exception:
        pass


FOUR_COLORS_RGB: List[Tuple[int, int, int]] = [
    (0, 0, 0),
    (85, 85, 85),
    (170, 170, 170),
    (255, 255, 255),
]


def require_three_mf():
    if _three_mf is None:
        raise RuntimeError(
            "Neither lib3mf nor py3mf is available. Install one: 'pip install lib3mf' or 'pip install py3mf'."
        )
    return _three_mf


def _get_wrapper(mf):
    if hasattr(mf, "get_wrapper"):
        return mf.get_wrapper()
    if hasattr(mf, "Wrapper"):
        return mf.Wrapper()
    return mf


def _make_position(mf, x: float, y: float, z: float):
    if hasattr(mf, "Position"):
        try:
            return mf.Position(float(x), float(y), float(z))
        except Exception:
            try:
                pos = mf.Position()
                if hasattr(pos, "Coordinates"):
                    pos.Coordinates = (float(x), float(y), float(z))
                    return pos
            except Exception:
                pass
    pos = getattr(mf, "Position", object)()
    if hasattr(pos, "X") and hasattr(pos, "Y") and hasattr(pos, "Z"):
        pos.X = float(x)
        pos.Y = float(y)
        pos.Z = float(z)
        return pos
    return (float(x), float(y), float(z))


def _make_triangle(mf, i0: int, i1: int, i2: int):
    if hasattr(mf, "Triangle"):
        try:
            return mf.Triangle(int(i0), int(i1), int(i2))
        except Exception:
            try:
                tri = mf.Triangle()
                if hasattr(tri, "Indices"):
                    tri.Indices = (int(i0), int(i1), int(i2))
                    return tri
            except Exception:
                pass
    tri = getattr(mf, "Triangle", object)()
    if hasattr(tri, "Indices"):
        tri.Indices = (int(i0), int(i1), int(i2))
        return tri
    return (int(i0), int(i1), int(i2))


def _make_color(mf, r: int, g: int, b: int, a: int = 255):
    if hasattr(mf, "Color"):
        try:
            return mf.Color(int(r), int(g), int(b), int(a))
        except Exception:
            pass
        try:
            return mf.Color(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0, float(a) / 255.0)
        except Exception:
            pass
    packed = ((int(a) & 0xFF) << 24) | ((int(r) & 0xFF) << 16) | ((int(g) & 0xFF) << 8) | (int(b) & 0xFF)
    return packed


def _set_mesh_geometry(mf, mesh_obj, vertices, triangles):
    if hasattr(mesh_obj, "SetGeometry"):
        return mesh_obj.SetGeometry(vertices, triangles)
    if hasattr(mesh_obj, "SetGeometry2"):
        return mesh_obj.SetGeometry2(vertices, triangles)
    if hasattr(mesh_obj, "Vertices"):
        mesh_obj.Vertices = vertices
    if hasattr(mesh_obj, "Triangles"):
        mesh_obj.Triangles = triangles


def _add_color_and_get_index(color_group, color):
    if hasattr(color_group, "AddColor"):
        idx = color_group.AddColor(color)
    elif hasattr(color_group, "AddColorRGBa"):
        idx = color_group.AddColorRGBa(color)
    else:
        if not hasattr(color_group, "_colors"):
            color_group._colors = []
        color_group._colors.append(color)
        idx = len(color_group._colors) - 1
    rid = color_group.GetResourceID() if hasattr(color_group, "GetResourceID") else getattr(color_group, "ResourceID", 0)
    return rid, idx


def _set_triangle_color(mf, mesh_obj, tri_index: int, resource_id: int, color_index: int):
    try:
        props = getattr(mf, "TriangleProperties", None)
        if props is not None:
            tp = props()
            if hasattr(tp, "m_ResourceID"):
                tp.m_ResourceID = resource_id
            elif hasattr(tp, "ResourceID"):
                tp.ResourceID = resource_id
            if hasattr(tp, "m_Colors"):
                tp.m_Colors = [color_index, color_index, color_index]
            elif hasattr(tp, "Colors"):
                tp.Colors = [color_index, color_index, color_index]
            elif hasattr(tp, "m_Properties"):
                for k in range(3):
                    if hasattr(tp.m_Properties[k], "m_ColorIndex"):
                        tp.m_Properties[k].m_ColorIndex = color_index
            if hasattr(mesh_obj, "SetTriangleProperties"):
                mesh_obj.SetTriangleProperties(int(tri_index), tp)
                return
    except Exception:
        pass

    try:
        if hasattr(mesh_obj, "SetTriangleProperties"):
            mesh_obj.SetTriangleProperties(int(tri_index), int(resource_id), [int(color_index)] * 3)
            return
    except Exception:
        pass

    try:
        if hasattr(mesh_obj, "SetTriangleProperties"):
            mesh_obj.SetTriangleProperties(int(tri_index), [int(color_index)] * 3, int(resource_id))
            return
    except Exception:
        pass


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
    mesh = trimesh.load(io.BytesIO(stl_bytes), file_type='stl', force='mesh', process=False)
    if mesh.is_empty:
        raise ValueError("Failed to load STL mesh or mesh is empty.")
    
    # Check and repair mesh to ensure it's watertight (manifold)
    print(f"📊 Original mesh: {len(mesh.vertices)} vertices, {len(mesh.faces)} faces")
    print(f"   Watertight: {mesh.is_watertight}, Volume: {mesh.is_volume}")
    
    if not mesh.is_watertight:
        print("⚠️  Mesh is not watertight - attempting repair...")
        
        # Fill holes in the mesh
        trimesh.repair.fill_holes(mesh)
        
        # Fix normals (ensure they all point outward)
        trimesh.repair.fix_normals(mesh)
        
        # Remove duplicate and degenerate faces
        mesh.remove_duplicate_faces()
        mesh.remove_degenerate_faces()
        
        # Merge duplicate vertices
        mesh.merge_vertices()
        
        print(f"✅ After repair: {len(mesh.vertices)} vertices, {len(mesh.faces)} faces")
        print(f"   Watertight: {mesh.is_watertight}, Volume: {mesh.is_volume}")
        
        if not mesh.is_watertight:
            print("⚠️  Warning: Mesh still has issues after repair, but continuing anyway...")
    else:
        print("✅ Mesh is already watertight!")
    
    # Trimesh already loads as triangles; STL files are triangle meshes
    # Each cube in your grid is made of 12 triangles (2 per face)
    vertices = mesh.vertices.view(np.ndarray)
    faces = mesh.faces.view(np.ndarray)
    return vertices, faces


def get_triangle_colors_from_image(vertices: np.ndarray, faces: np.ndarray, img_rgb: np.ndarray, grid_size: int = 75) -> np.ndarray:
    """
    Map each triangle to its corresponding pixel color in the image.
    Snaps triangle centroids to grid cell centers to ensure uniform coloring.
    Returns the actual RGB colors from the PNG (no quantization).
    Returns shape: (num_triangles, 3) with RGB values
    """
    # Get actual image dimensions
    img_height, img_width = img_rgb.shape[:2]
    
    # Only use top faces (near-horizontal) to determine bounds
    tri_verts = vertices[faces]
    tri_normals = np.cross(
        tri_verts[:, 1] - tri_verts[:, 0],
        tri_verts[:, 2] - tri_verts[:, 0]
    )
    tri_normals = tri_normals / (np.linalg.norm(tri_normals, axis=1, keepdims=True) + 1e-9)
    z_component = np.abs(tri_normals[:, 2])
    
    # Only use top-facing triangles (normal pointing up, Z component > 0.7)
    top_mask = z_component > 0.7
    if np.any(top_mask):
        top_centroids = tri_verts[top_mask].mean(axis=1)[:, :2]
        min_xy = top_centroids.min(axis=0)
        max_xy = top_centroids.max(axis=0)
    else:
        # Fallback to all triangles if no top faces found
        min_xy = vertices[:, :2].min(axis=0)
        max_xy = vertices[:, :2].max(axis=0)
    
    size_xy = np.maximum(max_xy - min_xy, 1e-9)

    # Get centroids for all triangles
    centroids = tri_verts.mean(axis=1)[:, :2]

    # Normalize to [0, 1] range
    uv = (centroids - min_xy) / size_xy
    
    # Snap to grid cell centers to ensure uniform coloring
    # This ensures all triangles in the same grid cell get the same color
    cell_size = 1.0 / grid_size
    cell_u = np.floor(uv[:, 0] * grid_size) * cell_size + cell_size * 0.5  # Center of cell
    cell_v = np.floor(uv[:, 1] * grid_size) * cell_size + cell_size * 0.5  # Center of cell
    
    # Clamp to valid range
    cell_u = np.clip(cell_u, 0, 1)
    cell_v = np.clip(cell_v, 0, 1)
    
    # Map to pixel coordinates using actual image dimensions (not grid_size)
    px = np.clip((cell_u * img_width).astype(int), 0, img_width - 1)
    py = np.clip((cell_v * img_height).astype(int), 0, img_height - 1)
    
    # Flip Y axis (image origin is top-left, but our UV origin is bottom-left)
    py_from_top = (img_height - 1) - py

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
    
    print(f"✅ Added {len(unique_colors_list)} unique colors to 3MF color group")
    
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


def write_obj_with_colors(vertices: np.ndarray, faces: np.ndarray, triangle_colors: np.ndarray) -> Tuple[bytes, bytes]:
    """
    Write OBJ file with colors via MTL file
    Uses the actual colors from the PNG (no forced palette)
    Returns: (obj_bytes, mtl_bytes)
    """
    # Find all unique colors and create materials
    unique_colors = {}
    color_to_mat_name = {}
    
    for tri_color in triangle_colors:
        color_tuple = tuple(tri_color)
        if color_tuple not in color_to_mat_name:
            mat_idx = len(unique_colors)
            mat_name = f"color_{mat_idx}"
            unique_colors[color_tuple] = mat_name
            color_to_mat_name[color_tuple] = mat_name
    
    print(f"✅ Creating OBJ with {len(unique_colors)} unique materials")
    
    # Create MTL file with all unique colors
    mtl_content = []
    for (r, g, b), mat_name in unique_colors.items():
        mtl_content.append(f"newmtl {mat_name}")
        mtl_content.append(f"Kd {r/255.0:.6f} {g/255.0:.6f} {b/255.0:.6f}")  # Diffuse color
        mtl_content.append(f"Ka {r/255.0:.6f} {g/255.0:.6f} {b/255.0:.6f}")  # Ambient color
        mtl_content.append("Ks 0.0 0.0 0.0")  # No specular
        mtl_content.append("illum 1")  # Color on, no specular
        mtl_content.append("")
    
    mtl_bytes = "\n".join(mtl_content).encode('utf-8')
    
    # Create OBJ file
    obj_content = []
    obj_content.append("# Colored Album Cover Model")
    obj_content.append("# Colors preserved from original PNG")
    obj_content.append("mtllib output.mtl")
    obj_content.append("")
    
    # Write vertices
    for v in vertices:
        obj_content.append(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}")
    obj_content.append("")
    
    # Group faces by color/material for efficiency
    faces_by_material = {}
    for face_idx, tri_color in enumerate(triangle_colors):
        mat_name = color_to_mat_name[tuple(tri_color)]
        if mat_name not in faces_by_material:
            faces_by_material[mat_name] = []
        faces_by_material[mat_name].append(faces[face_idx])
    
    # Write faces grouped by material
    for mat_name, face_list in faces_by_material.items():
        obj_content.append(f"usemtl {mat_name}")
        for face in face_list:
            # OBJ faces are 1-indexed
            obj_content.append(f"f {face[0]+1} {face[1]+1} {face[2]+1}")
        obj_content.append("")
    
    obj_bytes = "\n".join(obj_content).encode('utf-8')
    return obj_bytes, mtl_bytes


def generate_3mf_from_inputs(stl_bytes: bytes, png_bytes: bytes) -> bytes:
    img = load_png(png_bytes)
    img_array = get_png_as_array(img)  # Get PNG colors as-is
    vertices, faces = load_stl_vertices_faces(stl_bytes)
    triangle_colors = get_triangle_colors_from_image(vertices, faces, img_array)
    three_mf_bytes = write_3mf(vertices, faces, triangle_colors)
    return three_mf_bytes


def generate_obj_from_inputs(stl_bytes: bytes, png_bytes: bytes, grid_size: int = 75) -> Tuple[bytes, bytes]:
    img = load_png(png_bytes)
    img_array = get_png_as_array(img)  # Get PNG colors as-is
    vertices, faces = load_stl_vertices_faces(stl_bytes)
    triangle_colors = get_triangle_colors_from_image(vertices, faces, img_array, grid_size)
    obj_bytes, mtl_bytes = write_obj_with_colors(vertices, faces, triangle_colors)
    return obj_bytes, mtl_bytes


# Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access


@app.route('/')
def index():
    """Serve the HTML frontend"""
    return send_file('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    """
    Accepts multipart/form-data with:
    - stl: STL file
    - png: PNG file
    Returns: 3MF file download
    """
    try:
        if 'stl' not in request.files or 'png' not in request.files:
            return jsonify({'error': 'Missing stl or png file'}), 400

        stl_file = request.files['stl']
        png_file = request.files['png']

        stl_bytes = stl_file.read()
        png_bytes = png_file.read()

        # Generate 3MF
        three_mf_bytes = generate_3mf_from_inputs(stl_bytes, png_bytes)

        # Return as downloadable file
        return send_file(
            io.BytesIO(three_mf_bytes),
            mimetype='application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
            as_attachment=True,
            download_name='output.3mf'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/generate-obj', methods=['POST'])
def generate_obj_route():
    """
    Accepts multipart/form-data with:
    - stl: STL file
    - png: PNG file
    Returns: ZIP file containing OBJ + MTL files
    """
    import zipfile
    import traceback
    
    try:
        print("🎨 OBJ generation request received")
        
        if 'stl' not in request.files or 'png' not in request.files:
            print("❌ Missing files in request")
            return jsonify({'error': 'Missing stl or png file'}), 400

        stl_file = request.files['stl']
        png_file = request.files['png']
        
        print(f"📦 STL file: {stl_file.filename}")
        print(f"🖼️  PNG file: {png_file.filename}")

        stl_bytes = stl_file.read()
        png_bytes = png_file.read()
        
        # Get grid size from form data (default to 75 if not provided)
        grid_size = int(request.form.get('grid_size', 75))
        
        print(f"📊 STL size: {len(stl_bytes)} bytes")
        print(f"📊 PNG size: {len(png_bytes)} bytes")
        print(f"📊 Grid size: {grid_size}x{grid_size}")

        # Generate OBJ + MTL
        print("⚙️  Generating OBJ and MTL files...")
        obj_bytes, mtl_bytes = generate_obj_from_inputs(stl_bytes, png_bytes, grid_size)
        
        print(f"✅ OBJ size: {len(obj_bytes)} bytes")
        print(f"✅ MTL size: {len(mtl_bytes)} bytes")

        # Create a ZIP file with both OBJ and MTL
        print("📦 Creating ZIP archive...")
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            zip_file.writestr('output.obj', obj_bytes)
            zip_file.writestr('output.mtl', mtl_bytes)
        zip_buffer.seek(0)
        
        print(f"✅ ZIP size: {zip_buffer.getbuffer().nbytes} bytes")
        print("📤 Sending ZIP file to client...")

        # Return as downloadable ZIP
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='colored_model.zip'
        )

    except Exception as e:
        print(f"❌ Error generating OBJ: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/get-stl/<int:size>')
def get_stl(size):
    """
    Serves the pre-uploaded STL file for the specified grid size.
    Expected files: stl_files/48x48_grid.stl, 75x75_grid.stl, 96x96_grid.stl
    """
    try:
        if size not in [48, 75, 96]:
            return jsonify({'error': f'Invalid grid size: {size}'}), 400
        
        stl_path = os.path.join('stl_files', f'{size}x{size}_grid.stl')
        
        if not os.path.exists(stl_path):
            return jsonify({'error': f'STL file not found for {size}×{size} grid. Please upload it to {stl_path}'}), 404
        
        print(f"📦 Serving STL file: {stl_path}")
        return send_file(
            stl_path,
            mimetype='application/octet-stream',
            as_attachment=False
        )
        
    except Exception as e:
        print(f"❌ Error serving STL: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/upload-for-checkout', methods=['POST'])
def upload_for_checkout():
    """
    Accepts multipart/form-data with:
    - stl: STL file
    - png: PNG file
    Generates OBJ+MTL, saves them with a unique order ID, and returns the order ID
    """
    import zipfile
    import traceback
    
    try:
        print("🛒 Checkout upload request received")
        
        if 'stl' not in request.files or 'png' not in request.files:
            print("❌ Missing files in request")
            return jsonify({'error': 'Missing stl or png file'}), 400

        stl_file = request.files['stl']
        png_file = request.files['png']
        
        print(f"📦 STL file: {stl_file.filename}")
        print(f"🖼️  PNG file: {png_file.filename}")

        stl_bytes = stl_file.read()
        png_bytes = png_file.read()
        
        # Get grid size from form data (default to 75 if not provided)
        grid_size = int(request.form.get('grid_size', 75))
        
        # Generate OBJ + MTL
        print("⚙️  Generating OBJ and MTL files...")
        obj_bytes, mtl_bytes = generate_obj_from_inputs(stl_bytes, png_bytes, grid_size)
        
        # Create unique order ID
        order_id = str(uuid.uuid4())
        print(f"🆔 Generated order ID: {order_id}")
        
        # Create orders directory if it doesn't exist
        orders_dir = 'orders'
        os.makedirs(orders_dir, exist_ok=True)
        
        # Save files with order ID
        order_dir = os.path.join(orders_dir, order_id)
        os.makedirs(order_dir, exist_ok=True)
        
        # Save OBJ and MTL files
        obj_path = os.path.join(order_dir, 'model.obj')
        mtl_path = os.path.join(order_dir, 'model.mtl')
        
        with open(obj_path, 'wb') as f:
            f.write(obj_bytes)
        with open(mtl_path, 'wb') as f:
            f.write(mtl_bytes)
        
        # Also save original PNG for reference
        png_path = os.path.join(order_dir, 'original.png')
        with open(png_path, 'wb') as f:
            f.write(png_bytes)
        
        print(f"✅ Files saved to {order_dir}")
        
        # Return order ID
        return jsonify({
            'order_id': order_id,
            'message': 'Order prepared successfully'
        })
        
    except Exception as e:
        print(f"❌ Error in checkout upload: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    import socket
    import sys
    import os
    
    def is_port_available(port):
        """Check if a port is available"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return True
            except OSError:
                return False
    
    # Get port from command line argument, environment variable, or default
    port = None
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"⚠️  Invalid port number: {sys.argv[1]}. Using default.")
    
    if port is None:
        port = int(os.environ.get('PORT', 5001))
    
    # Check if port is available (try both 127.0.0.1 and 0.0.0.0)
    port_available = False
    bind_host = '127.0.0.1'
    
    # Try 127.0.0.1 first
    if is_port_available(port):
        port_available = True
        bind_host = '127.0.0.1'
    else:
        # Try 0.0.0.0 (all interfaces) - sometimes works when 127.0.0.1 doesn't
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('0.0.0.0', port))
                port_available = True
                bind_host = '0.0.0.0'
            except OSError:
                pass
    
    if not port_available:
        print(f"⚠️  Port {port} is not available. Please choose a different port.")
        print(f"   Usage: python3 server.py [PORT]")
        print(f"   Example: python3 server.py 5000")
        sys.exit(1)
    
    print("🚀 Starting Album Cover 3D Color Mapper server...")
    print(f"📂 Running on port {port} (host: {bind_host})")
    print(f"📂 Open http://localhost:{port} in your browser")
    print(f"📂 Also accessible at http://127.0.0.1:{port}")
    app.run(debug=True, port=port, host=bind_host, use_reloader=False)

