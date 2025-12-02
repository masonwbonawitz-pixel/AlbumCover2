import minimist from "minimist";
import { loadSTL } from "./io/STLLoaderSimple.js";
import { loadImage, samplePixel } from "./image/ImageSampler.js";
import { computeBounds, vertexToUV } from "./utils/Projection.js";
import { rgbToHex } from "./utils/colors.js";
import { clusterFacesByColor } from "./utils/ColorGrouping.js";
import { build3MF } from "./threeMF/Builder3MF.js";
import { writeFileSync } from "fs";
async function main() {
    const argv = minimist(process.argv.slice(2), {
        string: ["stl", "img", "axis", "out"],
        default: { axis: "Z", scale: 1, offsetX: 0, offsetY: 0, tolerance: 12, out: "output.3mf" },
    });
    if (!argv.stl || !argv.img) {
        console.error("Usage: --stl model.stl --img image.png [--axis Z|X|Y] [--scale 1.0] [--offsetX 0] [--offsetY 0] [--tolerance 12] [--out out.3mf]");
        process.exit(2);
    }
    console.log("Loading STL:", argv.stl);
    const mesh = await loadSTL(argv.stl);
    console.log("Loading image:", argv.img);
    const img = await loadImage(argv.img);
    // compute mesh bounds for planar projection
    const bounds = computeBounds(mesh.vertices);
    // For each face compute centroid, map to uv, sample pixel -> color
    const faceColors = [];
    for (const f of mesh.faces) {
        const vA = mesh.vertices[f.a];
        const vB = mesh.vertices[f.b];
        const vC = mesh.vertices[f.c];
        const centroid = { x: (vA.x + vB.x + vC.x) / 3, y: (vA.y + vB.y + vC.y) / 3, z: (vA.z + vB.z + vC.z) / 3 };
        const uv = vertexToUV(centroid, bounds, argv.axis.toUpperCase(), parseFloat(argv.scale), parseFloat(argv.offsetX), parseFloat(argv.offsetY));
        const px = samplePixel(img.buffer, img.width, img.height, img.channels, uv.u, uv.v);
        const hex = rgbToHex(px.r, px.g, px.b);
        faceColors.push({ a: f.a, b: f.b, c: f.c, color: hex });
    }
    // Build mesh data for clustering
    const meshData = { vertices: mesh.vertices, faces: faceColors };
    console.log("Clustering faces by color (tolerance:", argv.tolerance, ")");
    const groups = clusterFacesByColor(meshData, parseFloat(argv.tolerance));
    console.log("Building 3MF with", groups.length, "color objects");
    const content = await build3MF(groups);
    writeFileSync(argv.out, content);
    console.log("Wrote", argv.out);
}
main().catch((e) => { console.error(e); process.exit(1); });
