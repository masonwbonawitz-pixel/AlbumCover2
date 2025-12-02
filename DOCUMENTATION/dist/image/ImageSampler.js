/**
 * Loads the image via sharp and allows sampling by normalized UV coords [0..1] (u: left->right, v: top->bottom)
 * For STL (no UVs) we'll use a planar projection mapping 3D -> 2D using chosen axis and bounding box -> uv
 */
import sharp from "sharp";
export async function loadImage(path) {
    const img = sharp(path);
    const meta = await img.metadata();
    const { width = 1, height = 1 } = meta;
    const buffer = await img.raw().ensureAlpha().toBuffer();
    return { buffer, width, height, channels: 4 };
}
export function samplePixel(buffer, width, height, channels, u, v) {
    // clamp
    u = Math.max(0, Math.min(1, u));
    v = Math.max(0, Math.min(1, v));
    // map uv to pixel center coordinates
    const x = Math.floor(u * (width - 1));
    const y = Math.floor(v * (height - 1));
    const idx = (y * width + x) * channels;
    const r = buffer[idx];
    const g = buffer[idx + 1];
    const b = buffer[idx + 2];
    return { r, g, b };
}
