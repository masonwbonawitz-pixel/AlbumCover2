/**
 * Planar projection utilities.
 * Given a vertex {x,y,z}, compute u,v in [0..1] via axis projection and mesh bounding box.
 * axis: "X" | "Y" | "Z" (project along that axis; e.g. axis=Z uses X->u, Y->v)
 */
export function computeBounds(vertices) {
    const min = { x: Infinity, y: Infinity, z: Infinity };
    const max = { x: -Infinity, y: -Infinity, z: -Infinity };
    for (const v of vertices) {
        min.x = Math.min(min.x, v.x);
        min.y = Math.min(min.y, v.y);
        min.z = Math.min(min.z, v.z);
        max.x = Math.max(max.x, v.x);
        max.y = Math.max(max.y, v.y);
        max.z = Math.max(max.z, v.z);
    }
    return { min, max };
}
export function vertexToUV(v, bounds, axis, scale = 1, offsetX = 0, offsetY = 0) {
    // choose plane
    let u_raw = 0, v_raw = 0;
    if (axis === "Z") {
        u_raw = (v.x - bounds.min.x) / (bounds.max.x - bounds.min.x || 1);
        v_raw = 1 - (v.y - bounds.min.y) / (bounds.max.y - bounds.min.y || 1); // invert to map image top->top
    }
    else if (axis === "Y") {
        u_raw = (v.x - bounds.min.x) / (bounds.max.x - bounds.min.x || 1);
        v_raw = 1 - (v.z - bounds.min.z) / (bounds.max.z - bounds.min.z || 1);
    }
    else { // X
        u_raw = (v.y - bounds.min.y) / (bounds.max.y - bounds.min.y || 1);
        v_raw = 1 - (v.z - bounds.min.z) / (bounds.max.z - bounds.min.z || 1);
    }
    // scale and offset around center
    const u = ((u_raw - 0.5) * scale + 0.5) + offsetX;
    const vv = ((v_raw - 0.5) * scale + 0.5) + offsetY;
    return { u, v: vv };
}
