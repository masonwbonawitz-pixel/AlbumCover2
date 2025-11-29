# Project Overview: 3D Album Cover Mosaic Builder

## What This Project Does

This is a **complete web application** that allows users to create custom 3D printable album cover mosaics. Users upload images, customize them through various tools, and generate colored 3D models ready for 3D printing.

## Core Functionality

### 1. **Image Upload & Processing**
- Users upload images (PNG, JPG, HEIC supported)
- Automatic image resizing to target grid sizes (48×48, 75×75, or 96×96)
- Image editing capabilities (crop, resize, adjust)
- Real-time preview of processed images

### 2. **Grid-Based Color Mapping**
- Three grid size options: 48×48 (Normal mode), 75×75, 96×96
- Each pixel maps to one cube in the 3D STL grid
- Supports 4-color palette: Black, Dark Gray, Light Gray, White
- Color quantization to ensure exact color matching

### 3. **Image Editing Tools**
- **Crop Tool**: Drag-to-select area with square aspect ratio enforcement
- **Adjust Tool**: 
  - Contrast slider (range: 0.5-2.0)
  - Brightness slider (range: 0.5-1.5)
  - Tones slider (number of color levels: 2-8)
- **Paint Tool**: Manual color editing with 4-color palette
- Real-time canvas updates with all edits

### 4. **3D Model Generation**
- Loads STL grid files from server or user upload
- Maps processed image colors to 3D mesh triangles
- Generates OBJ + MTL files with vertex colors
- Supports both texture mapping (Normal mode) and vertex colors (Pixelated modes)

### 5. **3D Viewer**
- Interactive Three.js-based viewer
- Orbit controls (rotate, zoom, pan)
- Real-time rendering with applied colors
- Toggle between editor view and 3D view

### 6. **Product Customization**
- **Add-ons**:
  - Stand option (toggleable, priced separately)
  - Wall mounting dots option (toggleable, priced separately)
- Dynamic price calculation based on grid size and add-ons
- Product images displayed for each add-on

### 7. **Checkout & Order Management**
- Generate unique order ID for each purchase
- Save order files (OBJ, MTL, PNG, STL) to server
- Store order metadata (price, grid size, add-ons, timestamp)
- Admin panel for viewing/managing orders

### 8. **Admin Panel**
- **Content Management**: Edit all text content on the site
- **Price Management**: Set prices for each grid size and add-on
- **Image Management**: Upload product images (stand, mounting dots)
- **Order Management**: View, complete, and delete orders
- **STL File Management**: Upload STL files for each grid size

## Technical Stack

### Frontend
- **HTML/CSS/JavaScript** (vanilla, no framework)
- **Three.js** (r128) for 3D rendering
- **STLLoader** for loading STL files
- **OrbitControls** for camera controls
- **heic2any** library for HEIC image support
- Responsive design with separate mobile/desktop views

### Backend
- **Python Flask** server
- **PIL/Pillow** for image processing
- **NumPy** for array operations
- **Trimesh** for STL mesh processing
- **lib3mf/py3mf** for 3MF file generation
- JSON file storage (prices.json, content.json, images.json, orders.json)

### File Storage
- `product_images/` - Product images (stand, mounting dots)
- `stl_files/` - STL grid files (48×48, 75×75, 96×96)
- `orders/` - Order files organized by order ID
- JSON files for configuration and orders

## Architecture

### Page Structure
1. **index.html** - Landing page with device detection and routing
2. **mobile/index.html** - Mobile-optimized version
3. **desktop.html** (or "Almost finnished.html") - Desktop version
4. **admin.html** - Admin panel interface

### API Endpoints
- `/api/prices` - Get pricing information
- `/api/images` - Get product images
- `/api/content` - Get text content
- `/generate-obj` - Generate OBJ files from STL + PNG
- `/upload-for-checkout` - Process and save order files
- `/admin/*` - Admin API endpoints for content/price/image management

## Key Design Principles

1. **Responsive Design**: Separate mobile and desktop experiences
2. **Real-time Updates**: All edits reflect immediately on canvas
3. **Progressive Enhancement**: Works with or without 3D viewer
4. **Admin-Driven Content**: All text, prices, and images editable via admin
5. **File-Based Storage**: Simple JSON file storage (easily migrateable to database)

## Current Limitations & Future Improvements

- File-based storage (should move to database for production)
- No user authentication (admin panel is public)
- Single-threaded image processing
- No payment integration (order IDs only)
- Local file storage (should use cloud storage for orders)

## Migration Notes for React

When converting to React:
- Each major section becomes a component
- State management for image editing, 3D viewer, pricing
- API calls should use axios/fetch hooks
- Three.js integration via useEffect and refs
- Form state management for admin panel
- React Router for navigation

## Shopify Integration Requirements

For Shopify integration:
- Replace checkout with Shopify checkout
- Use Shopify product variants for grid sizes
- Shopify metafields for order data
- Shopify admin API for order management
- Shopify Files API for storing generated files
- Shopify App Proxy for custom endpoints

