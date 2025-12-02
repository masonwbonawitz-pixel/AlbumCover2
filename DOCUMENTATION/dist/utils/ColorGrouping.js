import { colorDistanceHex } from "./colors.js";
export function clusterFacesByColor(mesh, tolerance = 12) {
    const clusters = [];
    for (const face of mesh.faces) {
        // find existing cluster close enough
        let found = -1;
        for (let i = 0; i < clusters.length; i++) {
            if (colorDistanceHex(clusters[i].color, face.color) <= tolerance) {
                found = i;
                break;
            }
        }
        if (found === -1) {
            clusters.push({ color: face.color, faces: [face] });
        }
        else {
            clusters[found].faces.push(face);
        }
    }
    // Build ColorGroup objects
    const groups = clusters.map((c) => {
        const verts = [];
        const tris = [];
        for (const f of c.faces) {
            const i0 = verts.push(mesh.vertices[f.a]) - 1;
            const i1 = verts.push(mesh.vertices[f.b]) - 1;
            const i2 = verts.push(mesh.vertices[f.c]) - 1;
            tris.push([i0, i1, i2]);
        }
        return { color: c.color, vertices: verts, triangles: tris };
    });
    return groups;
}
