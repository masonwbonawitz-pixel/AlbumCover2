# Backend API Documentation

## Server Overview

The backend is a **Flask** application that handles:
- File generation (OBJ/MTL from STL + PNG)
- Content management (prices, text, images)
- Order processing and storage
- Admin panel API endpoints

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: Configure in deployment environment

---

## Public API Endpoints

### GET `/api/prices`
Get current pricing information.

**Response:**
```json
{
  "48x48": 29.99,
  "75x75": 48.99,
  "96x96": 59.99,
  "stand": 10.00,
  "wall_mounting_dots": 5.99
}
```

**Usage:**
```javascript
const response = await fetch('/api/prices');
const prices = await response.json();
```

---

### GET `/api/images`
Get product image URLs.

**Response:**
```json
{
  "stand": "/product_images/stand_abc123.png",
  "wall_mounting_dots": "/product_images/wall_mounting_dots_def456.png"
}
```

**Usage:**
```javascript
const response = await fetch('/api/images');
const images = await response.json();
```

---

### GET `/api/content`
Get all text content for the site.

**Response:**
```json
{
  "title": "3D Album Cover Mosaic Builder",
  "price_subtitle": "Create colorized 3D prints",
  "upload_image_text": "Choose image file...",
  "upload_subtext": "Will be resized to 75×75 pixels",
  "section_upload": "1. Upload Color Image",
  "section_grid": "2. Select Grid Size",
  // ... more fields
}
```

**Usage:**
```javascript
const response = await fetch('/api/content');
const content = await response.json();
```

**Full Field List:**
- `title` - Main page title
- `price_subtitle` - Subtitle under title
- `upload_image_text` - Upload button text
- `upload_subtext` - Upload description
- `panel_title` - Editor panel title
- `canvas_label` - Canvas label text
- `section_upload` - Upload section label
- `section_grid` - Grid section label
- `section_adjustments` - Adjustments section label
- `section_painting` - Painting section label
- `grid_btn_48` - 48×48 button text
- `grid_btn_75` - 75×75 button text
- `grid_btn_96` - 96×96 button text
- `slider_contrast_label` - Contrast slider label
- `slider_brightness_label` - Brightness slider label
- `slider_tones_label` - Tones slider label
- `label_dimensions` - Dimensions label
- `label_addons` - Addons label
- `stand_name` - Stand product name
- `mounting_name` - Mounting dots product name
- `color_black_title` - Black color label
- `color_darkgray_title` - Dark gray color label
- `color_lightgray_title` - Light gray color label
- `color_white_title` - White color label
- `info_title` - Info box title
- `info_description` - Info box description
- `info_additional` - Info box additional text
- `howto_title` - How-to section title
- `howto_content` - How-to section content (multiline)

---

### GET `/get-stl/<size>`
Get STL file for specified grid size.

**Parameters:**
- `size` - Grid size (48, 75, or 96)

**Response:**
- File download (STL file)

**Usage:**
```javascript
const response = await fetch('/get-stl/75');
const stlBlob = await response.blob();
```

**Error Responses:**
- `400` - Invalid grid size
- `404` - STL file not found

---

### POST `/generate-obj`
Generate OBJ and MTL files from STL and PNG.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `stl` - STL file (file)
  - `png` - PNG file (file)
  - `grid_size` - Grid size (string: "48", "75", or "96")

**Response:**
- ZIP file containing:
  - `output.obj`
  - `output.mtl`

**Usage:**
```javascript
const formData = new FormData();
formData.append('stl', stlFile);
formData.append('png', pngFile);
formData.append('grid_size', '75');

const response = await fetch('/generate-obj', {
    method: 'POST',
    body: formData
});

const zipBlob = await response.blob();
// Download or extract ZIP
```

**Error Responses:**
- `400` - Missing files or invalid parameters
- `500` - Processing error (see error message)

---

