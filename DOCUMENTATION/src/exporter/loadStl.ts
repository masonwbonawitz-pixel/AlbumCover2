/**
 * Load STL file and extract geometry.
 * Returns unified mesh structure with positions, normals, and indices.
 */
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

export interface MeshData {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint32Array;
}

export async function loadStl(buffer: ArrayBuffer): Promise<MeshData> {
  const loader = new STLLoader();
  const geometry = loader.parse(buffer);

  const posAttr = geometry.getAttribute("position");
  const normalAttr = geometry.getAttribute("normal");
  const indexAttr = geometry.getIndex();

  // Extract positions
  const positions = new Float32Array(posAttr.count * 3);
  for (let i = 0; i < posAttr.count; i++) {
    positions[i * 3] = posAttr.getX(i);
    positions[i * 3 + 1] = posAttr.getY(i);
    positions[i * 3 + 2] = posAttr.getZ(i);
  }

  // Extract or compute normals
  let normals: Float32Array;
  if (normalAttr) {
    normals = new Float32Array(normalAttr.count * 3);
    for (let i = 0; i < normalAttr.count; i++) {
      normals[i * 3] = normalAttr.getX(i);
      normals[i * 3 + 1] = normalAttr.getY(i);
      normals[i * 3 + 2] = normalAttr.getZ(i);
    }
  } else {
    geometry.computeVertexNormals();
    const computedNormals = geometry.getAttribute("normal");
    normals = new Float32Array(computedNormals.count * 3);
    for (let i = 0; i < computedNormals.count; i++) {
      normals[i * 3] = computedNormals.getX(i);
      normals[i * 3 + 1] = computedNormals.getY(i);
      normals[i * 3 + 2] = computedNormals.getZ(i);
    }
  }

  // Extract indices (create if non-indexed)
  let indices: Uint32Array;
  if (indexAttr) {
    indices = new Uint32Array(indexAttr.count);
    for (let i = 0; i < indexAttr.count; i++) {
      indices[i] = indexAttr.getX(i);
    }
  } else {
    indices = new Uint32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      indices[i] = i;
    }
  }

  return {
    positions,
    normals,
    indices,
  };
}

