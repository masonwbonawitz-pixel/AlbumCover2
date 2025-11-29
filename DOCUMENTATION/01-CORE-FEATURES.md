# Core Features Documentation

## Feature 1: Image Upload & Processing

### Description
Users can upload images in multiple formats (PNG, JPG, HEIC) which are automatically processed and prepared for the 3D mapping process.

### Implementation Details

#### File Upload Handler
```javascript
// Location: mobile/index.html & desktop.html
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Handle HEIC format conversion
    if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        heic2any({
            blob: file,
            toType: "image/png",
            quality: 1.0
        }).then(conversionResult => {
            // Process converted image
            const convertedFile = conversionResult;
            processImageFile(convertedFile);
        });
    } else {
        processImageFile(file);
    }
}
```

#### Image Processing Steps
1. **Load Image**: Create Image object from file
2. **Resize to Grid Size**: Resize to selected grid size (48, 75, or 96 pixels)
3. **Create Canvas**: Draw resized image to canvas
4. **Store Image Data**: Save canvas image data for editing
5. **Display Preview**: Show processed image in preview area

#### Key Functions
- `loadImage(file)` - Loads image file into Image object
- `resizeImageToGrid(img, gridSize)` - Resizes image to exact grid dimensions
- `drawImageToCanvas(img, canvas)` - Draws image to canvas element
- `getImageDataFromCanvas(canvas)` - Extracts ImageData for editing

### State Variables
- `originalImage` - Original uploaded image
- `currentImageData` - Current ImageData object after edits
- `selectedGridSize` - Currently selected grid size (48, 75, or 96)
- `isImageLoaded` - Boolean flag for image load status

### UI Components
- File input element (hidden, styled as upload area)
- Upload area with drag-and-drop visual feedback
- Image preview canvas showing processed image
- Loading indicator during processing

---

## Feature 2: Grid Size Selection

### Description
Users can select from three grid sizes that determine the resolution and pricing of their 3D model.

### Grid Size Options

#### 48×48 (Normal Mode)
- **Price**: Configurable (default: $29.99)
- **Resolution**: 48×48 pixels
- **Use Case**: Lower detail, faster processing, lower price
- **Color Mode**: Texture mapping with full color preservation
- **File Output**: OBJ with UV texture mapping

#### 75×75 (Standard Mode)
- **Price**: Configurable (default: $48.99)
- **Resolution**: 75×75 pixels
- **Use Case**: Balanced detail and price (most popular)
- **Color Mode**: 4-color quantization with vertex colors
- **File Output**: OBJ with vertex colors

#### 96×96 (High Detail Mode)
- **Price**: Configurable (default: $59.99)
- **Resolution**: 96×96 pixels
- **Use Case**: Highest detail, highest price
- **Color Mode**: 4-color quantization with vertex colors
- **File Output**: OBJ with vertex colors

### Implementation
```javascript
function selectGridSize(size) {
    selectedGridSize = size;
    
    // Update UI
    document.querySelectorAll('.grid-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-size="${size}"]`).classList.add('active');
    
    // Resize image if already loaded
    if (isImageLoaded) {
        resizeImageToGrid(originalImage, size);
    }
    
    // Update price display
    updatePrice();
}
```

### State Management
- `selectedGridSize` - Current grid size selection
- Price calculation updates automatically
- Image resizing triggered on selection change

---

## Feature 3: Image Editing Tools

### Tool 1: Crop & Resize

#### Description
Allows users to select a square region of their image to use for the mosaic.

#### Functionality
- Drag-to-select crop area
- Enforces square aspect ratio
- Visual overlay showing crop selection
- Preview of cropped result

#### Implementation
```javascript
function initCropTool() {
    // Create crop overlay canvas
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    // Track mouse drag
    let isDragging = false;
    let startX, startY, cropX, cropY, cropSize;
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.offsetX;
        startY = e.offsetY;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Calculate square crop area
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        cropSize = Math.max(Math.abs(width), Math.abs(height));
        
        // Draw crop overlay
        drawCropOverlay(cropX, cropY, cropSize);
    });
    
    canvas.addEventListener('mouseup', () => {
        if (isDragging) {
            applyCrop(cropX, cropY, cropSize);
            isDragging = false;
        }
    });
}

