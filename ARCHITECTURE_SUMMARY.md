# Architecture Summary: Frontend, Backend, and STL Generation

## Overview

This is a **3D Album Cover Mosaic Builder** that allows users to upload images, customize them, and generate colored 3D printable models (OBJ/MTL files) from STL grid templates.

---

## Frontend Architecture

### Technology Stack
- **HTML/CSS/JavaScript** (vanilla, no framework)
- **Three.js** (r128) for 3D rendering
- **STLLoader** for loading STL files
- **OrbitControls** for camera interaction
- **heic2any** for HEIC image conversion

### Main Components

#### 1. **Image Upload & Processing**
- Users upload images (PNG, JPG, HEIC supported)
- Images are automatically resized to grid sizes: 48×48, 75×75, or 96×96
- Real-time canvas preview with editing tools

#### 2. **Image Editing Tools**
- **Crop Tool**: Drag-to-select area with square aspect ratio
- **Adjust Tool**: 
  - Contrast slider (0.5-2.0)
  - Brightness slider (0.5-1.5)
  - Tones slider (2-8 color levels)
- **Paint Tool**: Manual color editing with 4-color palette (Black, Dark Gray, Light Gray, White)
- All edits update the canvas in real-time

#### 3. **3D Viewer (Three.js)**
- Loads STL files from server via `/get-stl/<size>` endpoint
- Uses `STLLoader` to parse STL geometry
- `applyColorsToMesh()` function maps processed image pixels to 3D mesh triangles
- Interactive controls: rotate, zoom, pan
- Toggle between editor view and 3D view

#### 4. **Color Mapping Logic** (`applyColorsToMesh()`)
- Maps each triangle in the 3D mesh to a pixel in the processed image
- Uses triangle centroids to determine which pixel to sample
- For pixelated modes (75×75, 96×96): Uses grid-based snapping
- For Normal mode (48×48): Uses pixel-perfect continuous mapping
- Applies colors directly to mesh vertices using Three.js materials

#### 5. **File Generation & Checkout**
- When user clicks checkout, frontend:
  1. Collects STL file (from server or cache)
  2. Collects processed PNG image
  3. Sends both to `/upload-for-checkout` endpoint
  4. Receives order ID and redirects to Shopify checkout

### Key Frontend Files
- `5001/FOR_HOSTING/mobile/index.html` - Mobile version (7227 lines)
- `5001/Almost finnished.html` - Desktop version
- Uses IndexedDB for caching STL files and images locally

---

## Backend Architecture

### Technology Stack
- **Python Flask** server
- **PIL/Pillow** for image processing
- **NumPy** for array operations
- **Trimesh** for STL mesh processing
- **lib3mf/py3mf** for 3MF file generation

### Main Server File
`5001/server.py` (2231 lines) - Contains all backend logic

### Key API Endpoints

#### Public Endpoints
1. **`/`** - Serves mobile or desktop HTML based on user agent
2. **`/get-stl/<size>`** - Serves pre-uploaded STL files (48, 75, or 96)
3. **`/generate-obj`** - Generates OBJ + MTL files from STL + PNG
4. **`/upload-for-checkout`** - Processes order, generates files, saves to `orders/` directory
5. **`/api/prices`** - Returns pricing information from `prices.json`
6. **`/api/images`** - Returns product image URLs from `images.json`
7. **`/api/content`** - Returns text content from `content.json`

#### Admin Endpoints
- `/admin/prices/api` - Get/update prices
- `/admin/images/api` - Get/upload product images
- `/admin/content/api` - Get/update text content
- `/admin/stl/api` - Get/upload STL files
- `/admin/orders/api` - Get/update/delete orders

### Core Processing Functions

#### 1. **STL Processing** (`load_stl_vertices_faces()`)
```python
- Loads STL file using trimesh
- Validates mesh is watertight (manifold)
- Repairs mesh if needed (fill holes, fix normals, remove duplicates)
- Returns vertices and faces as NumPy arrays
```

#### 2. **Color Mapping** (`get_triangle_colors_from_image()`)
```python
- Maps each triangle to a pixel in the processed image
- Uses triangle centroids to determine pixel location
- For Normal mode (48): pixel-perfect continuous mapping
- For pixelated modes (75, 96): grid-based snapping
- Groups triangles by pixel to ensure consistent colors
- Returns array of RGB colors for each triangle
```

#### 3. **Color Quantization** (`quantize_to_four_colors()`)
```python
- Quantizes all colors to 4-color palette:
  - Black: (0, 0, 0)
  - Dark Gray: (85, 85, 85)
  - Light Gray: (170, 170, 170)
  - White: (255, 255, 255)
- Uses Euclidean distance in RGB space to find closest match
- Ensures exact color matching for 3D printing
```

