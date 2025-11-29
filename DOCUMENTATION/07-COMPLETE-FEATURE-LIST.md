# Complete Feature List

This document lists every feature, component, and functionality in the application for reference during React migration.

---

## Frontend Features

### 1. Image Upload & Processing
- ✅ File upload (PNG, JPG, HEIC/HEIF)
- ✅ HEIC to PNG conversion
- ✅ Image resizing to grid size (48×48, 75×75, 96×96)
- ✅ Image preview display
- ✅ Drag-and-drop support (can be added)

### 2. Grid Size Selection
- ✅ Three grid size options: 48×48, 75×75, 96×96
- ✅ Visual button selection with active state
- ✅ Price updates based on selection
- ✅ Image auto-resize on grid change
- ✅ Different processing modes per grid size

### 3. Image Editing Tools

#### Crop Tool
- ✅ Drag-to-select crop area
- ✅ Square aspect ratio enforcement
- ✅ Visual crop overlay
- ✅ Preview of cropped result
- ⚠️ Apply/Cancel buttons (hidden in current implementation)

#### Adjust Tool
- ✅ Contrast slider (0.5-2.0, default: 1.2)
- ✅ Brightness slider (0.5-1.5, default: 1.0)
- ✅ Tones slider (2-8 levels, default: 4)
- ✅ Real-time canvas updates
- ✅ Value display next to sliders

#### Paint Tool
- ✅ 4-color palette selection
- ✅ Click to paint pixels
- ✅ Drag to paint multiple pixels
- ✅ Color quantization to palette
- ✅ Visual feedback for selected color

### 4. 3D Viewer
- ✅ Three.js integration
- ✅ STL file loading
- ✅ Color mapping to mesh
- ✅ Orbit controls (rotate, zoom, pan)
- ✅ Lighting setup (ambient + directional)
- ✅ Toggle between editor and 3D view
- ✅ Reset camera button
- ✅ Back to editor button

### 5. Product Customization
- ✅ Stand add-on toggle
- ✅ Wall mounting dots add-on toggle
- ✅ Product images display
- ✅ Add-on prices
- ✅ Real-time price calculation

### 6. Pricing Display
- ✅ Base price for grid size
- ✅ Add-on prices
- ✅ Total price calculation
- ✅ Price breakdown display
- ✅ Dimensions display
- ✅ Add-ons list display

### 7. Checkout Process
- ✅ Order file generation (OBJ, MTL)
- ✅ Order ID generation (UUID)
- ✅ File upload to server
- ✅ Order metadata creation
- ✅ Order confirmation
- ⚠️ Shopify checkout (to be implemented)

### 8. Responsive Design
- ✅ Device detection
- ✅ Mobile/desktop routing
- ✅ Mobile-optimized layout
- ✅ Desktop two-panel layout
- ✅ Responsive breakpoints

---

## Backend Features

### 1. File Processing
- ✅ STL file parsing (trimesh)
- ✅ PNG image processing (PIL)
- ✅ Mesh repair (watertight check)
- ✅ Color mapping algorithm
- ✅ Color quantization (4-color palette)
- ✅ OBJ file generation
- ✅ MTL file generation
- ✅ Vertex color assignment
- ✅ UV texture mapping (Normal mode)

### 2. API Endpoints

#### Public APIs
- ✅ `GET /api/prices` - Get pricing
- ✅ `GET /api/images` - Get product images
- ✅ `GET /api/content` - Get text content
- ✅ `GET /get-stl/<size>` - Get STL file
- ✅ `POST /generate-obj` - Generate OBJ/MTL
- ✅ `POST /upload-for-checkout` - Process order
- ✅ `GET /product_images/<filename>` - Serve images

#### Admin APIs
- ✅ `GET /admin/prices/api` - Get prices
- ✅ `POST /admin/prices/api` - Update prices
- ✅ `GET /admin/images/api` - Get images
- ✅ `POST /admin/images/api` - Upload images
- ✅ `GET /admin/content/api` - Get content
- ✅ `POST /admin/content/api` - Update content
- ✅ `GET /admin/stl/api` - Get STL status
- ✅ `POST /admin/stl/api` - Upload STL
- ✅ `GET /admin/orders/api` - Get orders
- ✅ `POST /admin/orders/api` - Update order
- ✅ `DELETE /admin/orders/api` - Delete order
- ✅ `GET /admin/orders/download/<id>/<file>` - Download files