function applyCrop(x, y, size) {
    // Extract cropped region
    const croppedImageData = ctx.getImageData(x, y, size, size);
    
    // Resize to grid size
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = selectedGridSize;
    resizedCanvas.height = selectedGridSize;
    const resizedCtx = resizedCanvas.getContext('2d');
    
    // Draw cropped image resized to grid
    resizedCtx.drawImage(sourceCanvas, x, y, size, size, 0, 0, selectedGridSize, selectedGridSize);
    
    // Update main canvas
    updateCanvas(resizedCanvas);
}
```

#### UI Elements
- Crop button to activate tool
- Visual crop overlay (blue border)
- Apply crop button (hidden in current implementation)
- Cancel button (hidden in current implementation)

### Tool 2: Adjust

#### Description
Provides image adjustment controls for brightness, contrast, and color quantization levels.

#### Controls

##### Contrast Slider
- **Range**: 0.5 to 2.0
- **Default**: 1.2
- **Effect**: Adjusts contrast by multiplying pixel values
- **Formula**: `adjustedValue = (pixelValue - 128) * contrast + 128`

##### Brightness Slider
- **Range**: 0.5 to 1.5
- **Default**: 1.0
- **Effect**: Multiplies all pixel values
- **Formula**: `adjustedValue = pixelValue * brightness`

##### Tones Slider
- **Range**: 2 to 8 levels
- **Default**: 4 levels
- **Effect**: Quantizes colors to N levels (posterization)
- **Formula**: `quantizedValue = Math.floor(pixelValue / (255 / tones)) * (255 / tones)`

#### Implementation
```javascript
function applyAdjustments() {
    const contrast = parseFloat(contrastSlider.value);
    const brightness = parseFloat(brightnessSlider.value);
    const tones = parseInt(tonesSlider.value);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply adjustments to each pixel
    for (let i = 0; i < data.length; i += 4) {
        // Get RGB values
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Apply brightness
        r = Math.min(255, Math.max(0, r * brightness));
        g = Math.min(255, Math.max(0, g * brightness));
        b = Math.min(255, Math.max(0, b * brightness));
        
        // Apply contrast
        r = Math.min(255, Math.max(0, (r - 128) * contrast + 128));
        g = Math.min(255, Math.max(0, (g - 128) * contrast + 128));
        b = Math.min(255, Math.max(0, (b - 128) * contrast + 128));
        
        // Convert to grayscale
        const gray = (r + g + b) / 3;
        
        // Apply tone quantization
        const quantizedGray = Math.floor(gray / (255 / tones)) * (255 / tones);
        
        // Update pixel
        data[i] = quantizedGray;     // R
        data[i + 1] = quantizedGray; // G
        data[i + 2] = quantizedGray; // B
        // data[i + 3] = 255; // Alpha (unchanged)
    }
    
    // Put adjusted image data back
    ctx.putImageData(imageData, 0, 0);
    currentImageData = imageData;
}
```

#### Real-time Updates
- Sliders trigger immediate canvas updates
- No "Apply" button needed (auto-applies)
- Visual feedback as user adjusts

### Tool 3: Paint

#### Description
Allows manual color editing using the 4-color palette.

#### Color Palette
```javascript
const COLOR_PALETTE = [
    { name: 'Black', rgb: [0, 0, 0], hex: '#000000' },
    { name: 'Dark Gray', rgb: [85, 85, 85], hex: '#555555' },
    { name: 'Light Gray', rgb: [170, 170, 170], hex: '#AAAAAA' },
    { name: 'White', rgb: [255, 255, 255], hex: '#FFFFFF' }
];
```

#### Implementation
```javascript
function initPaintTool() {
    let selectedColor = COLOR_PALETTE[0]; // Default to black
    let isPainting = false;
    
    // Color swatch selection
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            // Remove active class from all
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            
            // Add active class to clicked
            swatch.classList.add('selected');
            
            // Get color from data attribute
            const colorData = swatch.getAttribute('data-color');
            const [r, g, b] = colorData.split(',').map(Number);
            selectedColor = { r, g, b };
        });
    });
    
    // Canvas painting
    canvas.addEventListener('mousedown', (e) => {
        if (currentTool !== 'paint') return;
        isPainting = true;
        paintPixel(e.offsetX, e.offsetY, selectedColor);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isPainting) return;
        paintPixel(e.offsetX, e.offsetY, selectedColor);
    });
    
    canvas.addEventListener('mouseup', () => {
        isPainting = false;
    });
}