#### 4. **OBJ Generation** (`generate_obj_from_inputs()`)
```python
- Takes STL bytes and PNG bytes as input
- Loads and processes STL mesh
- Maps image colors to triangles
- Quantizes to 4 colors
- Generates OBJ file with material groups (one per color)
- Generates MTL file with material definitions
- Returns (obj_bytes, mtl_bytes, texture_png_bytes)
```

#### 5. **3MF Generation** (`generate_3mf_from_inputs()`)
```python
- Similar to OBJ generation but outputs 3MF format
- Uses lib3mf/py3mf library
- Creates color groups and assigns colors to triangles
- Returns 3MF file bytes
```

### File Storage Structure
```
5001/
├── stl_files/          # Pre-uploaded STL grid files
│   ├── 48x48_grid.stl
│   ├── 75x75_grid.stl
│   └── 96x96_grid.stl
├── product_images/      # Product images (stand, mounting dots)
├── orders/             # Order files organized by order ID
│   └── <order_id>/
│       ├── model.obj
│       ├── model.mtl
│       ├── texture.png
│       ├── original.png
│       └── model.stl
├── prices.json         # Pricing configuration
├── images.json         # Product image URLs
├── content.json        # Text content
└── orders.json         # Order metadata
```

---

## STL File Generation

### ⚠️ Important: STL Files Are NOT Generated

**STL files are pre-uploaded templates, not generated by the application.**

### STL File Source
- STL files are **manually created** grid templates (48×48, 75×75, 96×96 cubes)
- Stored in `5001/stl_files/` directory
- Uploaded via admin panel at `/admin/stl/api`
- Served to frontend via `/get-stl/<size>` endpoint

### STL File Structure
- Each STL file contains a grid of cubes (bricks)
- Each cube is made of 12 triangles (2 per face)
- Grid dimensions match the selected size (48×48, 75×75, or 96×96)
- STL files are static templates - the application maps colors to them

### STL Loading Flow
1. User selects grid size (48, 75, or 96)
2. Frontend calls `/get-stl/<size>` to fetch STL file
3. Backend serves STL file from `stl_files/` directory
4. Frontend loads STL using Three.js `STLLoader`
5. Frontend maps processed image colors to STL mesh triangles
6. User can view colored 3D model in viewer

### What IS Generated
The application generates:
- **OBJ files** - 3D model with vertex colors
- **MTL files** - Material definitions for colors
- **3MF files** - Alternative 3D format with embedded colors

These are generated from the **STL template + processed PNG image**.

---

## Data Flow

### Complete User Journey

1. **User uploads image** → Frontend processes and displays on canvas
2. **User edits image** → Crop, adjust, paint tools update canvas
3. **User selects grid size** → Frontend loads corresponding STL from server
4. **User views 3D model** → Frontend maps canvas colors to STL triangles
5. **User clicks checkout** → Frontend sends STL + PNG to `/upload-for-checkout`
6. **Backend processes** → Generates OBJ + MTL files with colors
7. **Backend saves** → Files saved to `orders/<order_id>/` directory
8. **Backend returns** → Order ID sent to frontend
9. **Frontend redirects** → User redirected to Shopify checkout

### Color Mapping Process

1. **Image Processing**: User's image is resized to grid size (e.g., 75×75 pixels)
2. **Color Quantization**: Image colors are quantized to 4-color palette
3. **STL Loading**: STL grid template is loaded (contains cube geometry)
4. **Triangle Mapping**: Each triangle in STL is mapped to a pixel in processed image
5. **Color Application**: Triangle colors are applied to mesh vertices
6. **File Generation**: OBJ/MTL files are generated with material groups per color

---

## Key Design Decisions

1. **4-Color Palette**: Limited to 4 colors (Black, Dark Gray, Light Gray, White) for 3D printing compatibility
2. **Grid-Based Mapping**: Each pixel maps to one cube in the STL grid
3. **Material Groups**: OBJ files use separate materials for each color to ensure exact color matching
4. **Watertight Meshes**: STL files are validated and repaired to ensure they're watertight (printable)
5. **Real-time Preview**: All edits update the canvas immediately for instant feedback

---

## Summary

- **Frontend**: HTML/JS with Three.js for 3D rendering, handles image editing and 3D visualization
- **Backend**: Flask server that processes STL + PNG to generate colored OBJ/MTL files
- **STL Files**: Pre-uploaded grid templates (NOT generated), stored in `stl_files/` directory
- **Color Mapping**: Each pixel in processed image maps to one cube in STL grid
- **File Generation**: Backend generates OBJ/MTL files with vertex colors from STL template + processed image

