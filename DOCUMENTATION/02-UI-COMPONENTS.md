# UI Components Documentation

## Component Structure

### Desktop Layout

```
┌─────────────────────────────────────────────────────────┐
│ Main Container (flex, row)                              │
├───────────────────────────┬─────────────────────────────┤
│ Viewer Panel (flex: 1)    │ Control Panel (flex: 1)     │
│                           │                             │
│ - Editor Canvas          │ - Title                      │
│ - 3D Viewer              │ - Price                      │
│ - Viewer Controls        │ - Upload Section             │
│                          │ - Grid Selection             │
│                          │ - Image Adjustments          │
│                          │ - Painting Tools             │
│                          │ - Add-ons                    │
│                          │ - Checkout Button            │
└───────────────────────────┴─────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ Main Container (column)     │
├─────────────────────────────┤
│ Viewer/Editor Panel         │
│ - Canvas/3D Viewer          │
│ - Viewer Controls           │
├─────────────────────────────┤
│ Control Panel               │
│ - Title                     │
│ - Upload                    │
│ - Grid Selection            │
│ - Adjustments               │
│ - Painting                  │
│ - Add-ons                   │
│ - Checkout                  │
└─────────────────────────────┘
```

---

## Component 1: Upload Area

### HTML Structure
```html
<div class="section">
    <div class="section-label">1. Upload Color Image</div>
    <div class="upload-area" onclick="document.getElementById('image-input').click()">
        <div class="upload-icon">🖼️</div>
        <div class="upload-text">Choose image file...</div>
        <div class="upload-subtext">Will be resized to 75×75 pixels</div>
    </div>
    <input type="file" id="image-input" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
</div>
```

### Styling
```css
.upload-area {
    border: 2px dashed #ddd;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: #fafafa;
    margin-bottom: 15px;
}

.upload-area:hover {
    border-color: #999;
    background: #f5f5f5;
}

.upload-icon {
    font-size: 40px;
    margin-bottom: 10px;
    opacity: 0.5;
}

.upload-text {
    font-size: 14px;
    color: #333333;
    margin-bottom: 5px;
}

.upload-subtext {
    font-size: 12px;
    color: #666;
}
```

### Behavior
- Click to open file picker
- Shows file name after selection
- Drag-and-drop support (can be added)
- Supports: PNG, JPG, HEIC, HEIF

---

## Component 2: Grid Selection Buttons

### HTML Structure
```html
<div class="section">
    <div class="section-label">2. Select Grid Size</div>
    <div class="grid-options">
        <button class="grid-btn" data-size="48" onclick="selectGridSize(48)">
            48 × 48
        </button>
        <button class="grid-btn active" data-size="75" onclick="selectGridSize(75)">
            75 × 75
        </button>
        <button class="grid-btn" data-size="96" onclick="selectGridSize(96)">
            96 × 96
        </button>
    </div>
</div>
```

### Styling
```css
.grid-options {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.grid-btn {
    flex: 1;
    padding: 12px;
    border: 1px solid #333333;
    background: #E0E0E0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    color: #333333;
    transition: all 0.2s;
    font-family: 'Courier New', Courier, monospace;
}

.grid-btn.active {
    background: #333333;
    color: #FFFFFF;
    border-color: #333333;
}

.grid-btn:hover:not(.active) {
    background: #d0d0d0;
}
```

### Behavior
- Only one button active at a time
- Click activates button and updates grid size
- Triggers price recalculation
- Triggers image resize if image is loaded

---

## Component 3: Image Canvas/Preview

### HTML Structure
```html
<div id="canvas-container" style="display: none;">
    <canvas id="image-canvas" class="editor-canvas"></canvas>
    <div class="canvas-label">Processed (Posterized)</div>
</div>
```

### Styling
```css
.editor-canvas {
    max-width: 100%;
    width: auto;
    max-height: calc(100vh - 100px);
    aspect-ratio: 1 / 1;
    height: auto;
    border-radius: 10px;
    border: 2px solid #ddd;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background: #ffffff;
    display: block;
    margin: 0 auto;
}

.canvas-label {
    font-size: 17px;
    font-weight: normal;
    margin-bottom: 10px;
    color: #E87D3E;
    font-family: 'Courier New', Courier, monospace;
    text-align: center;
}
```

