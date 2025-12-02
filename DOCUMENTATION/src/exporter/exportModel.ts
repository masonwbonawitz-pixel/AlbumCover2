/**
 * Orchestrate the complete pipeline: STL + Image → 3MF with vertex colors
 */
import { loadStl, MeshData } from "./loadStl.js";
import { loadImageData, bakeColors } from "./bakeColors.js";
import { threeMF, UnifiedMesh } from "./threeMF.js";

/**
 * Validate mesh before export
 */
function validateMesh(mesh: UnifiedMesh): void {
  const vertexCount = mesh.positions.length / 3;
  const colorCount = mesh.vertexColors.length / 3;

  if (colorCount !== vertexCount) {
    throw new Error(`Vertex color count (${colorCount}) does not match vertex count (${vertexCount})`);
  }

  if (mesh.indices.length % 3 !== 0) {
    throw new Error(`Index count (${mesh.indices.length}) is not divisible by 3`);
  }
}

/**
 * Export 3MF from STL and image with vertex colors
 * @param stlBuffer STL file buffer
 * @param imageBuffer Image file buffer (PNG/JPG)
 * @returns 3MF file buffer
 */
export async function exportModel(stlBuffer: ArrayBuffer, imageBuffer: Buffer): Promise<Buffer> {
  // 1. Load STL
  const meshData: MeshData = await loadStl(stlBuffer);

  // 2. Load image
  const imageData = await loadImageData(imageBuffer);

  // 3. Bake colors into vertex colors
  const vertexColors = bakeColors(meshData.positions, meshData.indices, imageData);

  // 4. Create unified mesh
  const unifiedMesh: UnifiedMesh = {
    positions: meshData.positions,
    normals: meshData.normals,
    indices: meshData.indices,
    vertexColors,
  };

  // 5. Validate
  validateMesh(unifiedMesh);

  // 6. Build 3MF
  const threeMFBuffer = await threeMF(unifiedMesh);

  return threeMFBuffer;
}