### POST `/upload-for-checkout`
Process order and save files to server.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `stl` - STL file (file)
  - `png` - PNG file (file)
  - `grid_size` - Grid size (string)
  - `stand_selected` - Boolean string ("true" or "false")
  - `mounting_selected` - Boolean string ("true" or "false")
  - `total_price` - Total price (float string)

**Response:**
```json
{
  "order_id": "ea061789-ac95-4654-b993-2199c99b77d3",
  "price": 58.99,
  "grid_size": 75,
  "message": "Order prepared successfully"
}
```

**Usage:**
```javascript
const formData = new FormData();
formData.append('stl', stlFile);
formData.append('png', pngFile);
formData.append('grid_size', '75');
formData.append('stand_selected', 'true');
formData.append('mounting_selected', 'false');
formData.append('total_price', '58.99');

const response = await fetch('/upload-for-checkout', {
    method: 'POST',
    body: formData
});

const result = await response.json();
// result.order_id contains the order ID
```

**Files Saved:**
- `orders/{order_id}/model.obj`
- `orders/{order_id}/model.mtl`
- `orders/{order_id}/original.png`
- `orders/{order_id}/model.stl`

**Order Metadata Saved:**
- Saved to `orders.json` with:
  - `order_id`
  - `timestamp`
  - `grid_size`
  - `dimensions`
  - `base_price`
  - `stand_selected`
  - `mounting_selected`
  - `total_price`
  - `addons` (array)
  - `completed` (boolean)

**Error Responses:**
- `400` - Missing files or invalid parameters
- `500` - Processing error

---

### GET `/product_images/<filename>`
Serve product images.

**Parameters:**
- `filename` - Image filename (e.g., `stand_abc123.png`)

**Response:**
- Image file with no-cache headers

**Usage:**
```javascript
const imageUrl = '/product_images/stand_abc123.png';
// Use as <img src={imageUrl} />
```

---

## Admin API Endpoints

All admin endpoints require proper authentication (currently public - should add auth).

### GET `/admin/prices/api`
Get prices (admin view, same as public endpoint).

**Response:**
```json
{
  "48x48": 29.99,
  "75x75": 48.99,
  "96x96": 59.99,
  "stand": 10.00,
  "wall_mounting_dots": 5.99
}
```

---

### POST `/admin/prices/api`
Update prices.

**Request:**
```json
{
  "48x48": 29.99,
  "75x75": 48.99,
  "96x96": 59.99,
  "stand": 10.00,
  "wall_mounting_dots": 5.99
}
```

**Response:**
```json
{
  "success": true,
  "prices": { ... }
}
```

**Usage:**
```javascript
const prices = {
    "48x48": 29.99,
    "75x75": 48.99,
    "96x96": 59.99,
    "stand": 10.00,
    "wall_mounting_dots": 5.99
};

const response = await fetch('/admin/prices/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prices)
});
```

---

### GET `/admin/images/api`
Get product images (admin view).

**Response:**
```json
{
  "stand": "/product_images/stand_abc123.png",
  "wall_mounting_dots": "/product_images/wall_mounting_dots_def456.png"
}
```

---

### POST `/admin/images/api`
Upload product image.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `image` - Image file
  - `key` - Image key ("stand" or "wall_mounting_dots")

**Response:**
```json
{
  "success": true,
  "imageUrl": "/product_images/stand_abc123.png"
}
```

**Usage:**
```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('key', 'stand');

const response = await fetch('/admin/images/api', {
    method: 'POST',
    body: formData
});
```

---

### GET `/admin/content/api`
Get content (admin view, same as public but editable).

---

### POST `/admin/content/api`
Update content.

**Request:**
```json
{
  "title": "New Title",
  "upload_image_text": "New upload text",
  // ... any fields from content.json
}
```

**Response:**
```json
{
  "success": true,
  "content": { ... }
}
```

**Usage:**
```javascript
const content = {
    title: "New Title",
    upload_image_text: "New upload text"
    // ... more fields
};

const response = await fetch('/admin/content/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
});
```