### 3. Order Management
- ✅ Order creation with UUID
- ✅ Order file storage (OBJ, MTL, PNG, STL)
- ✅ Order metadata storage (JSON)
- ✅ Order listing (chronological)
- ✅ Order completion status
- ✅ Bulk order operations
- ✅ Order deletion
- ✅ File download links

### 4. Content Management
- ✅ Dynamic content loading
- ✅ Content editing via admin
- ✅ Default content fallback
- ✅ Content merging with defaults
- ✅ Cache-busting headers

### 5. Image Management
- ✅ Product image upload
- ✅ Image filename generation (UUID)
- ✅ Image storage in `product_images/`
- ✅ Image URL tracking in JSON
- ✅ Image serving with no-cache

---

## Admin Panel Features

### 1. Content Editing
- ✅ Title editing
- ✅ Subtitle editing
- ✅ Section labels editing
- ✅ Button text editing
- ✅ Upload text editing
- ✅ Info box editing
- ✅ How-to instructions editing
- ✅ ContentEditable inline editing
- ✅ Preview panel

### 2. Price Management
- ✅ Grid size price inputs
- ✅ Add-on price inputs
- ✅ Price synchronization
- ✅ Number input validation
- ✅ Real-time price updates

### 3. Image Management
- ✅ Stand image upload
- ✅ Mounting dots image upload
- ✅ Image preview
- ✅ Image replacement
- ✅ Upload progress feedback

### 4. STL Management
- ✅ 48×48 STL upload
- ✅ 75×75 STL upload
- ✅ 96×96 STL upload
- ✅ Upload status display
- ✅ File existence checking

### 5. Order Management
- ✅ Order list display
- ✅ Order details view
- ✅ Order completion toggle
- ✅ Bulk order selection
- ✅ Bulk completion marking
- ✅ Bulk order deletion
- ✅ File download buttons
- ✅ Order filtering (completed/uncompleted)
- ✅ Order search (by ID)

### 6. Save Functionality
- ✅ Save all button
- ✅ Batch save operation
- ✅ Success/error messages
- ✅ Save status feedback
- ✅ Image upload verification

---

## UI Components

### 1. Upload Area
- ✅ Drag-and-drop zone
- ✅ File input (hidden)
- ✅ Upload icon
- ✅ Upload text
- ✅ Upload subtext
- ✅ Click-to-upload

### 2. Grid Buttons
- ✅ Three button layout
- ✅ Active state styling
- ✅ Hover effects
- ✅ Click handlers

### 3. Canvas/Preview
- ✅ Canvas element
- ✅ Image display
- ✅ Label text
- ✅ Square aspect ratio
- ✅ Border styling

### 4. Sliders
- ✅ Range inputs
- ✅ Label display
- ✅ Value display
- ✅ Min/max/step constraints

### 5. Color Palette
- ✅ Four color swatches
- ✅ Selected state
- ✅ Color labels
- ✅ Hover effects

### 6. Toggle Switches
- ✅ Stand toggle
- ✅ Mounting dots toggle
- ✅ Visual slider animation
- ✅ Checked/unchecked states

### 7. Price Display
- ✅ Total price
- ✅ Price breakdown
- ✅ Dimensions display
- ✅ Add-ons list

### 8. Buttons
- ✅ Primary buttons (dark)
- ✅ Secondary buttons (light)
- ✅ Hover states
- ✅ Disabled states
- ✅ Icon buttons

### 9. Admin Components
- ✅ Tab navigation
- ✅ Form inputs
- ✅ ContentEditable elements
- ✅ File upload buttons
- ✅ Status messages
- ✅ Order cards
- ✅ Bulk action controls

---

## Data Structures

