# STL -> Image -> 3MF (Bambu-compatible)

Install:

```bash
npm install
```

Build:

```bash
npm run build
```

Usage:

```bash
node dist/index.js --stl path/to/model.stl --img path/to/image.png --axis Z --tolerance 12 --out mapped.3mf
```

## Options

- `--stl`: Path to STL file (required)
- `--img`: Path to image file (PNG/JPG) (required)
- `--axis`: Projection axis - X, Y, or Z (default: Z)
- `--scale`: Scale factor for UV mapping (default: 1.0)
- `--offsetX`: X offset for UV mapping (default: 0)
- `--offsetY`: Y offset for UV mapping (default: 0)
- `--tolerance`: Color clustering tolerance in RGB distance (default: 12)
- `--out`: Output 3MF file path (default: output.3mf)

## How it works

1. Loads an STL file and extracts vertices and faces
2. Loads an image (PNG/JPG) for texture mapping
3. Projects the image onto the model using planar projection along the specified axis
4. Samples each face's average color from the image
5. Clusters faces by color similarity using Euclidean RGB distance
6. Creates separate meshes for each color cluster
7. Exports a multi-part 3MF file with basematerials and colored objects

The output 3MF file is compatible with Bambu Studio and other 3MF viewers that support multi-material printing.