### Behavior
- Displays processed image
- Updates in real-time as edits are made
- Maintains aspect ratio (square)
- Hidden initially, shown after image upload

---

## Component 4: Adjustment Sliders

### HTML Structure
```html
<div class="section">
    <div class="section-label">Image Adjustments</div>
    
    <div class="slider-control">
        <div class="slider-label">
            <span>Contrast</span>
            <span id="contrast-value">1.2</span>
        </div>
        <input type="range" 
               class="slider" 
               id="contrast-slider" 
               min="0.5" 
               max="2.0" 
               step="0.1" 
               value="1.2"
               oninput="updateContrast(this.value)">
    </div>
    
    <!-- Similar for Brightness and Tones -->
</div>
```

### Styling
```css
.slider-control {
    margin-bottom: 20px;
}

.slider-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333333;
}

.slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
    border: none;
}
```

### Behavior
- Real-time value display
- Immediate canvas update on change
- Range constraints enforced
- Smooth interaction

---

## Component 5: Color Palette

### HTML Structure
```html
<div class="section">
    <div class="section-label">Painting</div>
    <div class="color-palette">
        <div class="color-swatch selected" 
             data-color="0,0,0" 
             style="background: rgb(0,0,0);"
             onclick="selectPaintColor(0, 0, 0, this)">
            <span>Black</span>
        </div>
        <div class="color-swatch" 
             data-color="85,85,85" 
             style="background: rgb(85,85,85);"
             onclick="selectPaintColor(85, 85, 85, this)">
            <span>Dark Gray</span>
        </div>
        <!-- More swatches -->
    </div>
</div>
```

### Styling
```css
.color-palette {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 30px;
    padding-bottom: 20px;
}

.color-swatch {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    border: 2px solid #ddd;
    cursor: pointer;
    transition: transform 0.2s;
    position: relative;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-swatch.selected {
    border: 3px solid #333333;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #333333;
}

.color-swatch span {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #333;
    white-space: nowrap;
}
```

### Behavior
- Click to select color
- Visual feedback for selected color
- Used by paint tool
- Hover effect for better UX

---

## Component 6: Tool Buttons

### HTML Structure
```html
<div class="editor-actions">
    <button class="editor-btn" onclick="showCropTool()">Size</button>
    <button class="editor-btn" onclick="showAdjustTool()">Adjust</button>
    <button class="editor-btn" onclick="showPaintTool()">Paint</button>
    <button class="editor-btn primary" onclick="show3DView()">View in 3D</button>
</div>
```

### Styling
```css
.editor-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: center;
}

.editor-btn {
    padding: 12px 24px;
    border: 1px solid #333333;
    background: #E0E0E0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #333333;
    font-family: 'Courier New', Courier, monospace;
    transition: all 0.2s;
}

.editor-btn:hover {
    background: #d0d0d0;
}

.editor-btn.primary {
    background: #333333;
    color: #FFFFFF;
}

.editor-btn.primary:hover {
    background: #1a1a1a;
}
```

### Behavior
- Toggle tool visibility
- Switch between editor and 3D view
- Active state styling
- Smooth transitions

---

## Component 7: Add-ons Toggle

### HTML Structure
```html
<div class="stand-section">
    <div class="stand-item">
        <div class="item-left">
            <img src="/product_images/stand_xxx.png" alt="Stand" class="item-image">
            <div class="item-info">
                <div class="item-name">Stand</div>
                <div class="item-price">$10.00</div>
            </div>
        </div>
        <label class="toggle-switch">
            <input type="checkbox" 
                   id="stand-toggle" 
                   onchange="toggleStand(this.checked)">
            <span class="toggle-slider"></span>
        </label>
    </div>
</div>
```

### Styling
```css
.stand-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 6px;
}

.item-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
}

.item-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
}

.item-price {
    font-size: 12px;
    color: #666;
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 24px;
    transition: .4s;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked + .toggle-slider {
    background-color: #2d5016;
}

input:checked + .toggle-slider:before {
    transform: translateX(20px);
}
```

### Behavior
- Toggle on/off
- Updates price in real-time
- Visual feedback
- Image preview

---

## Component 8: Price Display