### 1. Order Data
```json
{
  "order_id": "uuid",
  "timestamp": "ISO datetime",
  "grid_size": 75,
  "dimensions": "75×75",
  "base_price": 48.99,
  "stand_selected": true,
  "mounting_selected": false,
  "total_price": 58.99,
  "addons": ["Stand"],
  "completed": false
}
```

### 2. Price Data
```json
{
  "48x48": 29.99,
  "75x75": 48.99,
  "96x96": 59.99,
  "stand": 10.00,
  "wall_mounting_dots": 5.99
}
```

### 3. Content Data
```json
{
  "title": "...",
  "price_subtitle": "...",
  "upload_image_text": "...",
  "section_upload": "...",
  "section_grid": "...",
  // ... 30+ more fields
}
```

### 4. Image Data
```json
{
  "stand": "/product_images/stand_abc123.png",
  "wall_mounting_dots": "/product_images/wall_mounting_dots_def456.png"
}
```

---

## Color Palette

### 4-Color Palette
- **Black**: RGB(0, 0, 0)
- **Dark Gray**: RGB(85, 85, 85)
- **Light Gray**: RGB(170, 170, 170)
- **White**: RGB(255, 255, 255)

### UI Colors
- **Background**: #FFFBF5
- **Primary Accent**: #E87D3E
- **Text**: #333333
- **Borders**: #ddd
- **Button Background**: #E0E0E0
- **Active Button**: #333333
- **Price Display**: #2d5016

---

## File Storage

### Directory Structure
```
project/
├── product_images/      # Product images
├── stl_files/          # STL grid files
├── orders/             # Order files
│   └── {order_id}/
│       ├── model.obj
│       ├── model.mtl
│       ├── original.png
│       └── model.stl
├── prices.json         # Price configuration
├── content.json        # Text content
├── images.json         # Image URLs
└── orders.json         # Order metadata
```

---

## Processing Modes

### Normal Mode (48×48)
- Full color preservation
- Texture mapping
- UV coordinates
- Higher detail

### Pixelated Mode (75×75, 96×96)
- 4-color quantization
- Vertex colors
- Grid-based mapping
- Pixelated look

---

## Missing Features (To Add)

### Frontend
- [ ] Drag-and-drop file upload
- [ ] Image rotation
- [ ] Undo/redo functionality
- [ ] Image filters
- [ ] Zoom controls for canvas
- [ ] Full-screen 3D viewer
- [ ] Loading animations
- [ ] Error boundaries
- [ ] Progress indicators

### Backend
- [ ] User authentication
- [ ] Rate limiting
- [ ] Input validation
- [ ] File size limits
- [ ] Database storage (replace JSON)
- [ ] Cloud storage (S3, etc.)
- [ ] Email notifications
- [ ] Order status tracking
- [ ] Analytics

### Admin
- [ ] User management
- [ ] Permission system
- [ ] Activity logs
- [ ] Backup/restore
- [ ] Export orders
- [ ] Statistics dashboard

---

## Technical Specifications

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### File Size Limits
- Image upload: ~10MB
- STL file: ~50MB
- Generated OBJ: ~100MB

### Processing Time
- Image processing: <1 second
- STL loading: <2 seconds
- OBJ generation: 5-30 seconds (depending on size)

---

## Testing Requirements

### Functional Tests
- [ ] Image upload works
- [ ] Grid selection updates
- [ ] Adjustments apply correctly
- [ ] Paint tool functions
- [ ] 3D viewer displays
- [ ] Checkout creates order
- [ ] Admin panel saves data

### Integration Tests
- [ ] API endpoints respond
- [ ] File generation works
- [ ] Order storage works
- [ ] Admin updates reflect

### Performance Tests
- [ ] Large image processing
- [ ] Large STL file loading
- [ ] Multiple concurrent users
- [ ] File download speed

---

## Migration Checklist

When converting to React, ensure all features are preserved:

- [ ] All UI components recreated
- [ ] All functionality working
- [ ] All API calls functional
- [ ] All state management implemented
- [ ] All event handlers working
- [ ] All styling preserved
- [ ] All responsive breakpoints
- [ ] All admin features working
- [ ] All order management features
- [ ] All file processing features