function paintPixel(x, y, color) {
    // Get pixel coordinates
    const pixelX = Math.floor(x * (canvas.width / canvas.offsetWidth));
    const pixelY = Math.floor(y * (canvas.height / canvas.offsetHeight));
    
    // Convert to grayscale and quantize to nearest palette color
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const index = (pixelY * canvas.width + pixelX) * 4;
    
    // Set pixel to selected color
    data[index] = color.r;     // R
    data[index + 1] = color.g; // G
    data[index + 2] = color.b; // B
    
    // Put image data back
    ctx.putImageData(imageData, 0, 0);
    currentImageData = imageData;
}
```

#### Features
- Click to paint single pixels
- Drag to paint multiple pixels
- Color quantization to nearest palette color
- Visual feedback on selected color

---

## Feature 4: 3D Model Generation

### Description
Generates colored 3D models by mapping image pixels to STL mesh triangles.

### Process Flow

1. **Load STL File**
   - Fetch STL from server endpoint `/get-stl/<size>`
   - Or use user-uploaded STL file
   - Parse STL using Three.js STLLoader

2. **Process Image**
   - Get current canvas image data
   - Convert to PNG format
   - Quantize colors to 4-color palette

3. **Map Colors to Mesh**
   - Calculate triangle centroids in XY plane
   - Map each triangle centroid to image pixel
   - Assign pixel color to triangle

4. **Generate Files**
   - Create OBJ file with vertex colors
   - Create MTL file (if needed)
   - For Normal mode: Create OBJ with UV texture mapping

### Implementation

#### STL Loading
```javascript
function loadSTL(size) {
    const loader = new THREE.STLLoader();
    
    // Try to load from server first
    fetch(`/get-stl/${size}`)
        .then(response => {
            if (!response.ok) throw new Error('STL not found');
            return response.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const geometry = loader.parse(e.target.result);
                stlGeometry = geometry;
                setup3DViewer();
            };
            reader.readAsArrayBuffer(blob);
        })
        .catch(error => {
            // Fallback: prompt user to upload STL
            document.getElementById('stl-upload-input').click();
        });
}
```

#### Color Mapping
```javascript
function applyColorsToMesh(geometry, imageData) {
    const vertices = geometry.attributes.position.array;
    const faces = geometry.index ? geometry.index.array : [];
    
    // Create color attribute
    const colors = new Float32Array(vertices.length);
    
    // Calculate triangle centroids and map to image
    for (let i = 0; i < faces.length; i += 3) {
        const v1Index = faces[i] * 3;
        const v2Index = faces[i + 1] * 3;
        const v3Index = faces[i + 2] * 3;
        
        // Get vertex positions
        const v1 = new THREE.Vector3(
            vertices[v1Index],
            vertices[v1Index + 1],
            vertices[v1Index + 2]
        );
        const v2 = new THREE.Vector3(
            vertices[v2Index],
            vertices[v2Index + 1],
            vertices[v2Index + 2]
        );
        const v3 = new THREE.Vector3(
            vertices[v3Index],
            vertices[v3Index + 1],
            vertices[v3Index + 2]
        );
        
        // Calculate centroid
        const centroid = new THREE.Vector3()
            .add(v1)
            .add(v2)
            .add(v3)
            .multiplyScalar(1/3);
        
        // Map to image pixel
        const pixelX = Math.floor((centroid.x - minX) / (maxX - minX) * imageWidth);
        const pixelY = Math.floor((1 - (centroid.y - minY) / (maxY - minY)) * imageHeight);
        
        // Get pixel color
        const pixelIndex = (pixelY * imageWidth + pixelX) * 4;
        const r = imageData.data[pixelIndex];
        const g = imageData.data[pixelIndex + 1];
        const b = imageData.data[pixelIndex + 2];
        
        // Apply color to triangle vertices
        colors[v1Index] = r / 255;
        colors[v1Index + 1] = g / 255;
        colors[v1Index + 2] = b / 255;
        // ... repeat for v2 and v3
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}
```

### Backend Processing

The backend processes STL and PNG files to generate OBJ files:

```python
# server.py - generate_obj_from_inputs()
def generate_obj_from_inputs(stl_bytes, png_bytes, grid_size):
    # Load and process image
    img = load_png(png_bytes, grid_size)
    img_array = get_png_as_array(img)
    
    # Load STL mesh
    vertices, faces = load_stl_vertices_faces(stl_bytes)
    
    # Map colors to triangles
    triangle_colors = get_triangle_colors_from_image(vertices, faces, img_array, grid_size)
    
    # Quantize to 4 colors
    triangle_colors = quantize_to_four_colors(triangle_colors)
    
    # Generate OBJ file
    obj_bytes, mtl_bytes = write_obj_with_colors(vertices, faces, triangle_colors)
    
    return obj_bytes, mtl_bytes, None
```

---

## Feature 5: 3D Viewer

### Description
Interactive 3D viewer using Three.js to preview the colored model in real-time.

### Components

#### Scene Setup
```javascript
function setup3DViewer() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75, // FOV
        container.offsetWidth / container.offsetHeight, // Aspect
        0.1, // Near
        1000 // Far
    );
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Load and add mesh
    loadAndDisplayMesh();
    
    // Start animation loop
    animate();
}
```

#### Controls
- **Orbit**: Left-click drag to rotate
- **Zoom**: Scroll wheel or pinch
- **Pan**: Right-click drag or middle-click drag

#### Animation Loop
```javascript
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
```

### Toggle Between Views
- Default: Editor view (canvas with editing tools)
- Toggle: 3D view (interactive 3D model)
- Button: "View in 3D" / "Back to Editor"

---

## Feature 6: Pricing System

### Description
Dynamic pricing based on grid size and selected add-ons.

### Price Structure

```javascript
const PRICES = {
    '48x48': 29.99,
    '75x75': 48.99,
    '96x96': 59.99,
    'stand': 10.00,
    'wall_mounting_dots': 5.99
};
```

### Price Calculation
```javascript
function calculatePrice() {
    let basePrice = PRICES[`${selectedGridSize}x${selectedGridSize}`];
    
    if (standSelected) {
        basePrice += PRICES.stand;
    }
    
    if (mountingSelected) {
        basePrice += PRICES.wall_mounting_dots;
    }
    
    return basePrice;
}

