import JSZip from "jszip";
export async function build3MF(groups) {
    const zip = new JSZip();
    const modelPath = "3D/3dmodel.model";
    const basematerials = groups
        .map((g) => `      <basematerial name="${g.color}" displaycolor="${g.color}"/>`)
        .join("\n");
    const objectBlocks = groups
        .map((g, i) => {
        const verts = g.vertices
            .map((v) => `          <vertex x="${v.x}" y="${v.y}" z="${v.z}"/>`)
            .join("\n");
        const tris = g.triangles
            .map((t) => `          <triangle v1="${t[0]}" v2="${t[1]}" v3="${t[2]}" pid="1" p1="${i}"/>`)
            .join("\n");
        return `
    <object id="${i + 10}" type="model">
      <mesh>
        <vertices>
${verts}
        </vertices>
        <triangles>
${tris}
        </triangles>
      </mesh>
    </object>`;
    })
        .join("\n");
    const buildItems = groups.map((_, i) => `    <item objectid="${i + 10}"/>`).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter"
  xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"
  xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06">

  <resources>
    <basematerials id="1">
${basematerials}
    </basematerials>
${objectBlocks}
  </resources>

  <build>
${buildItems}
  </build>
</model>`;
    zip.file(modelPath, xml);
    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
</Types>`);
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return content;
}
