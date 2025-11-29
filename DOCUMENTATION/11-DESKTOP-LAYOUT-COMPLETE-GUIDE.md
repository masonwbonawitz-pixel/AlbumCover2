# Complete Desktop Layout Guide - Every Single Detail

## 🖥️ Overview

This document describes **EVERY** aspect of the desktop version layout, including:
- Exact pixel dimensions
- Every button click and what happens
- Panel visibility states
- Canvas interactions
- Tool button behaviors
- Complete user flow from start to finish
- Every visual element and its styling
- Side-by-side layout structure

---

## Table of Contents

1. [Initial State - Page Load](#1-initial-state-page-load)
2. [Layout Structure - Side-by-Side Design](#2-layout-structure-side-by-side-design)
3. [Left Panel - Editor/3D Viewer](#3-left-panel-editor3d-viewer)
4. [Right Panel - Controls](#4-right-panel-controls)
5. [Image Upload Flow](#5-image-upload-flow)
6. [Editor Panel - Complete Guide](#6-editor-panel-complete-guide)
7. [3D Viewer - Desktop Version](#7-3d-viewer-desktop-version)
8. [Control Panel - All Sections](#8-control-panel-all-sections)
9. [Grid Size Selection](#9-grid-size-selection)
10. [Image Adjustments](#10-image-adjustments)
11. [Painting Tools](#11-painting-tools)
12. [Cropping Interface](#12-cropping-interface)
13. [Price and Checkout](#13-price-and-checkout)
14. [Complete Interaction Map](#14-complete-interaction-map)
15. [CSS Dimensions - Exact Measurements](#15-css-dimensions-exact-measurements)

---

## 1. Initial State - Page Load

### 1.1 Page Load Sequence

When the desktop page loads, here's **EXACTLY** what happens:

1. **No Redirect** (desktop version doesn't check for mobile)
2. **DOM Structure Loads:**
   - Main container: Side-by-side layout
   - Left panel: Editor panel visible
   - Right panel: Control panel visible
   - All sections loaded immediately

3. **Initial Content:**
   - Editor panel shows placeholder or editor interface
   - Control panel shows all sections (not hidden)
   - Upload area visible
   - All controls visible

### 1.2 Initial Visual Layout

```
┌─────────────────────────────────┬──────────────────────┐
│                                 │                      │
│   Edit Your Photo    [View 3D]  │  3D Album Cover...   │
│                                 │  Create colorized... │
│   ┌─────────────────┐          │                      │
│   │                 │          │  [Upload Area]       │
│   │   Placeholder   │          │                      │
│   │      or         │          │  [Grid Size]         │
│   │  Processed      │          │   48×48  75×75  96×96│
│   │    Canvas       │          │                      │
│   │                 │          │  [Adjustments]       │
│   └─────────────────┘          │  Contrast: [━━━]     │
│                                 │  Brightness: [━━━]   │
│   [+][−][□][⤡]                 │  Tones: [━━━]        │
│                                 │                      │
│                                 │  [Painting]          │
│                                 │  [Color Palette]     │
│                                 │                      │
│                                 │  [Price: $XX.XX]     │
│                                 │  [Add to Cart]       │
│                                 │                      │
└─────────────────────────────────┴──────────────────────┘
```

### 1.3 Main Container Structure

**Element:** `.main-container`

**CSS Properties:**
- `display: flex`
- `height: 100vh` (full viewport height)
- `max-width: 100vw`
- `overflow-x: hidden`
- `margin: 0 auto`

**Layout:** Side-by-side (row direction)

**Contains:**
1. Viewer Panel (left) - flex: 1 (50-60% width)
2. Control Panel (right) - flex: 0 0 450px (fixed 450px width)

---

## 2. Layout Structure - Side-by-Side Design

### 2.1 Overall Layout

**Key Difference from Mobile:**
- Desktop: **Side-by-side** layout (always)
- Mobile: **Stacked** layout (editor on top, controls below)

**Breakpoint:** No breakpoint - desktop version always uses side-by-side

### 2.2 Left Panel (Viewer Panel)

**Element:** `.viewer-panel`

**Dimensions:**
- `flex: 1` (takes remaining space after right panel)
- `min-width: 0`
- `background: #FFFBF5`
- `position: relative`
- `display: flex`
- `flex-direction: column`
- `overflow: hidden`

**Contains:**
1. Editor Panel (`#editor-panel`)
2. 3D Canvas Container (`#canvas-container`)

**Always Visible:** One of these is always visible (they toggle)

### 2.3 Right Panel (Control Panel)

**Element:** `.control-panel`

**Dimensions:**
- `flex: 0 0 450px`
- `min-width: 450px`
- `max-width: 450px`
- `background: #FFFBF5`
- `padding: 40px`
- `overflow-y: auto` (scrollable)
- `overflow-x: hidden`
- `border-left: 1px solid #e0e0e0`

**Layout:**
- Vertical stack of sections
- All sections always visible (not collapsible)
- Scrollable if content exceeds height

---

## 3. Left Panel - Editor/3D Viewer

### 3.1 Panel Structure

The left panel contains TWO views that toggle:

1. **Editor Panel** - Shows processed image canvas (default)
2. **3D Canvas Container** - Shows 3D viewer (when toggled)

### 3.2 Editor Panel (Default View)

**Element:** `#editor-panel`

**Initial State:**
- `display: flex` (VISIBLE by default)
- `flex-direction: column`
- `flex: 1`
- `padding: 20px 24px 20px 24px`
- `padding-right: 40px` (extra right padding)
- `overflow-y: auto`
- `overflow-x: hidden`
- `background: #FFFBF5`
- `min-width: 0`
- `max-height: 100vh`

**Layout:**
```
┌──────────────────────────────────────┐
│  Edit Your Photo      [View in 3D]   │ ← Header
├──────────────────────────────────────┤
│                                      │
│      ┌──────────────────┐           │
│      │                  │           │
│      │  Processed Image │           │ ← Canvas
│      │      Canvas      │           │
│      │                  │           │
│      └──────────────────┘           │
│                                      │
│                                      │ ← Controls on right
│                                      │   of canvas
│                                      │
└──────────────────────────────────────┘
```

#### 3.2.1 Header Section

**Element:** `.panel-header`

**Layout:**
- `display: flex`
- `justify-content: space-between`
- `align-items: center`
- `margin-bottom: 12px`
- `flex-shrink: 0`

**Left Side - Title:**
- Element: `h2.panel-title#desktop-panel-title`
- Text: "Edit Your Photo"
- Font: Courier New
- Font size: 24px
- Font weight: normal
- Color: `#E87D3E`
- Margin: 0

**Right Side - View in 3D Button:**
- Text: "View in 3D"
- Class: `.viewer-btn`
- Padding: 10px 15px
- Font: Courier New, 14px
- Background: `#E0E0E0`
- Border: 1px solid `#333333`
- Border radius: 6px
- Color: `#333333`

**Function:** Calls `show3DView()` when clicked

#### 3.2.2 Canvas Container

**Element:** `.editor-grid`

**Layout:**
- `display: grid`
- `grid-template-columns: 1fr 1fr` (2 columns, but only uses 1)
- `gap: 30px`
- `margin-bottom: 20px`
- `margin-top: 12px`

**Canvas Wrapper:**
- Element: `.canvas-wrapper`
- `text-align: center`
- `margin-bottom: 0`

**Canvas Label:**
- Element: `.canvas-label#desktop-canvas-label`
- Initially: `display: none`
- When visible:
  - Text: "Processed (Posterized)"
  - Font: Courier New, 14px
  - Color: `#E87D3E`
  - Margin-bottom: 10px

**Canvas Element:**
- Element: `#processed-canvas`
- Class: `.editor-canvas`
- `max-width: 100%`
- `max-height: calc(100vh - 100px)`
- `width: auto`
- `aspect-ratio: 1/1`
- `cursor: crosshair`
- `border-radius: 10px`
- `border: 2px solid #ddd`
- `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
- `background: #ffffff`

**Canvas Resolution:**
- Set dynamically to fill available space
- Container width: `editor-panel width - 88px` (padding)
- Reserved height: 80px (for header/label)
- Available height: `window.innerHeight - reservedHeight`
- Max size: Larger of container width or 95% of available height
- Canvas size: `Math.min(containerWidth * 0.98, availableHeight * 0.95) + 100`

#### 3.2.3 Canvas Controls

**Position:** Absolute, to the right of canvas

**Element:** `#processed-controls`

**Styling:**
- `position: absolute`
- `top: 0`
- `left: calc(50% + 1px)`
- `margin-left: 10px`
- `display: flex !important`
- `flex-direction: column`
- `gap: 8px`
- `z-index: 1000`
- `pointer-events: auto`

**Contains 4 buttons (vertical stack):**

1. **Zoom In Button (+):**
   - Function: `zoomInProcessed()`
   - Padding: 12px 16px
   - Font size: 20px
   - Min-width: 44px
   - Min-height: 44px
   - Background: `#E0E0E0`
   - Border: 1px solid `#333333`
   - Border radius: 6px
   - Display: flex
   - Align-items: center
   - Justify-content: center
   - Title: "Zoom In"

2. **Zoom Out Button (−):**
   - Function: `zoomOutProcessed()`
   - Same styling as Zoom In
   - Title: "Zoom Out"

3. **Reset View Button (□):**
   - Function: `resetZoomProcessed()`
   - Same styling as Zoom In/Out
   - Title: "Reset View"

4. **Pan Button (⤡):**
   - Function: `togglePanProcessed()`
   - ID: `processed-pan-btn`
   - Same styling as other buttons
   - Title: "Pan"
   - Toggles pan mode

**Positioning Function:**
- `positionControls()` function calculates position
- Updates when window resizes
- Positions controls at right edge of canvas

### 3.3 3D Canvas Container

**Element:** `#canvas-container`

**Initial State:**
- `display: none` (HIDDEN)
- Shows when "View in 3D" button clicked

**When Visible:**
- `display: block`
- `flex: 1`
- `position: relative`
- `background: #FFF8F0`
- `border-right: 1px solid #e0e0e0`
- `min-height: 600px`

**Layout:**
```
┌──────────────────────────────────────┐
│  [Edit Photo]  [↺]  [□]             │ ← Controls
├──────────────────────────────────────┤
│                                      │
│      ┌──────────────────┐           │
│      │                  │           │
│      │   3D Model       │           │ ← Three.js Canvas
│      │   (Rotatable)    │           │
│      │                  │           │
│      └──────────────────┘           │
│                                      │
└──────────────────────────────────────┘
```

**Viewer Controls:**
- Position: `absolute`, `top: 20px`, `left: 20px`
- Display: `flex`, `gap: 10px`
- Z-index: 10

**Controls:**
1. **Edit Photo Button:**
   - Text: "Edit Photo"
   - Function: `showEditorPanel()`
   - Class: `.viewer-btn`

2. **Reset Camera Button:**
   - Icon: "↺"
   - Function: `resetCamera()`
   - Class: `.viewer-btn.icon-only`

3. **Toggle Wireframe Button:**
   - Icon: "□"
   - Function: `toggleWireframe()`
   - Class: `.viewer-btn.icon-only`
   - **DESKTOP ONLY** (not in mobile)

---

## 4. Right Panel - Controls

### 4.1 Panel Structure

**Element:** `.control-panel`

**Layout:** Vertical stack, always visible

**Order of Sections (top to bottom):**

1. Title and Price
2. Upload Section
3. Grid Size Selection
4. Image Adjustments
5. Painting Tools
6. Price Display
7. Add to Cart Button
8. Stand Toggle
9. Add-ons Section

### 4.2 Title Section

**Title:**
- Element: `h1.title#desktop-main-title`
- Text: "3D Album Cover Mosaic Builder"
- Font: Courier New, 32px
- Font weight: normal
- Color: `#E87D3E`
- Margin-bottom: 10px

**Price/Subtitle:**
- Element: `.price#desktop-price-subtitle`
- Text: "Create colorized 3D prints"
- Font: Courier New, 20px
- Color: `#333333`
- Margin-bottom: 30px
- Padding-bottom: 20px
- Border-bottom: 1px solid `#e0e0e0`

### 4.3 Section Container

**Element:** `.section`

**Styling:**
- `margin-bottom: 30px`
- Width: 100%

**All sections use this container class**

---

## 5. Image Upload Flow

### 5.1 Upload Area

**Element:** `.upload-area#png-upload-area`

**Initial State:**
- Always visible
- Not hidden after upload

**Styling:**
- `border: 2px dashed #ddd`
- `border-radius: 12px`
- `padding: 30px`
- `text-align: center`
- `cursor: pointer`
- `transition: all 0.3s`
- `background: #fafafa`
- `margin-bottom: 15px`

**Hover State:**
- `border-color: #999`
- `background: #f5f5f5`

**Has File State:**
- Class: `.has-file` added
- `border-color: #999`
- `background: #f5f5f5`

**Contents:**
1. **Upload Icon:**
   - Text: "🖼️"
   - Font size: 40px
   - Margin-bottom: 10px
   - Opacity: 0.5

2. **Upload Text:**
   - Element: `.upload-text#png-upload-text`
   - Text: "Choose image file..."
   - Font: Courier New, 14px
   - Color: `#333333`
   - Margin-bottom: 5px

3. **Upload Subtext:**
   - Element: `.upload-subtext#png-upload-subtext`
   - Text: "Will be resized to 75×75 pixels"
   - Font: Courier New, 12px
   - Color: `#333333`

**File Input:**
- Element: `#png-input`
- Type: file
- Accept: `.png,.jpg,.jpeg,.heic,.heif`
- Display: none (hidden)
- Clicked via upload area click

### 5.2 Upload Process

**When Upload Area Clicked:**
1. File input triggered
2. File picker opens
3. User selects file

**When File Selected:**
1. File read as DataURL
2. Image loaded
3. Stored in `rawUploadedImage`
4. Processed at selected grid size
5. Canvas updated
6. Editor panel shows processed image

**No UI Changes:**
- Upload area stays visible
- Text changes to "Processed image"
- Preview shows in cropper section (if opened)

---

## 6. Editor Panel - Complete Guide

### 6.1 Canvas Rendering

**Function:** `processImage()`

**Process:**
1. Get container dimensions
2. Calculate canvas size (fills available space)
3. Set canvas internal resolution
4. Process image at selected grid size
5. Apply adjustments (contrast, brightness, tones)
6. Update `processedImageData`
7. Draw to canvas
8. Position controls

### 6.2 Canvas Sizing

**Calculation:**
```javascript
const container = document.getElementById('editor-panel');
const containerWidth = Math.max(200, container.clientWidth - 88);
const reservedHeight = 80;
const availableHeight = window.innerHeight - reservedHeight;
const maxSize = Math.max(containerWidth, availableHeight * 0.95);
const side = Math.min(containerWidth * 0.98, availableHeight * 0.95, maxSize) + 100;
```

**Canvas Dimensions:**
- Width: `side` pixels
- Height: `side` pixels
- Internal resolution matches display size

### 6.3 Zoom Controls

**Zoom In:**
- Function: `zoomInProcessed()`
- Sets `zoomMode = 'zoom-in'`
- Click on canvas: Zooms in at clicked point
- Zoom factor: 1.3x per click
- Max zoom: 10x

**Zoom Out:**
- Function: `zoomOutProcessed()`
- Sets `zoomMode = 'zoom-out'`
- Click on canvas: Zooms out from clicked point
- Min zoom: 1.0x

**Reset View:**
- Function: `resetZoomProcessed()`
- Resets zoom to 1.0
- Resets pan offset to (0, 0)
- Redraws canvas

**Pan Mode:**
- Function: `togglePanProcessed()`
- Toggles pan mode on/off
- When active: Can drag canvas to pan
- Only works when zoomed in

### 6.4 Canvas Interactions

**Painting:**
- Default cursor: `crosshair`
- Click/touch: Paint pixel
- Drag: Paint along path
- Brush size applies

**Zooming:**
- Click zoom button
- Click on canvas to zoom at that point
- Point stays under cursor

**Panning:**
- Activate pan button
- Drag to pan when zoomed
- Constrained to image bounds

---

## 7. 3D Viewer - Desktop Version

### 7.1 Accessing 3D Viewer

**Button:** "View in 3D" (in editor panel header)

**Function:** `show3DView()`

**What Happens:**
1. Regenerates processed PNG
2. Hides editor panel
3. Shows 3D canvas container
4. Applies colors to mesh
5. Fits camera to mesh
6. Starts animation loop

### 7.2 3D Scene Setup

**Same as Mobile:**
- Scene, lights, camera, renderer
- OrbitControls
- Grid helper

**Additional Feature:**
- **Wireframe Toggle Button** (desktop only)
- Function: `toggleWireframe()`
- Toggles wireframe mode on mesh

### 7.3 Viewer Controls

**Three Buttons (desktop):**
1. Edit Photo
2. Reset Camera (↺)
3. Toggle Wireframe (□)

**Mobile Only Has Two:**
1. Edit Photo
2. Reset Camera

---

## 8. Control Panel - All Sections

### 8.1 Upload Section

**Element:** `.section` (first section)

**Section Label:**
- Element: `.section-label#desktop-section-upload`
- Text: "1. Upload Color Image"
- Font: Courier New, 16px
- Color: `#FF6B35`
- Margin-bottom: 12px

**Upload Area:**
- Same as described in Upload Flow section
- Always visible
- Changes text after upload

**Crop Buttons:**
- Container: `#crop-buttons`
- Initially: `display: none`
- Shows when image uploaded

**Show Cropper Button:**
- Text: "Show Cropper"
- Width: 100%
- Function: `showCropper()`

**Hide Cropper Button:**
- Text: "Hide Cropper ^"
- Width: 100%
- Function: `hideCropper()`
- Initially: `display: none`

**Preview Container:**
- Element: `#png-preview`
- Initially: `display: none`
- Shows when cropper opened
- Max-width: 350px
- Image size: 350×350px

### 8.2 Grid Size Section

**Element:** `.section` (second section)

**Section Label:**
- Element: `.section-label#desktop-section-grid`
- Text: "2. Select Grid Size"
- Font: Courier New, 16px
- Color: `#FF6B35`
- Margin-bottom: 12px

**Grid Options:**
- Element: `.grid-options`
- Display: flex
- Gap: 10px
- Margin-bottom: 20px

**Grid Buttons:**
- Three buttons in a row
- Text: "48 × 48", "75 × 75", "96 × 96"
- Equal width (flex: 1)
- Same styling as mobile

**Default Selection:**
- 75×75 selected by default
- Has `.active` class

### 8.3 Adjustments Section

**Element:** `.section` (third section)

**Section Label:**
- Element: `.section-label#desktop-section-adjustments`
- Text: "Image Adjustments"
- Font: Courier New, 16px
- Color: `#FF6B35`
- Margin-bottom: 12px

**Sliders:**
- Same structure as mobile
- Contrast, Brightness, Tones
- Real-time processing

**Slider Control:**
- Element: `.slider-control`
- Margin-bottom: 20px
- Width: 100%

**Slider Label:**
- Display: flex
- Justify-content: space-between
- Font: Courier New, 14px

**Slider:**
- Width: 100%
- Height: 6px
- Thumb: 20px circle

### 8.4 Painting Section

**Element:** `.section` (fourth section)

**Section Label:**
- Text: "Painting"
- Font: Courier New, 16px
- Color: `#FF6B35`

**Color Palette:**
- Same as mobile
- 4 color swatches
- 50×50px each

**Brush Size Slider:**
- Same as mobile
- Range: 1-10

**Undo/Redo Buttons:**
- Same as mobile
- Always visible (not hidden)

**Reset Image Button:**
- Same as mobile

### 8.5 Price Section

**Price Display:**
- Element: `.price` or price display section
- Shows current price
- Updates when grid size changes
- Updates when add-ons selected

### 8.6 Add to Cart Button

**Element:** `#add-to-cart-btn` or `#buy-now-btn`

**Styling:**
- Width: 100%
- Padding: 16px
- Background: `#2d5016`
- Color: white
- Border: none
- Border radius: 6px
- Font: 16px, 600 weight
- Text-transform: uppercase

**Function:**
- Creates order
- Generates files
- Uploads to server
- Redirects to Shopify (or shows order ID)

### 8.7 Stand Toggle

**Same as mobile:**
- Toggle switch
- Image display
- Price display

### 8.8 Add-ons Section

**Same as mobile:**
- Mounting dots toggle
- Image display
- Price display

---

## 9. Grid Size Selection

### 9.1 Grid Buttons

**Three Buttons:**
1. "48 × 48" (Normal mode)
2. "75 × 75" (default)
3. "96 × 96"

**Function:** `selectGridSize(size)`

**Behavior:**
- Updates `selectedGridSize`
- Reprocesses image
- Loads STL for new size
- Updates price
- Updates upload subtext

### 9.2 Grid Mode Differences

**48×48 (Normal Mode):**
- Posterized mode
- Full resolution processing (capped at 2048px)
- Smooth image (no pixelation)
- Noise reduction: 5
- Texture mapping in 3D

**75×75 & 96×96:**
- Pixelated mode
- Processed at exact grid size
- Hard pixel edges
- Noise reduction: 0
- Vertex colors in 3D

---

## 10. Image Adjustments

### 10.1 Sliders

**Three Sliders:**
1. Contrast (0-3, default 1.2)
2. Brightness (0-3, default 1.0)
3. Tones (2-4, default 4)

**Real-Time Processing:**
- Updates as slider moves
- Calls `processImage()` on input
- Canvas updates immediately
- No lag or delay

### 10.2 Processing

**Same as mobile:**
- Grayscale conversion
- Percentile stretch
- Contrast/brightness application
- Posterization to 4 tones

---

## 11. Painting Tools

### 11.1 Color Palette

**Same as mobile:**
- 4 colors: Black, Dark Gray, Light Gray, White
- 50×50px swatches
- Selected state highlighting

### 11.2 Brush Size

**Same as mobile:**
- Range: 1-10
- Circular brush (posterized)
- Square brush (pixelated)

### 11.3 Undo/Redo

**Same as mobile:**
- Undo stack
- Redo stack
- Keyboard shortcuts

### 11.4 Canvas Painting

**Same as mobile:**
- Click to paint
- Drag to paint path
- Real-time updates

---

## 12. Cropping Interface

### 12.1 Cropper Access

**Show Cropper Button:**
- In upload section
- Shows when image uploaded
- Opens cropper preview

### 12.2 Cropper Preview

**Container:**
- Max-width: 350px
- Width: 100%
- Image: 350×350px
- Object-fit: contain

**Crop Canvas:**
- Overlay on image
- Blue dotted box
- Resizable
- Draggable

### 12.3 Crop Functions

**Same as mobile:**
- Drag to move
- Resize from corners/edges
- Grid snapping
- Auto-apply on change

---

## 13. Price and Checkout

### 13.1 Price Display

**Location:** Top of control panel (below title)

**Element:** `.price#desktop-price-subtitle`

**Initial Text:** "Create colorized 3D prints"

**After Prices Load:**
- Shows price for selected grid size
- Updates when size changes
- Includes add-ons

### 13.2 Checkout Buttons

**Add to Cart:**
- Creates order
- Shows order ID
- Doesn't redirect (test mode)

**Buy Now:**
- Creates order
- Redirects to Shopify
- Passes order ID as parameter

---

## 14. Complete Interaction Map

### 14.1 Desktop Layout Always

**Key Difference:**
- Desktop: **All sections always visible**
- No collapsible panels
- No tool buttons to toggle sections
- Everything is accessible at once

### 14.2 Panel Toggle

**Only Toggle:**
- Editor Panel ↔ 3D Viewer
- Via "View in 3D" / "Edit Photo" buttons

### 14.3 Section Visibility Matrix

| Section | Initial | After Upload | Always Visible? |
|---------|---------|--------------|-----------------|
| Upload Section | Visible | Visible | Yes |
| Grid Size | Visible | Visible | Yes |
| Adjustments | Visible | Visible | Yes |
| Painting | Visible | Visible | Yes |
| Price | Visible | Visible | Yes |
| Add to Cart | Visible | Visible | Yes |
| Stand Toggle | Visible | Visible | Yes |
| Add-ons | Visible | Visible | Yes |

**All sections remain visible at all times!**

### 14.4 Interaction Flow

```
Page Loads
  ↓
Side-by-Side Layout Visible
  ↓
Left: Editor Panel (or placeholder)
Right: All Control Sections
  ↓
User Uploads Image
  ↓
Editor Panel Shows Processed Canvas
Control Panel Stays the Same
  ↓
User Can:
  - Select Grid Size
  - Adjust Sliders
  - Paint on Canvas
  - Crop Image
  - View in 3D
  - Add to Cart
  ↓
All Simultaneously Available
```

---

## 15. CSS Dimensions - Exact Measurements

### 15.1 Main Container

**Width:** 100vw
**Height:** 100vh
**Layout:** Flex row (side-by-side)

### 15.2 Left Panel (Viewer Panel)

**Flex:** 1 (takes remaining space)
**Min-width:** 0
**Background:** #FFFBF5

**Editor Panel:**
- Padding: 20px 24px 20px 24px
- Padding-right: 40px (extra)
- Max-height: 100vh
- Overflow-y: auto

**3D Canvas:**
- Flex: 1
- Min-height: 600px

### 15.3 Right Panel (Control Panel)

**Fixed Width:** 450px
**Min-width:** 450px
**Max-width:** 450px
**Padding:** 40px
**Overflow-y:** auto (scrollable)

### 15.4 Canvas

**Calculation:**
- Container width - 88px (padding)
- Available height - 80px (reserved)
- Max size: Larger of width or 95% height
- Final: `min(width * 0.98, height * 0.95) + 100`

### 15.5 Controls

**Canvas Controls (right side):**
- Position: absolute
- Left: calc(50% + 1px)
- Margin-left: 10px
- Buttons: 44×44px minimum
- Gap: 8px

### 15.6 Upload Area

**Padding:** 30px
**Border:** 2px dashed
**Border-radius:** 12px
**Icon:** 40px

### 15.7 Grid Buttons

**Flex:** 1 (equal width)
**Padding:** 12px
**Gap:** 10px between buttons

### 15.8 Sliders

**Track:** 100% width, 6px height
**Thumb:** 20px circle

### 15.9 Color Swatches

**Size:** 50×50px
**Gap:** 10px
**Border:** 2px

### 15.10 Typography

**Main Title:** 32px
**Section Labels:** 16px
**Body Text:** 14px
**Small Text:** 12px

### 15.11 Colors

**Same as Mobile:**
- Background: #FFFBF5
- Buttons: #E0E0E0
- Active: #d0d0d0
- Primary: #2d5016
- Text: #333333
- Secondary: #666666
- Orange: #E87D3E
- Red: #FF6B35

---

## Key Differences: Desktop vs Mobile

### Layout
- **Desktop:** Side-by-side (editor left, controls right)
- **Mobile:** Stacked (editor on top, controls below)

### Section Visibility
- **Desktop:** All sections always visible
- **Mobile:** Collapsible panels, one at a time

### Tool Buttons
- **Desktop:** No tool buttons needed
- **Mobile:** Tool buttons to toggle sections

### Canvas Controls
- **Desktop:** Controls on right side of canvas (absolute)
- **Mobile:** Controls below canvas (flex row)

### 3D Viewer Controls
- **Desktop:** 3 buttons (Edit, Reset, Wireframe)
- **Mobile:** 2 buttons (Edit, Reset)

### Cropper Preview
- **Desktop:** 350×350px max
- **Mobile:** 400px max width

### Scroll Behavior
- **Desktop:** Control panel scrollable, editor panel scrollable
- **Mobile:** Page scrollable, panels within

---

## END OF DESKTOP LAYOUT GUIDE

This document covers every aspect of the desktop layout. Every button, panel, interaction, and visual element has been described in detail. Use this as your complete reference for recreating the desktop version in React.