function updatePrice() {
    const totalPrice = calculatePrice();
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}
```

### Price Display
- Shows base price for selected grid size
- Updates in real-time as add-ons are toggled
- Displayed prominently in checkout area

---

## Feature 7: Checkout Process

### Description
Handles the order submission process, generating files and creating order records.

### Process Flow

1. **Validate Input**
   - Check image is loaded
   - Check STL is available
   - Verify grid size selected

2. **Prepare Files**
   - Get current canvas image as PNG
   - Get STL file (from server or user upload)
   - Prepare form data with files and metadata

3. **Submit to Backend**
   - POST to `/upload-for-checkout`
   - Send: STL file, PNG file, grid_size, addons, total_price
   - Receive: order_id, confirmation message

4. **Order Processing** (Backend)
   - Generate unique order ID (UUID)
   - Create order directory
   - Generate OBJ and MTL files
   - Save all files (OBJ, MTL, PNG, STL)
   - Create order metadata JSON
   - Save to orders.json

5. **Confirmation**
   - Display order ID to user
   - Option to download files
   - Redirect to success page (future: Shopify checkout)

### Implementation

```javascript
async function proceedToCheckout() {
    // Validate
    if (!isImageLoaded) {
        alert('Please upload and process an image first');
        return;
    }
    
    // Get image as PNG
    const pngBlob = await canvasToBlob(canvas, 'image/png');
    
    // Get STL file
    let stlBlob;
    if (uploadedSTLFile) {
        stlBlob = uploadedSTLFile;
    } else {
        // Fetch from server
        const stlResponse = await fetch(`/get-stl/${selectedGridSize}`);
        stlBlob = await stlResponse.blob();
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('stl', stlBlob, 'model.stl');
    formData.append('png', pngBlob, 'image.png');
    formData.append('grid_size', selectedGridSize);
    formData.append('stand_selected', standSelected);
    formData.append('mounting_selected', mountingSelected);
    formData.append('total_price', calculatePrice());
    
    // Submit
    try {
        const response = await fetch('/upload-for-checkout', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.order_id) {
            // Success - redirect to Shopify checkout with order ID
            window.location.href = `/checkout?order_id=${result.order_id}`;
        } else {
            alert('Error creating order: ' + result.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
```

---

## Feature 8: Responsive Design

### Mobile Version
- Simplified layout (single column)
- Touch-optimized controls
- Smaller preview sizes
- Collapsible sections
- Bottom navigation

### Desktop Version
- Two-panel layout (viewer + controls)
- Larger preview areas
- More detailed information
- Side-by-side tool panels

### Device Detection
```javascript
function isMobileDevice() {
    // Check screen width
    if (window.innerWidth <= 1024) return true;
    
    // Check user agent
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}
```

### Routing
- `/` - Auto-redirect based on device
- `/mobile/` - Force mobile version
- `/desktop/` - Force desktop version