---

### GET `/admin/stl/api`
Get STL file status.

**Response:**
```json
{
  "48x48": true,
  "75x75": true,
  "96x96": false
}
```

---

### POST `/admin/stl/api`
Upload STL file.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `stl` - STL file
  - `size` - Grid size ("48", "75", or "96")

**Response:**
```json
{
  "success": true,
  "filename": "75x75_grid.stl"
}
```

**Usage:**
```javascript
const formData = new FormData();
formData.append('stl', stlFile);
formData.append('size', '75');

const response = await fetch('/admin/stl/api', {
    method: 'POST',
    body: formData
});
```

---

### GET `/admin/orders/api`
Get all orders.

**Response:**
```json
[
  {
    "order_id": "ea061789-ac95-4654-b993-2199c99b77d3",
    "timestamp": "2024-01-15T10:30:00",
    "grid_size": 75,
    "dimensions": "75×75",
    "base_price": 48.99,
    "stand_selected": true,
    "mounting_selected": false,
    "total_price": 58.99,
    "addons": ["Stand"],
    "completed": false
  }
]
```

**Orders are returned in reverse chronological order (newest first).**

---

### POST `/admin/orders/api`
Update order (mark as completed/uncompleted).

**Request:**
```json
{
  "order_id": "ea061789-ac95-4654-b993-2199c99b77d3",
  "completed": true
}
```

**Response:**
```json
{
  "success": true
}
```

---

### DELETE `/admin/orders/api?order_id=<id>`
Delete an order.

**Query Parameters:**
- `order_id` - Order ID to delete

**Response:**
```json
{
  "success": true
}
```

**Also deletes order directory and all files.**

---

### GET `/admin/orders/download/<order_id>/<filename>`
Download order file.

**Parameters:**
- `order_id` - Order ID
- `filename` - File name (e.g., "model.obj", "model.mtl", "original.png", "model.stl")

**Response:**
- File download

**Usage:**
```javascript
const url = `/admin/orders/download/${orderId}/model.obj`;
// Open in new window or use download link
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include JSON with error message:
```json
{
  "error": "Error message here"
}
```

---

## CORS Configuration

CORS is enabled for:
- `/admin/*`
- `/api/*`
- `/product_images/*`

All origins are allowed (should restrict in production).

---

## File Storage Structure

```
project/
├── product_images/
│   ├── stand_abc123.png
│   └── wall_mounting_dots_def456.png
├── stl_files/
│   ├── 48x48_grid.stl
│   ├── 75x75_grid.stl
│   └── 96x96_grid.stl
├── orders/
│   └── {order_id}/
│       ├── model.obj
│       ├── model.mtl
│       ├── original.png
│       └── model.stl
├── prices.json
├── content.json
├── images.json
└── orders.json
```

---

## Processing Pipeline

### OBJ Generation Process

1. **Load STL**
   - Parse STL file using trimesh
   - Extract vertices and faces
   - Check if mesh is watertight (repair if needed)

2. **Load PNG**
   - Load image using PIL
   - Resize to grid size
   - Convert to RGB array

3. **Map Colors**
   - Calculate triangle centroids in XY plane
   - Map each centroid to image pixel
   - For grid modes: snap to grid cells
   - For normal mode: continuous mapping

4. **Quantize Colors**
   - Map all colors to 4-color palette
   - Use Euclidean distance to find closest color
   - Ensure exact palette values

5. **Generate OBJ**
   - Duplicate vertices per triangle (prevents color interpolation)
   - Assign colors to vertices
   - Write OBJ file with vertex colors
   - Generate MTL file (if needed)

6. **Return Files**
   - Package as ZIP (for `/generate-obj`)
   - Or save to order directory (for `/upload-for-checkout`)

---

## Cache Headers

Product images and content API responses include no-cache headers:
```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

This ensures admin changes are immediately visible.