### HTML Structure
```html
<div class="price-display-section">
    <div class="price-details">
        <div class="price-detail-row">
            <span class="price-detail-label">Dimensions:</span>
            <span class="price-detail-value">75 × 75</span>
        </div>
        <div class="price-detail-row">
            <span class="price-detail-label">Addons:</span>
            <span class="price-detail-value">Stand</span>
        </div>
    </div>
    <div class="total-price">
        <span class="total-price-label">Total:</span>
        <span class="total-price-value" id="total-price">$58.99</span>
    </div>
</div>
```

### Styling
```css
.price-details {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
}

.price-detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.price-detail-label {
    font-size: 12px;
    color: #666;
    min-width: 80px;
}

.price-detail-value {
    font-size: 12px;
    color: #333;
}

.total-price {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    padding-top: 15px;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

### Behavior
- Updates dynamically as selections change
- Shows breakdown of costs
- Prominent total price display

---

## Component 9: Checkout Button

### HTML Structure
```html
<button class="checkout-btn" onclick="proceedToCheckout()">
    Proceed to Checkout
</button>
```

### Styling
```css
.checkout-btn {
    width: 100%;
    padding: 16px 24px;
    background: #2d5016;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
    font-family: 'Courier New', Courier, monospace;
}

.checkout-btn:hover {
    background: #1f3a0f;
}

.checkout-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}
```

### Behavior
- Disabled until image is loaded
- Shows loading state during processing
- Redirects to checkout on success

---

## Component 10: 3D Viewer Container

### HTML Structure
```html
<div id="canvas-container" style="display: none;">
    <div class="viewer-controls">
        <button class="viewer-btn" onclick="resetCamera()">Reset</button>
        <button class="viewer-btn" onclick="showEditorView()">Back to Editor</button>
    </div>
    <!-- Three.js canvas appended here -->
</div>
```

### Styling
```css
#canvas-container {
    flex: 1;
    position: relative;
    background: #FFF8F0;
    border-right: 1px solid #e0e0e0;
    min-height: 600px;
}

#canvas-container canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
}

.viewer-controls {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    gap: 10px;
    z-index: 10;
}

.viewer-btn {
    background: #E0E0E0;
    border: 1px solid #333333;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #333333;
    font-family: 'Courier New', Courier, monospace;
}
```

### Behavior
- Full-screen 3D rendering
- Interactive controls overlay
- Smooth transitions between views
- Responsive to container size

---

## Color Scheme

### Primary Colors
- **Background**: `#FFFBF5` (warm white)
- **Primary Accent**: `#E87D3E` (orange)
- **Text**: `#333333` (dark gray)
- **Borders**: `#ddd` (light gray)

### Secondary Colors
- **Button Background**: `#E0E0E0` (light gray)
- **Active Button**: `#333333` (dark)
- **Price Display**: `#2d5016` (dark green)
- **Section Labels**: `#FF6B35` (bright orange)

### Typography
- **Font Family**: `'Courier New', Courier, 'Lucida Console', Monaco, monospace`
- **Base Size**: 14px
- **Title Size**: 32px
- **Price Size**: 24px

---

## Responsive Breakpoints

### Mobile
- **Max Width**: 1024px
- **Layout**: Single column
- **Panel Width**: 100%
- **Font Sizes**: Slightly reduced

### Desktop
- **Min Width**: 1025px
- **Layout**: Two columns (flex row)
- **Panel Width**: 50% each
- **Font Sizes**: Full size

---

## Animation & Transitions

### Button Hover
```css
transition: all 0.2s;
```

### Toggle Switch
```css
transition: .4s;
```

### Color Swatch
```css
transition: transform 0.2s;
```

### View Transitions
```css
transition: opacity 0.3s, transform 0.3s;
```

---

## Accessibility Considerations

- Semantic HTML elements
- Keyboard navigation support
- ARIA labels where needed
- Color contrast ratios meet WCAG AA
- Focus indicators on interactive elements
- Alt text for images

---

## State Management

### Visual States
- **Loading**: Shows spinner/placeholder
- **Error**: Shows error message
- **Empty**: Shows upload prompt
- **Loaded**: Shows canvas/preview
- **Editing**: Shows tools
- **3D View**: Shows 3D viewer

### Component States
- `isImageLoaded` - Boolean
- `currentTool` - String ('crop', 'adjust', 'paint', '3d')
- `selectedGridSize` - Number (48, 75, 96)
- `standSelected` - Boolean
- `mountingSelected` - Boolean
- `isProcessing` - Boolean

