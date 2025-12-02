/**
 * Build 3MF package with single object and vertex colors.
 * NO textures, NO UVs, NO basematerials - only vertex colors.
 */
import JSZip from "jszip";

export interface UnifiedMesh {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint32Array;
  vertexColors: Float32Array;
}

/**
 * Create 3MF package with vertex colors (no textures, no basematerials)
 */
export async function threeMF(mesh: UnifiedMesh): Promise<Buffer> {
  const zip = new JSZip();

  // Build vertices XML
  const vertices = [];
  for (let i = 0; i < mesh.positions.length; i += 3) {
    const x = mesh.positions[i];
    const y = mesh.positions[i + 1];
    const z = mesh.positions[i + 2];
    vertices.push(`          <vertex x="${x}" y="${y}" z="${z}"/>`);
  }

  // Build vertex colors XML (3MF uses colorgroup for vertex colors)
  // Format: <color r="1.0" g="0.0" b="0.0"/>
  const colors = [];
  const vertexCount = mesh.positions.length / 3;
  for (let i = 0; i < vertexCount; i++) {
    const r = mesh.vertexColors[i * 3];
    const g = mesh.vertexColors[i * 3 + 1];
    const b = mesh.vertexColors[i * 3 + 2];
    colors.push(`          <color r="${r}" g="${g}" b="${b}"/>`);
  }

  // Build triangles XML with vertex color references
  const triangles = [];
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const v1 = mesh.indices[i];
    const v2 = mesh.indices[i + 1];
    const v3 = mesh.indices[i + 2];
    // Reference colorgroup: pid="1" points to colorgroup id="1"
    // p1, p2, p3 are the vertex indices in the colorgroup (same as vertex indices)
    triangles.push(`          <triangle v1="${v1}" v2="${v2}" v3="${v3}" pid="1" p1="${v1}" p2="${v2}" p3="${v3}"/>`);
  }

  // Build 3D model XML with vertex colors
  // Use colorgroup for vertex colors (standard 3MF way)
  const modelXml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter"
  xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"
  xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06">

  <resources>
    <colorgroup id="1">
${colors.join("\n")}
    </colorgroup>
    <object id="1" type="model">
      <mesh>
        <vertices>
${vertices.join("\n")}
        </vertices>
        <triangles>
${triangles.join("\n")}
        </triangles>
      </mesh>
    </object>
  </resources>

  <build>
    <item objectid="1"/>
  </build>
</model>`;

  // Add model file
  zip.file("3D/3dmodel.model", modelXml);

  // Add [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
  <Override PartName="/3D/3dmodel.model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
</Types>`
  );

  // Add _rels/.rels
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" Target="/3D/3dmodel.model" Id="rel0"/>
</Relationships>`
  );

  // Generate zip buffer
  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  return buffer;
}

