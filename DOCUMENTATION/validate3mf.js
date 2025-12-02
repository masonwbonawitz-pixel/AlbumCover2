// validate3mf.js

import fs from 'fs';

import JSZip from 'jszip';

async function inspect(path) {

  const data = fs.readFileSync(path);

  const zip = await JSZip.loadAsync(data);

  const modelFile = zip.file("3D/3dmodel.model") || zip.file("3D/3dmodel.model");

  if (!modelFile) {

    console.error("No /3D/3dmodel.model found inside the .3mf");

    return;

  }

  const xml = await modelFile.async("string");

  console.log("---- model XML length:", xml.length);

  console.log("Has basematerials?", xml.includes("<basematerials"));

  console.log("Has pid/p1 on triangles?", /pid=/.test(xml) || /p1=/.test(xml));

  console.log("Has color extension namespace (color:)?", xml.includes("http://schemas.microsoft.com/3dmanufacturing/2013/01/color") || xml.includes("color:"));

  console.log("Has color resource block?", xml.includes("<color:colorresources") || xml.includes("<colorresources"));

  console.log("Has texture2d or Textures folder?", xml.includes("<texture2d") || !!zip.file("3D/Textures/"));

  const objCount = (xml.match(/<object\b/g) || []).length;

  console.log("Object count:", objCount);

  console.log("Sample triangle lines (first 40):");

  const triMatches = [...xml.matchAll(/<triangle[^>]*\/>/g)].slice(0,40).map(m => m[0]);

  triMatches.forEach((t,i) => console.log(i, t));

  // optionally print whole xml

  // console.log(xml);

}

const p = process.argv[2];

if (!p) {

  console.error("Usage: node validate3mf.js path/to/file.3mf");

  process.exit(2);

}

inspect(p).catch(e => console.error(e));

