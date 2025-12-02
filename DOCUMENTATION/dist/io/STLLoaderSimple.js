import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { readFileSync } from "fs";
export async function loadSTL(path) {
    const buffer = readFileSync(path);
    const loader = new STLLoader();
    const geometry = loader.parse(buffer.buffer);
    // Use geometry as-is (STL loader typically produces non-indexed geometry)
    const geom = geometry;
    const pos = geom.getAttribute("position");
    const index = geom.getIndex();
    const vertices = [];
    for (let i = 0; i < pos.count; i++) {
        vertices.push({ x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i) });
    }
    const faces = [];
    if (index) {
        for (let i = 0; i < index.count; i += 3) {
            faces.push({ a: index.getX(i), b: index.getX(i + 1), c: index.getX(i + 2) });
        }
    }
    else {
        for (let i = 0; i < pos.count; i += 3) {
            faces.push({ a: i, b: i + 1, c: i + 2 });
        }
    }
    return { vertices, faces };
}
