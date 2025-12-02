/**
 * Bake image colors into vertex colors.
 * Samples image at face centroids and assigns color to all vertices of each face.
 */
import sharp from "sharp";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ImageData {
  buffer: Buffer;
  width: number;
  height: number;
  channels: number;
}

/**
 * Load image and return raw RGBA buffer
 */
export async function loadImageData(imageBuffer: Buffer): Promise<ImageData> {
  const img = sharp(imageBuffer);
  const meta = await img.metadata();
  const { width = 1, height = 1 } = meta;
  const buffer = await img.raw().ensureAlpha().toBuffer();
  return { buffer, width, height, channels: 4 };
}

/**
 * Sample pixel at UV coordinates (nearest neighbor)
 */
function samplePixel(imageData: ImageData, u: number, v: number): RGB {
  u = Math.max(0, Math.min(1, u));
  v = Math.max(0, Math.min(1, v));

  const x = Math.floor(u * (imageData.width - 1));
  const y = Math.floor(v * (imageData.height - 1));

  const idx = (y * imageData.width + x) * imageData.channels;
  const r = imageData.buffer[idx];
  const g = imageData.buffer[idx + 1];
  const b = imageData.buffer[idx + 2];

  return { r, g, b };
}

/**
 * Compute bounding box for planar projection
 */
function computeBbox(positions: Float32Array) {
  const bbox = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity,
  };

  for (let i = 0; i < positions.length; i += 3) {
    bbox.minX = Math.min(bbox.minX, positions[i]);
    bbox.maxX = Math.max(bbox.maxX, positions[i]);
    bbox.minY = Math.min(bbox.minY, positions[i + 1]);
    bbox.maxY = Math.max(bbox.maxY, positions[i + 1]);
    bbox.minZ = Math.min(bbox.minZ, positions[i + 2]);
    bbox.maxZ = Math.max(bbox.maxZ, positions[i + 2]);
  }

  return bbox;
}

/**
 * Project 3D point to UV on largest face plane
 */
function projectToUV(x: number, y: number, z: number, bbox: ReturnType<typeof computeBbox>): { u: number; v: number } {
  const dx = bbox.maxX - bbox.minX;
  const dy = bbox.maxY - bbox.minY;
  const dz = bbox.maxZ - bbox.minZ;

  const areaXY = dx * dy;
  const areaXZ = dx * dz;
  const areaYZ = dy * dz;

  let u: number, v: number;

  if (areaXY >= areaXZ && areaXY >= areaYZ) {
    // XY plane
    u = (x - bbox.minX) / (dx || 1);
    v = 1 - (y - bbox.minY) / (dy || 1);
  } else if (areaXZ >= areaYZ) {
    // XZ plane
    u = (x - bbox.minX) / (dx || 1);
    v = 1 - (z - bbox.minZ) / (dz || 1);
  } else {
    // YZ plane
    u = (y - bbox.minY) / (dy || 1);
    v = 1 - (z - bbox.minZ) / (dz || 1);
  }

  return { u: Math.max(0, Math.min(1, u)), v: Math.max(0, Math.min(1, v)) };
}

/**
 * Bake image colors into vertex colors.
 * For each face, sample the image at the face centroid and assign that color to all vertices of the face.
 */
export function bakeColors(
  positions: Float32Array,
  indices: Uint32Array,
  imageData: ImageData
): Float32Array {
  const vertexCount = positions.length / 3;
  const vertexColors = new Float32Array(vertexCount * 3);
  const bbox = computeBbox(positions);

  // Process each triangle
  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i];
    const i1 = indices[i + 1];
    const i2 = indices[i + 2];

    // Get vertex positions
    const v0 = {
      x: positions[i0 * 3],
      y: positions[i0 * 3 + 1],
      z: positions[i0 * 3 + 2],
    };
    const v1 = {
      x: positions[i1 * 3],
      y: positions[i1 * 3 + 1],
      z: positions[i1 * 3 + 2],
    };
    const v2 = {
      x: positions[i2 * 3],
      y: positions[i2 * 3 + 1],
      z: positions[i2 * 3 + 2],
    };

    // Compute face centroid
    const centroid = {
      x: (v0.x + v1.x + v2.x) / 3,
      y: (v0.y + v1.y + v2.y) / 3,
      z: (v0.z + v1.z + v2.z) / 3,
    };

    // Project centroid to UV
    const uv = projectToUV(centroid.x, centroid.y, centroid.z, bbox);

    // Sample image at centroid
    const color = samplePixel(imageData, uv.u, uv.v);

    // Assign color to all three vertices of this face
    // Convert RGB [0-255] to [0-1] for vertex colors
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    vertexColors[i0 * 3] = r;
    vertexColors[i0 * 3 + 1] = g;
    vertexColors[i0 * 3 + 2] = b;

    vertexColors[i1 * 3] = r;
    vertexColors[i1 * 3 + 1] = g;
    vertexColors[i1 * 3 + 2] = b;

    vertexColors[i2 * 3] = r;
    vertexColors[i2 * 3 + 1] = g;
    vertexColors[i2 * 3 + 2] = b;
  }

  return vertexColors;
}

