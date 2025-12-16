# Complete Mobile Layout Guide - Every Single Detail

## 📱 Overview

This document describes **EVERY** aspect of the mobile version layout, including:
- Exact pixel dimensions
- Every button click and what happens
- Panel visibility states
- Canvas interactions
- Tool button behaviors
- Complete user flow from start to finish
- Every visual element and its styling

---

## Table of Contents

1. [Initial State - Before Image Upload](#1-initial-state-before-image-upload)
2. [Image Upload Flow - Complete Step-by-Step](#2-image-upload-flow-complete-step-by-step)
3. [After Upload - What Changes Immediately](#3-after-upload-what-changes-immediately)
4. [Tool Buttons System - Every Button Explained](#4-tool-buttons-system-every-button-explained)
5. [Editor Panel - Photo Editing View](#5-editor-panel-photo-editing-view)
6. [3D Viewer - Complete Interaction Guide](#6-3d-viewer-complete-interaction-guide)
7. [Size Panel - Grid Selection & Cropping](#7-size-panel-grid-selection--cropping)
8. [Adjust Panel - Image Adjustments](#8-adjust-panel-image-adjustments)
9. [Paint Panel - Painting Tools](#9-paint-panel-painting-tools)
10. [Price Section - Checkout Interface](#10-price-section-checkout-interface)
11. [Complete Interaction Map](#11-complete-interaction-map)
12. [CSS Dimensions - Exact Measurements](#12-css-dimensions-exact-measurements)

---

## 1. Initial State - Before Image Upload

### 1.1 Page Load Sequence

When the mobile page loads, here's **EXACTLY** what happens in order:

1. **Redirect Check** (runs immediately, before page renders):
   - Checks if device is desktop (>1024px width AND not mobile user agent)
   - If desktop detected: Redirects to `/desktop/`
   - If mobile: Stays on mobile version

2. **Scroll Reset** (runs immediately):
   - Sets `scrollRestoration = 'manual'`
   - Scrolls to `(0, 0)` immediately
   - Prevents scroll restoration on page load

3. **DOM Structure Loads**:
   - Main container loads
   - Editor panel loads (but hidden)
   - Control panel loads with initial upload box

### 1.2 Initial Visual Layout

```
┌─────────────────────────────────────┐
│                                     │
│   (Editor Panel - HIDDEN)          │
│   display: none                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     ┌───────────────────────┐      │
│     │                       │      │
│     │        ↑              │      │ ← 32px icon
│     │                       │      │
│     │  Upload an image to   │      │ ← 14px text
│     │   convert to brick    │      │
│     │        art            │      │
│     │                       │      │
│     │  Will be initially    │      │ ← 12px text
│     │    set to 32x32       │      │
│     │                       │      │
│     └───────────────────────┘      │
│                                     │
│  (Tool Buttons - HIDDEN)            │
│                                     │
│  (All Panels - HIDDEN)              │
│                                     │
│  (Price Section - HIDDEN)           │
│                                     │
│  [Info Box - Always Visible]        │
│  [Directions - Always Visible]      │
│                                     │
└─────────────────────────────────────┘
```

### 1.3 Main Container Structure

**Element:** `.main-container`

**CSS Properties:**
- `display: flex`
- `min-height: 100vh`
- `max-width: 100vw`
- `overflow-x: hidden`
- `margin: 0 auto`
- `flex-direction: row` (on mobile, but will stack)

**Contains:**
1. Viewer Panel (left side) - 50% width, flex: 1
2. Control Panel (right side) - Fixed 450px width

### 1.4 Viewer Panel (Left Side)

**Element:** `.viewer-panel`

**Initial State:**
- `display: flex`
- `flex-direction: column`
- `flex: 1` (takes 50% of width)
- `min-width: 0`
- `background: #FFFBF5`
- `overflow: hidden`

**Contains:**

#### 1.4.1 Editor Panel

**Element:** `#editor-panel`

**Initial State:**
- `display: none` (HIDDEN)
- Will be shown after image upload

**When Visible:**
- `display: flex`
- `flex-direction: column`
- `flex: 1`
- `padding: 20px 24px`
- `background: #FFFBF5`
- `overflow: visible`
- `min-width: 0`

#### 1.4.2 3D Canvas Container

**Element:** `#canvas-container`

**Initial State:**
- `display: none` (HIDDEN)
- Will be shown when "View in 3D" button is clicked

**When Visible:**
- `display: block`
- `flex: 1`
- `position: relative`
- `background: #FFF8F0`
- `border-right: 1px solid #e0e0e0`
- `min-height: 600px`

**Contains:**
- Three.js renderer canvas
- Placeholder message (when no STL loaded)
- Viewer control buttons (top-left)

### 1.5 Control Panel (Right Side)

**Element:** `.control-panel`

**Initial State:**
- `flex: 0 0 450px`
- `min-width: 450px`
- `background: #FFFBF5`
- `padding: 40px`
- `overflow: visible`
- `border-left: 1px solid #e0e0e0`
- `display: flex`
- `flex-direction: column`
- `align-items: center`
- `justify-content: flex-start`
- `padding-left: 20px`
- `padding-right: 20px`

**Initial Contents (in order):**

#### 1.5.1 Initial Upload Box

**Element:** `#initial-upload-box`

**Visibility:** `display: block` (VISIBLE initially)

**Styling:**
- `width: 100%`
- `padding: 40px 20px`
- `background: #fafafa`
- `border: 2px dashed #d0d0d0`
- `border-radius: 8px`
- `margin-bottom: 20px`
- `text-align: center`
- `cursor: pointer`
- `box-sizing: border-box`
- `display: flex`
- `flex-direction: column`
- `align-items: center`
- `justify-content: center`
- `min-height: 200px`
- `-webkit-tap-highlight-color: transparent`
- `touch-action: manipulation`

**Contents:**
1. **Upload Icon:**
   - `font-size: 32px`
   - `color: #999`
   - `margin-bottom: 16px`
   - Text: "↑"

2. **Main Text:**
   - `font-size: 14px`
   - `color: #666`
   - `font-family: 'Courier New', monospace`
   - `margin-bottom: 8px`
   - Text: "Upload an image to convert to brick art"

3. **Subtext:**
   - `font-size: 12px`
   - `color: #666`
   - `font-family: 'Courier New', monospace`
   - Text: "Will be initially set to 32x32"

**File Input:**
- `id: "png-input"`
- `type: "file"`
- `class: "file-input"`
- `accept: "image/*,.png,.jpg,.jpeg,.heic,.heif"`
- `display: none` (hidden, triggered by label click)

**Interaction:**
- When tapped/clicked: Triggers file input dialog
- Works on both touch and mouse events
- Prevents double-triggering with debounce (500ms)

#### 1.5.2 Upload Panel

**Element:** `#upload-panel`

**Initial State:**
- `display: none` (HIDDEN)
- Part of `.section` class
- Will show after image upload

#### 1.5.3 Grid Size Panel

**Element:** `#size-panel`

**Initial State:**
- `display: none !important` (HIDDEN - collapsible-section)
- Class: `.section.collapsible-section`
- Will show when Size button is clicked

#### 1.5.4 Adjust Panel

**Element:** `#adjust-panel`

**Initial State:**
- `display: none !important` (HIDDEN - collapsible-section)
- Class: `.section.collapsible-section`
- Will show when Adjust button is clicked

#### 1.5.5 Paint Panel

**Element:** `#paint-panel`

**Initial State:**
- `display: none !important` (HIDDEN - collapsible-section)
- Class: `.section.collapsible-section`
- Will show when Paint button is clicked

#### 1.5.6 Tool Buttons

**Element:** `#action-buttons-container`

**Initial State:**
- `display: none` (HIDDEN)
- Class: `.top-action-buttons`
- Will show after image upload

#### 1.5.7 Price Section

**Element:** `#price-display-section`

**Initial State:**
- `display: none` (HIDDEN)
- Will show after image upload

#### 1.5.8 Info Box

**Element:** `.info-box`

**Visibility:** Always visible

**Styling:**
- `background: transparent`
- `border: none`
- `padding: 20px`
- `margin: 20px 0`
- `text-align: left`
- `max-width: 100%`
- `box-sizing: border-box`

**Contents:**
- Title: "Custom Brick Mosaic Designer" (16px, bold)
- Description: "Turn your favourite photos into stunning brick art—made by you!" (14px)
- Additional text: "Bring your memories to life..." (14px)

#### 1.5.9 Directions Section

**Visibility:** Always visible

**Contents:**
- Title: "How to Use" (18px, font-weight: 600)
- Step-by-step instructions (14px, line-height: 1.8)

---

## 2. Image Upload Flow - Complete Step-by-Step

### 2.1 User Taps Initial Upload Box

**What Happens:**
1. Touch event fires (or click on desktop)
2. File input (`#png-input`) is triggered programmatically
3. Device file picker opens

**Code Flow:**
```
User taps upload box
  ↓
triggerFileInput() function called
  ↓
Debounce check (500ms)
  ↓
fileInput.click() called
  ↓
File picker opens
```

### 2.2 User Selects Image File

**Supported Formats:**
- `.png`
- `.jpg` / `.jpeg`
- `.heic` / `.heif` (converted to PNG)

**What Happens:**
1. File input `change` event fires
2. File is read as DataURL
3. Image type detection:
   - HEIC/HEIF: Converted using `heic2any` library
   - Other formats: Used directly

### 2.3 Image Processing Sequence

**Step 1: Load Image**
```javascript
const reader = new FileReader();
reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
        // Image loaded, proceed to next step
    };
    img.src = event.target.result;
};
reader.readAsDataURL(file);
```

**Step 2: Store Original Image**
- `rawUploadedImage = img` (stored globally)
- Image is NOT modified at this point

**Step 3: Process Image**
- Default grid size: 75×75 (if not already selected)
- Calls `createProcessedImageAtSize()` function
- Creates processed version at selected grid size

**Step 4: Display Processed Image**
- Canvas is created/updated
- Processed image is drawn on canvas
- Editor panel becomes visible

### 2.4 Immediate UI Changes After Upload

**Within ~50ms:**

1. **Initial Upload Box:**
   - `display: none` (HIDDEN)

2. **Editor Panel:**
   - `display: flex` (SHOWN)
   - Processed canvas visible

3. **Tool Buttons:**
   - `display: flex` (SHOWN)
   - All 4 buttons visible

4. **Upload Panel:**
   - `display: block` (SHOWN)
   - Shows "Processed image" text

5. **Size Panel:**
   - Gets `.active` class automatically
   - `display: flex !important` (SHOWN)
   - Grid size buttons visible

6. **Price Section:**
   - `display: block` (SHOWN)
   - Price, details, and buttons visible

**After ~200ms:**

7. **Cropper:**
   - Automatically shows if image uploaded
   - `showCropper()` function called
   - Original image displayed in cropper
   - Crop box initialized

### 2.5 Image File Storage

**IndexedDB Storage:**
- Key: `png_{gridSize}` (e.g., `png_75`)
- Stores the processed PNG file as Blob
- Persists across page reloads
- Auto-restored when page loads if file exists

**Memory Storage:**
- `rawUploadedImage`: Original uploaded image (Image object)
- `pngFile`: Processed PNG file (File object)
- `pngImage`: Processed PNG image (Image object)
- `processedImageData`: ImageData object for painting

---

## 3. After Upload - What Changes Immediately

### 3.1 Layout Transformation

**Before Upload:**
```
┌─────────────────┬──────────────────┐
│  (Hidden)       │  [Upload Box]    │
│  Editor Panel   │  [Info Box]      │
│                 │  [Directions]    │
└─────────────────┴──────────────────┘
```

**After Upload:**
```
┌─────────────────┬──────────────────┐
│  [Editor Panel] │  [Tool Buttons]  │
│  [Processed     │  [Upload Panel]  │
│   Canvas]       │  [Size Panel]    │
│                 │  [Price Section] │
│                 │  [Info Box]      │
└─────────────────┴──────────────────┘
```

### 3.2 Tool Buttons Appear

**Container:** `#action-buttons-container`

**Layout:**
```
┌─────────┬─────────┬─────────┬─────────┐
│   ↑     │   □     │   ☰     │   ✎     │
│ Upload  │  Size   │ Adjust  │  Paint  │
└─────────┴─────────┴─────────┴─────────┘
```

**Styling Details:**
- Width: 100% of control panel
- Height: ~60px per button
- Gap: 0px (buttons touch each other)
- Border radius: 6px (rounded corners)
- Background: `#E0E0E0`
- Border: 1px solid `#333333` between buttons

**Each Button:**
- `flex: 1` (equal width)
- `display: flex`
- `flex-direction: column`
- `align-items: center`
- `justify-content: center`
- `padding: 8px 4px`
- Icon above text
- Font: Courier New, 14px

### 3.3 Editor Panel Becomes Visible

**Header:**
```
┌────────────────────────────────────┐
│  Edit Your Photo        [View in 3D]│
└────────────────────────────────────┘
```

**Canvas:**
- Square canvas
- Fills available width
- Aspect ratio: 1:1
- Shows processed image
- Border: 2px solid `#ddd`
- Border radius: 10px
- Box shadow: `0 4px 12px rgba(0,0,0,0.1)`

**Controls (below canvas):**
```
[+][−][□]              [View in 3D]
```

- Left side: Zoom controls (3 buttons, 40×40px each)
- Right side: View in 3D button

### 3.4 Size Panel Auto-Opens

**Why:** Default behavior when image is uploaded

**What Shows:**
1. Section label: "2. Select Grid Size"
2. Three grid size buttons:
   - "Normal" (48×48)
   - "75 × 75" (default, active)
   - "96 × 96"
3. Cropper automatically appears below

**Grid Button Styling:**
- Equal width (flex: 1)
- Padding: 12px
- Background: `#E0E0E0`
- Border: 1px solid `#333333`
- Border radius: 6px
- Active button: `#d0d0d0` background

### 3.5 Upload Panel Shows

**Section Label:**
- Text: "Uploaded Image"
- Font: Courier New, 13px
- Color: `#FF6B35`
- Margin-bottom: 4px

**Upload Area:**
- Shows "Processed image" text
- Icon: 🖼️ (20px)
- Text: "Choose image file..." (12px)
- Subtext: "Will be resized to 75×75 pixels" (10px)

**Cropper Preview:**
- Initially hidden
- Shows when "Show Cropper" button clicked
- Or automatically if Size panel is active

### 3.6 Price Section Appears

**Layout:**
```
┌─────────────────┬─────────────────┐
│   Price Card    │  Details Card   │
│    $XX.XX       │  Dimensions     │
│                 │  Baseplate      │
└─────────────────┴─────────────────┘
┌───────────────────────────────────┐
│       ADD TO CART                 │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│  [Stand Image]  Stand    [Toggle] │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│  [Mounting]  Nano Dots  [Toggle]  │
└───────────────────────────────────┘
```

**Price Card:**
- Flex: 1
- Background: `#f0f0f0`
- Border radius: 8px
- Font size: 24px
- Font weight: 600
- Color: `#333`

**Details Card:**
- Flex: 1
- Padding: 16px
- Background: `#f0f0f0`
- Border radius: 8px
- Font size: 12px
- Color: `#666`

**Add to Cart Button:**
- Width: 100%
- Padding: 16px
- Background: `#2d5016`
- Color: white
- Border: none
- Border radius: 6px
- Font size: 16px
- Font weight: 600
- Text transform: uppercase

**Toggle Switches:**
- Width: 44px
- Height: 24px
- Border radius: 24px
- Background (unchecked): `#ccc`
- Background (checked): `#2d5016`
- White circle indicator (18px)

---

## 4. Tool Buttons System - Every Button Explained

### 4.1 Button Container

**Element:** `.top-action-buttons`

**Styling:**
- `display: flex`
- `width: 100%`
- `max-width: 100%`
- `margin-left: auto`
- `margin-right: auto`
- `justify-content: center`
- Gap: 0px (buttons touch)

**Responsive:**
- On mobile (< 768px): Full width
- Buttons stack if needed (flex-wrap: nowrap by default)

### 4.2 Upload Button

**Element:** `label[for="png-input"]` or `#upload-btn`

**Visual:**
```
┌─────────┐
│    ↑    │ ← 20px icon
│ Upload  │ ← 14px text
└─────────┘
```

**Styling:**
- Same as other tool buttons
- Acts as label for file input

**Behavior:**
- Click/tap: Opens file picker
- Allows re-uploading image
- Replaces current image if clicked

**States:**
- Default: `#E0E0E0` background
- No active state (always available)

### 4.3 Size Button

**Element:** `#size-btn`

**Visual:**
```
┌─────────┐
│    □    │ ← 20px icon
│  Size   │ ← 14px text
└─────────┘
```

**Function:** `togglePanel('size')`

**Behavior:**
1. **When Clicked:**
   - Hides all other panels (remove `.active`)
   - Shows Size panel (add `.active`)
   - Activates button (add `.active`)
   - If image uploaded: Shows cropper automatically

2. **Active State:**
   - Background: `#d0d0d0`
   - Size panel visible
   - Cropper visible (if image uploaded)

3. **What It Shows:**
   - Grid size selection buttons
   - Cropper interface
   - Crop controls

### 4.4 Adjust Button

**Element:** `#adjust-btn`

**Visual:**
```
┌─────────┐
│    ☰    │ ← 20px icon
│ Adjust  │ ← 14px text
└─────────┘
```

**Function:** `togglePanel('adjust')`

**Behavior:**
1. **When Clicked:**
   - Hides all other panels
   - Hides cropper (if visible)
   - Shows Adjust panel (add `.active`)
   - Activates button (add `.active`)

2. **Active State:**
   - Background: `#d0d0d0`
   - Adjust panel visible

3. **What It Shows:**
   - Contrast slider
   - Brightness slider
   - Tones slider
   - All affect processed image in real-time

### 4.5 Paint Button

**Element:** `#paint-btn`

**Visual:**
```
┌─────────┐
│    ✎    │ ← 20px icon
│  Paint  │ ← 14px text
└─────────┘
```

**Function:** `togglePanel('paint')`

**Behavior:**
1. **When Clicked:**
   - Hides all other panels
   - Hides cropper (if visible)
   - Shows Paint panel (add `.active`)
   - Activates button (add `.active`)
   - Enables painting on canvas

2. **Active State:**
   - Background: `#d0d0d0`
   - Paint panel visible
   - Canvas cursor: `crosshair`

3. **What It Shows:**
   - Color palette (4 colors)
   - Brush size slider
   - Undo/Redo buttons
   - Reset Image button

### 4.6 Button Interaction States

**Normal (Inactive):**
- Background: `#E0E0E0`
- Border: 1px solid `#333333`
- No hover effect on mobile

**Active (Selected):**
- Background: `#d0d0d0` (darker)
- Border: 1px solid `#333333`
- Has `.active` class

**Touch Feedback:**
- `-webkit-tap-highlight-color: transparent`
- `touch-action: manipulation`
- No visual feedback on tap (relies on active state)

---

## 5. Editor Panel - Photo Editing View

### 5.1 Panel Structure

**Container:** `#editor-panel`

**Layout:**
```
┌──────────────────────────────────────┐
│  Edit Your Photo          [View 3D]  │ ← Header
├──────────────────────────────────────┤
│                                      │
│      ┌──────────────────┐           │
│      │                  │           │
│      │  Processed Image │           │ ← Canvas
│      │      Canvas      │           │
│      │                  │           │
│      └──────────────────┘           │
│                                      │
│  [+][−][□]              [View 3D]   │ ← Controls
└──────────────────────────────────────┘
```

### 5.2 Header Section

**Element:** `.panel-header`

**Layout:**
- `display: flex`
- `justify-content: space-between`
- `align-items: center`
- `margin-bottom: 12px`
- `flex-shrink: 0`

**Left Side - Title:**
- Element: `h2.panel-title#mobile-panel-title`
- Text: "Edit Your Photo"
- Font: Courier New
- Font size: 24px
- Font weight: normal
- Color: `#E87D3E`
- Margin: 0

**Right Side - View in 3D Button:**
- Text: "View in 3D"
- Padding: 12px 16px
- Font: Courier New, 14px
- Background: `#E0E0E0`
- Border: 1px solid `#333333`
- Border radius: 6px
- Color: `#333333`
- White-space: nowrap
- Flex-shrink: 0

**Function:** Calls `show3DView()` when clicked

### 5.3 Canvas Container

**Element:** `.canvas-wrapper`

**Styling:**
- `text-align: center`
- `margin-bottom: 0`
- `margin-top: 12px`

**Contains:**

#### 5.3.1 Canvas Label

**Element:** `.canvas-label#mobile-canvas-label`

**Initial State:** `display: none`

**When Visible:**
- Text: "Processed (Posterized)"
- Font: Courier New, 14px
- Font weight: normal
- Color: `#E87D3E`
- Margin-bottom: 10px

#### 5.3.2 Canvas Element

**Element:** `#processed-canvas`

**Styling:**
- `max-width: 100%`
- `width: 100%`
- `aspect-ratio: 1 / 1`
- `height: auto`
- `border-radius: 10px`
- `border: 2px solid #ddd`
- `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
- `background: #ffffff !important`
- `display: block`
- `margin: 0 auto`
- `cursor: crosshair` (for painting)

**Internal Resolution:**
- Set dynamically based on container width
- Container width: `editor-panel width - 48px padding`
- Canvas size: `containerWidth` (square)

**Drawing:**
- Processed image drawn at full canvas size
- Maintains 1:1 aspect ratio
- Image smoothing based on mode:
  - Posterized (48×48): Enabled
  - Pixelated (75×75, 96×96): Disabled

### 5.4 Canvas Controls

**Container:**
- Position: Below canvas
- `display: flex`
- `flex-direction: row`
- `gap: 5px`
- `justify-content: space-between`
- `align-items: center`
- `margin-top: 10px`
- `margin-bottom: 0`
- `width: 100%`

#### 5.4.1 Zoom Controls (Left Side)

**Container:**
- `display: flex`
- `flex-direction: row`
- `gap: 5px`

**Zoom In Button (+):**
- Function: `zoomInProcessed()`
- Width: 40px
- Height: 40px
- Min/max width/height: 40px
- Padding: 0
- Margin: 0
- Font size: 18px
- Background: `#E0E0E0`
- Border: 1px solid `#333333`
- Border radius: 6px
- Cursor: pointer
- Display: flex
- Align-items: center
- Justify-content: center
- Flex-shrink: 0
- Box-sizing: border-box
- Title: "Zoom In"

**Zoom Out Button (−):**
- Function: `zoomOutProcessed()`
- Same styling as Zoom In
- Title: "Zoom Out"

**Reset View Button (□):**
- Function: `resetZoomProcessed()`
- ID: `processed-reset-btn`
- Same styling as Zoom In/Out
- Title: "Reset View"

#### 5.4.2 View in 3D Button (Right Side)

**Function:** `show3DView()`

**Styling:**
- Padding: 12px 16px
- Margin: 0
- Font size: 14px
- Background: `#E0E0E0`
- Border: 1px solid `#333333`
- Border radius: 6px
- Cursor: pointer
- Color: `#333333`
- White-space: nowrap
- Flex-shrink: 0
- Font-family: Courier New
- Font-weight: normal
- Title: "View in 3D"

### 5.5 Canvas Interaction States

#### 5.5.1 Normal Paint Mode

**Cursor:** `crosshair`

**Interaction:**
- Click/touch: Paint pixel at clicked location
- Drag: Paint along drag path
- Brush size: Applied (1 pixel or more based on slider)

**Painting Logic:**
1. Get click coordinates relative to canvas
2. Convert to image pixel coordinates (accounting for zoom/pan)
3. Paint pixel(s) with selected color
4. Update `processedImageData`
5. Redraw canvas

#### 5.5.2 Zoom In Mode

**Activation:** Click Zoom In button

**Button State:**
- Background: `#d0d0d0` (highlighted)
- `zoomMode = 'zoom-in'`

**Cursor:** `crosshair`

**Interaction:**
- Click/touch on canvas: Zoom in at clicked point
- Zoom factor: 1.3x per click
- Max zoom: 10x
- Point stays centered under cursor

**Zoom Calculation:**
```javascript
const imageX = (canvasX - w/2 - offsetX) / currentZoom;
const imageY = (canvasY - h/2 - offsetY) / currentZoom;
newZoom = currentZoom * 1.3;
newOffsetX = canvasX - w/2 - imageX * newZoom;
newOffsetY = canvasY - h/2 - imageY * newZoom;
```

#### 5.5.3 Zoom Out Mode

**Activation:** Click Zoom Out button

**Button State:**
- Background: `#d0d0d0` (highlighted)
- `zoomMode = 'zoom-out'`

**Cursor:** `crosshair`

**Interaction:**
- Click/touch on canvas: Zoom out from clicked point
- Zoom factor: 1.3x per click
- Min zoom: 1.0x (can't zoom out past original)

#### 5.5.4 Pan Mode (When Zoomed)

**Activation:** Automatically enabled when zoom > 1.0

**Cursor:** `grab` (when hovering), `grabbing` (when dragging)

**Interaction:**
- Drag: Pan image within canvas
- Constrained to image bounds (no whitespace)
- Only works when zoomed in

**Pan Calculation:**
```javascript
deltaX = currentX - startX;
deltaY = currentY - startY;
newOffsetX = startOffsetX + deltaX;
newOffsetY = startOffsetY + deltaY;
// Constrain to bounds
```

#### 5.5.5 Reset View

**Activation:** Click Reset View button (□)

**Action:**
- Zoom: Reset to 1.0
- Pan offset: Reset to (0, 0)
- Redraw canvas at original size

### 5.6 Canvas Rendering

**Function:** `redrawProcessedCanvas()`

**Process:**
1. Clear canvas
2. Create temp canvas at image data resolution
3. Put `processedImageData` on temp canvas
4. Apply zoom/pan transforms:
   - Translate to center
   - Translate by pan offset
   - Scale by zoom level
5. Draw temp canvas to display canvas
6. Apply image smoothing based on mode

**Zoom/Pan Transform:**
```javascript
ctx.save();
ctx.translate(displayWidth / 2, displayHeight / 2);
ctx.translate(offsetX, offsetY);
ctx.scale(zoom, zoom);
ctx.drawImage(tempCanvas, -displayWidth / 2, -displayHeight / 2, displayWidth, displayHeight);
ctx.restore();
```

---

## 6. 3D Viewer - Complete Interaction Guide

### 6.1 Accessing 3D Viewer

**Button:** "View in 3D" (in editor panel header or below canvas)

**Function:** `show3DView()`

**What Happens:**
1. Checks if STL file is loaded
2. If not loaded: Loads STL from server (based on grid size)
3. Regenerates processed PNG with current settings
4. Hides editor panel
5. Shows 3D canvas container
6. Applies colors to 3D mesh
7. Fits camera to mesh
8. Starts animation loop

### 6.2 3D Viewer Layout

```
┌──────────────────────────────────────┐
│  [Edit Photo]  [↺]                  │ ← Controls
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

### 6.3 Viewer Controls

**Container:** `.viewer-controls`

**Position:**
- `position: absolute`
- `top: 20px`
- `left: 20px`
- `display: flex`
- `gap: 10px`
- `z-index: 10`

#### 6.3.1 Edit Photo Button

**Text:** "Edit Photo"

**Function:** `showEditorPanel()`

**Action:**
- Hides 3D viewer
- Shows editor panel
- Redraws processed canvas (if painted)

**Styling:**
- Class: `.viewer-btn`
- Background: `#E0E0E0`
- Border: 1px solid `#333333`
- Padding: 10px 15px
- Border radius: 6px
- Font: Courier New, 14px
- Color: `#333333`

#### 6.3.2 Reset Camera Button

**Icon:** "↺"

**Function:** `resetCamera()`

**Action:**
- Resets camera position
- Fits mesh to view
- Updates OrbitControls target

**Styling:**
- Class: `.viewer-btn.icon-only`
- Padding: 10px
- Font size: 18px
- Title: "Reset View"

### 6.4 Three.js Scene Setup

**Scene:**
- Background color: `0xfafafa` (light gray)
- Grid helper: 200 units, 20 divisions
- Grid colors: `0xcccccc` and `0xe0e0e0`

**Lights:**
1. **Ambient Light:**
   - Color: `0xffffff`
   - Intensity: 0.6

2. **Directional Light 1:**
   - Color: `0xffffff`
   - Intensity: 0.8
   - Position: (50, 100, 50)
   - Casts shadows: false

3. **Directional Light 2:**
   - Color: `0xffffff`
   - Intensity: 0.4
   - Position: (-50, 50, -50)
   - Casts shadows: false

**Camera:**
- Type: PerspectiveCamera
- FOV: 45 degrees
- Aspect: Calculated from container dimensions
- Near: 0.1
- Far: 1000
- Initial position: (100, 100, 100)

**Renderer:**
- Type: WebGLRenderer
- Antialias: true
- Pixel ratio: `window.devicePixelRatio`
- Size: Container dimensions

**Controls:**
- Type: OrbitControls
- Target: (0, 0, 0)
- Enable damping: true
- Damping factor: 0.05

### 6.5 Mesh Loading

**Function:** `loadSTL(file)`

**Process:**
1. Read STL file as ArrayBuffer
2. Parse STL geometry
3. Create Three.js BufferGeometry
4. Compute vertex normals
5. Create material (MeshStandardMaterial)
6. Create mesh
7. Remove old mesh (if exists)
8. Add new mesh to scene
9. Fit camera to mesh bounds

**Material:**
- Type: MeshStandardMaterial
- Vertex colors: true (for pixelated modes)
- Flat shading: false (smooth)
- Texture: Applied for Normal mode (48×48)

### 6.6 Color Application

**Function:** `applyColorsToMesh()`

**Process:**

1. **Get Processed Image:**
   - Uses `processedImageData` if available
   - Or processes from raw image
   - Creates canvas with image data

2. **For Pixelated Modes (75×75, 96×96):**
   - Map each triangle to image pixel
   - Get pixel color at triangle centroid
   - Apply color to triangle vertices
   - Use vertex colors in material

3. **For Normal Mode (48×48):**
   - Create texture from processed image
   - Apply UV mapping
   - Use texture in material

**Color Mapping:**
```javascript
// Get triangle centroid
cx = (v0.x + v1.x + v2.x) / 3;
cy = (v0.y + v1.y + v2.y) / 3;

// Map to image coordinates
u = (cx - minX) / sizeX;
v = (cy - minY) / sizeY;

// Snap to grid cell
cellU = Math.floor(u * grid) + 0.5;
cellV = Math.floor(v * grid) + 0.5;

// Get pixel color
px = Math.floor((cellU / grid) * imageWidth);
py = Math.floor((1 - cellV / grid) * imageHeight);
```

### 6.7 Interaction Controls

**OrbitControls:**
- **Rotate:** Drag with mouse/touch
- **Zoom:** Scroll wheel or pinch
- **Pan:** Right-click drag or middle-button drag
- **Reset:** Click reset camera button

**Camera Fitting:**
- Calculates bounding box of mesh
- Finds maximum dimension
- Positions camera at (maxDim, maxDim, maxDim)
- Looks at (0, 0, 0)

### 6.8 Placeholder Message

**When STL Not Loaded:**
- Shows placeholder div
- Icon: "□" (80px, opacity 0.3)
- Text: "Upload an STL file to preview your 3D model"
- Center-aligned
- Color: `#333333`
- Font: Courier New, 16px

**When STL Loaded:**
- Placeholder hidden
- Mesh visible

---

## 7. Size Panel - Grid Selection & Cropping

### 7.1 Panel Activation

**Trigger:** Click "Size" tool button

**Function:** `togglePanel('size')`

**What Happens:**
1. All other panels hide (`.active` class removed)
2. Size panel shows (`.active` class added)
3. Size button activates (`.active` class added)
4. If image uploaded: Cropper automatically shows

### 7.2 Panel Structure

**Container:** `#size-panel`

**Styling:**
- Class: `.section.collapsible-section`
- When inactive: `display: none !important`
- When active: `display: flex !important`
- `flex-direction: column`
- `align-items: center`
- `width: 100%`
- `margin-bottom: 5px` (reduced spacing)

### 7.3 Section Label

**Element:** `.section-label#mobile-section-grid`

**Text:** "2. Select Grid Size"

**Styling:**
- Font: Courier New
- Font size: 13px
- Font weight: normal
- Color: `#FF6B35`
- Margin-bottom: 12px
- Text-transform: none
- Letter-spacing: 0
- Text-align: center
- Width: 100%

### 7.4 Grid Size Buttons

**Container:** `.grid-options`

**Layout:**
```
┌─────────┬─────────┬─────────┐
│ Normal  │ 75 × 75 │ 96 × 96 │
│  (48)   │         │         │
└─────────┴─────────┴─────────┘
```

**Styling:**
- `display: flex`
- `gap: 10px`
- `margin-bottom: 20px`
- `justify-content: center`
- `width: 100%`

**Each Button:**
- Class: `.grid-btn`
- ID: `mobile-grid-btn-{size}`
- `flex: 1` (equal width)
- `padding: 12px`
- `border: 1px solid #333333`
- `background: #E0E0E0`
- `border-radius: 6px`
- `cursor: pointer`
- Font: Courier New, 14px
- Font weight: normal
- Color: `#333333`
- Transition: all 0.2s
- Min-width: 0
- Box-sizing: border-box

**Button Text:**
- 48×48: "Normal"
- 75×75: "75 × 75"
- 96×96: "96 × 96"

**Active State:**
- Background: `#d0d0d0` (darker)
- Has `.active` class

**Function:** `selectGridSize(size)`

### 7.5 Grid Size Selection Behavior

**When Button Clicked:**

1. **Update Selected Size:**
   - `selectedGridSize = size`
   - Save to localStorage
   - Update button states

2. **Update Noise Reduction:**
   - 48×48: `noiseReduction = 5`
   - 75×75, 96×96: `noiseReduction = 0`

3. **Update UI Text:**
   - Upload subtext: "Will be resized to {size}×{size} pixels"
   - Price dimensions display

4. **Reprocess Image:**
   - If image uploaded: Process at new size
   - Update processed canvas
   - Update processed image data

5. **Load STL:**
   - Load STL file for selected size
   - Try server first
   - Fallback to cache if server fails

6. **Update Price:**
   - Fetch price for new size
   - Update price display

### 7.6 Cropper Interface

**When Size Panel Opens:**

The cropper automatically shows if an image is uploaded (after 100ms delay).

#### 7.6.1 Upload Panel Visibility

**Container:** `#upload-panel`

**When Size Panel Active:**
- `display: block`
- Upload area: `display: none` (hidden)
- Section label: `display: none` (hidden)
- Only cropper preview visible

#### 7.6.2 Crop Buttons

**Container:** `#crop-buttons`

**Styling:**
- `display: block`
- `margin-top: 15px`
- `text-align: center`

**Show Cropper Button:**
- ID: `show-cropper-btn`
- Function: `showCropper()`
- Width: 100%
- Background: `#E0E0E0`
- Color: `#333333`
- Border: 1px solid `#333333`
- Text: "Show Cropper"
- Initially: `display: block`

**Hide Cropper Button:**
- ID: `hide-cropper-btn`
- Function: `hideCropper()`
- Width: 100%
- Background: `#E0E0E0`
- Color: `#333333`
- Border: 1px solid `#333333`
- Text: "Hide Cropper ^"
- Margin-top: 10px
- Initially: `display: none`

#### 7.6.3 Cropper Preview Container

**Container:** `#png-preview`

**Styling:**
- `display: block` (when shown)
- `text-align: center`
- `margin-top: 15px`
- `width: 100%`

**Crop Container:**
- ID: `crop-container`
- `position: relative`
- `display: inline-block`
- `max-width: 400px`
- `width: 100%`
- `margin: 0 auto`

**Preview Image:**
- ID: `png-preview-img`
- `width: 100%`
- `max-width: 400px`
- `height: auto`
- `object-fit: contain`
- `display: block`
- `margin: 0 auto`
- Shows original uploaded image (not processed)

**Crop Canvas Overlay:**
- ID: `crop-canvas`
- `position: absolute`
- `top: 0`
- `left: 0`
- `pointer-events: auto`
- `display: block` (when cropper active)
- `border: none`
- `background: transparent`
- `z-index: 10`
- `touch-action: none`

### 7.7 Crop Box

**Visual:**
- Blue dotted rectangle
- Shows selected crop area
- Snaps to grid cells
- Resizable handles on corners and edges

**Initialization:**
- Center of image
- 80% of image size
- Snapped to grid cells

**Styling:**
- Stroke: Blue color
- Line dash: [5, 5] (dotted)
- Line width: 2px

**Interactions:**

1. **Drag to Move:**
   - Click/touch inside box
   - Drag to move box
   - Snaps to grid cells
   - Constrained to image bounds

2. **Resize from Corners:**
   - Click/touch corner
   - Drag to resize
   - Maintains square aspect ratio
   - Snaps to grid cells

3. **Resize from Edges:**
   - Click/touch edge
   - Drag to resize that edge
   - Other edges adjust to maintain square
   - Snaps to grid cells

**Grid Snapping:**
- Grid size = selected grid size (48, 75, or 96)
- Cell size = image display width / grid size
- Crop box position and size snap to cell boundaries

### 7.8 Cropper Functions

**Show Cropper:**
- Function: `showCropper()`
- Shows preview image
- Shows crop canvas overlay
- Initializes crop box
- Freezes preview image (doesn't update during editing)

**Hide Cropper:**
- Function: `hideCropper()`
- Hides crop canvas
- Hides preview image
- Shows "Show Cropper" button
- Hides "Hide Cropper" button

**Apply Crop:**
- Function: `applyCropFromBox()`
- Called automatically during drag/resize
- Converts crop coordinates to image coordinates
- Updates `cropCoordinates` variable
- Reprocesses image with crop

### 7.9 Crop Coordinate System

**Display Coordinates:**
- Crop box position: `cropX`, `cropY` (in pixels)
- Crop box size: `cropSize` (in pixels)
- Relative to preview image display area

**Image Coordinates:**
- Calculated from display coordinates
- Scale factor = source image width / display width
- Stored in `cropCoordinates`:
  - `x`: Left position in source image
  - `y`: Top position in source image
  - `size`: Size in source image

**Grid Alignment:**
- Final crop size is multiple of grid cell size
- Crop position aligns to grid cells
- Ensures clean pixel boundaries

---

## 8. Adjust Panel - Image Adjustments

### 8.1 Panel Activation

**Trigger:** Click "Adjust" tool button

**Function:** `togglePanel('adjust')`

**What Happens:**
1. All other panels hide
2. Cropper hides (if visible)
3. Adjust panel shows (`.active` class)
4. Adjust button activates (`.active` class)

### 8.2 Panel Structure

**Container:** `#adjust-panel`

**Styling:**
- Class: `.section.collapsible-section`
- When inactive: `display: none !important`
- When active: `display: flex !important`
- `flex-direction: column`
- `align-items: center`
- `width: 100%`
- `margin-bottom: 30px`

### 8.3 Section Label

**Element:** `.section-label#mobile-section-adjustments`

**Text:** "Image Adjustments"

**Styling:**
- Font: Courier New, 13px
- Color: `#FF6B35`
- Margin-bottom: 12px
- Text-align: center
- Width: 100%

### 8.4 Contrast Slider

**Container:** `.slider-control`

**Styling:**
- `margin-bottom: 20px`
- `width: 100%`

**Label:**
- Element: `.slider-label`
- `display: flex`
- `justify-content: space-between`
- `margin-bottom: 8px`
- Font: Courier New, 14px
- Color: `#333333`

**Left Side:**
- Text: "Contrast" (or `mobile-slider-contrast-label`)

**Right Side:**
- Element: `#contrast-value`
- Text: Current value (e.g., "1.2")
- Updates as slider moves

**Slider:**
- Element: `#contrast-slider`
- Type: `range`
- Min: 0
- Max: 3
- Step: 0.1
- Default: 1.2
- Width: 100%
- Height: 6px
- Background: `#ddd`
- Border radius: 3px
- Thumb: 20px circle, black

**Function:**
- Updates `editorSettings.contrast`
- Calls `processImage()` on change
- Updates processed canvas in real-time

### 8.5 Brightness Slider

**Same structure as Contrast:**

**Label:** "Brightness" (`mobile-slider-brightness-label`)

**Value Display:** `#brightness-value`

**Slider:**
- Element: `#brightness-slider`
- Min: 0
- Max: 3
- Step: 0.1
- Default: 1.0

**Function:**
- Updates `editorSettings.brightness`
- Calls `processImage()` on change

### 8.6 Tones Slider

**Same structure as Contrast:**

**Label:** "Tones" (`mobile-slider-tones-label`)

**Value Display:** `#tones-value`

**Slider:**
- Element: `#tones-slider`
- Min: 2
- Max: 4
- Step: 1
- Default: 4

**Note:** Currently always uses 4 tones (slider exists but may not affect processing)

**Function:**
- Updates `editorSettings.tones`
- Calls `processImage()` on change

### 8.7 Real-Time Processing

**When Slider Moves:**

1. **Event Listener Fires:**
   ```javascript
   slider.addEventListener('input', (e) => {
       editorSettings.contrast = parseFloat(e.target.value);
       document.getElementById('contrast-value').textContent = e.target.value;
       processImage();
   });
   ```

2. **processImage() Called:**
   - Gets current slider values
   - Applies adjustments to image
   - Updates `processedImageData`
   - Redraws canvas

3. **Canvas Updates:**
   - Processed image redrawn
   - Changes visible immediately
   - No delay or lag

### 8.8 Adjustment Processing

**Contrast:**
```javascript
gray = ((gray / 255 - 0.5) * contrast + 0.5) * 255;
```

**Brightness:**
```javascript
gray = gray * brightness;
```

**Tones (Posterization):**
```javascript
// Always 4 colors: [0, 85, 170, 255]
const base = [0, 85, 170, 255];
const n = 4; // Always 4
// Map gray value to nearest color
```

**Clamping:**
- All values clamped to 0-255 range
- `gray = Math.max(0, Math.min(255, gray));`

---

## 9. Paint Panel - Painting Tools

### 9.1 Panel Activation

**Trigger:** Click "Paint" tool button

**Function:** `togglePanel('paint')`

**What Happens:**
1. All other panels hide
2. Cropper hides (if visible)
3. Paint panel shows (`.active` class)
4. Paint button activates (`.active` class)
5. Canvas cursor changes to `crosshair`
6. Paint handlers enabled

### 9.2 Panel Structure

**Container:** `#paint-panel`

**Styling:**
- Class: `.section.collapsible-section`
- When inactive: `display: none !important`
- When active: `display: flex !important`
- `flex-direction: column`
- `align-items: center`
- `width: 100%`
- `margin-bottom: 30px`

### 9.3 Section Label

**Element:** `.section-label#mobile-section-painting`

**Text:** "Painting"

**Styling:**
- Font: Courier New, 13px
- Color: `#FF6B35`
- Margin-bottom: 12px
- Text-align: center
- Width: 100%

### 9.4 Color Palette

**Container:** `.color-palette`

**Layout:**
```
┌─────┬─────┬─────┬─────┐
│Black│Dark │Light│White│
│     │Gray │Gray │     │
└─────┴─────┴─────┴─────┘
```

**Styling:**
- `display: flex`
- `gap: 10px`
- `margin-top: 15px`
- `margin-bottom: 30px`
- `padding-bottom: 20px`
- `width: 100%`
- `justify-content: space-between`

**Each Color Swatch:**

**Styling:**
- Class: `.color-swatch`
- `width: 50px`
- `height: 50px`
- `border-radius: 8px`
- `border: 2px solid #ddd`
- `cursor: pointer`
- `position: relative`
- Background: RGB color value

**Colors:**
1. **Black:**
   - RGB: `(0, 0, 0)`
   - Background: `rgb(0,0,0)`
   - Title: "Black"
   - Initially selected (`.selected` class)

2. **Dark Gray:**
   - RGB: `(85, 85, 85)`
   - Background: `rgb(85,85,85)`
   - Title: "Dark Gray"

3. **Light Gray:**
   - RGB: `(170, 170, 170)`
   - Background: `rgb(170,170,170)`
   - Title: "Light Gray"

4. **White:**
   - RGB: `(255, 255, 255)`
   - Background: `rgb(255,255,255)`
   - Title: "White"

**Color Labels:**
- Position: Below swatch
- `position: absolute`
- `bottom: -20px`
- `left: 50%`
- `transform: translateX(-50%)`
- Font size: 10px
- Color: `#333`
- White-space: nowrap

**Selected State:**
- Border: 2px solid `#333333` (thicker, darker)
- Has `.selected` class

**Function:** `selectPaintColor(r, g, b, element)`

**Behavior:**
- Updates `selectedPaintColor = { r, g, b }`
- Removes `.selected` from all swatches
- Adds `.selected` to clicked swatch

### 9.5 Brush Size Slider

**Container:** `.slider-control`

**Styling:**
- `margin-top: 15px`
- `width: 100%`

**Label:**
- `display: flex`
- `justify-content: space-between`
- Font: Courier New, 14px

**Left Side:**
- Text: "Brush Size"

**Right Side:**
- Element: `#brush-size-value`
- Text: Current value (e.g., "1")

**Slider:**
- Element: `#brush-size-slider`
- Type: `range`
- Min: 1
- Max: 10
- Step: 1
- Default: 1
- Width: 100%
- Height: 6px
- Background: `#ddd`
- Thumb: 20px circle, black

**Function:**
- Updates `brushSize` variable
- Affects painting area size

### 9.6 Brush Modes

**Posterized Mode (48×48):**
- Circular brush
- Radius = `brushSize / 2`
- Paints pixels within circle
- Smooth edges

**Pixelated Mode (75×75, 96×96):**
- Square brush
- Size = `brushSize × brushSize` pixels
- Paints all pixels in square
- Hard edges

### 9.7 Undo/Redo Buttons

**Container:** `#undo-redo-buttons`

**Initial State:** `display: none`
**When Paint Panel Active:** `display: flex`

**Layout:**
```
┌───────────────┬───────────────┐
│  ← Undo       │  Redo →       │
└───────────────┴───────────────┘
```

**Styling:**
- `display: flex`
- `gap: 10px`
- `margin-top: 15px`
- `width: 100%`

**Undo Button:**
- ID: `undo-btn`
- Function: `undoPaint()`
- `flex: 1`
- Background: `#E0E0E0`
- Color: `#333333`
- Border: 1px solid `#333333`
- Text: "← Undo"
- Initially: `disabled` (if no undo available)

**Redo Button:**
- ID: `redo-btn`
- Function: `redoPaint()`
- `flex: 1`
- Background: `#E0E0E0`
- Color: `#333333`
- Border: 1px solid `#333333`
- Text: "Redo →"
- Initially: `disabled` (if no redo available)

**Button States:**
- Enabled: Normal styling
- Disabled: `disabled` attribute, grayed out

**Undo Stack:**
- Stores ImageData before each paint stroke
- Max stack size: Unlimited (or very large)
- Saves state before starting to paint

**Redo Stack:**
- Stores undone states
- Cleared when new paint operation starts

**Keyboard Shortcuts:**
- Cmd+Z / Ctrl+Z: Undo
- Cmd+Shift+Z / Ctrl+Y: Redo
- Only works in editor panel

### 9.8 Reset Image Button

**Function:** `resetProcessedImage()`

**Styling:**
- Width: 100%
- Margin-top: 10px
- Background: `#E0E0E0`
- Color: `#333333`
- Border: 1px solid `#333333`
- Text: "Reset Image"

**Action:**
- Restores `processedImageData` from `originalProcessedImageData`
- Redraws canvas
- Clears undo/redo stacks

### 9.9 Painting Interaction

**Canvas Setup:**
- Cursor: `crosshair`
- Paint handlers attached
- Listens for mouse/touch events

**Mouse/Touch Down:**
1. Check if in paint mode (not zoom/pan)
2. Save current state to undo stack
3. Set `isPainting = true`
4. Paint pixel at clicked location
5. Redraw canvas

**Mouse/Touch Move (while painting):**
1. Paint pixels along drag path
2. Redraw canvas continuously
3. Update `processedImageData`

**Mouse/Touch Up:**
1. Set `isPainting = false`
2. Final paint stroke
3. Save state for undo

**Painting Logic:**

1. **Convert Canvas Coordinates:**
   ```javascript
   const rect = canvas.getBoundingClientRect();
   const canvasX = event.clientX - rect.left;
   const canvasY = event.clientY - rect.top;
   ```

2. **Account for Zoom/Pan:**
   ```javascript
   const imageSpaceX = (canvasX - w/2 - offsetX) / zoom;
   const imageSpaceY = (canvasY - h/2 - offsetY) / zoom;
   const pixelX = Math.floor((imageSpaceX + w/2) / canvasWidth * imageWidth);
   const pixelY = Math.floor((imageSpaceY + h/2) / canvasHeight * imageHeight);
   ```

3. **Paint Pixel(s):**
   - Circular brush (posterized): Paint within radius
   - Square brush (pixelated): Paint N×N square
   - Update `processedImageData` array
   - Set RGB values to selected color

4. **Redraw Canvas:**
   - Put updated ImageData back
   - Apply zoom/pan transforms
   - Draw to display canvas

---

## 10. Price Section - Checkout Interface

### 10.1 Section Container

**Element:** `#price-display-section`

**Initial State:** `display: none`
**After Upload:** `display: block`

**Styling:**
- `margin-top: 5px`
- `width: 100%`
- `padding: 0 20px`
- `box-sizing: border-box`

### 10.2 Price and Details Cards

**Container:**
- `display: flex`
- `gap: 10px`
- `margin-bottom: 20px`
- `width: 100%`
- `align-items: stretch`

**Price Card:**
- `flex: 1`
- Background: `#f0f0f0`
- Border radius: 8px
- Box-sizing: border-box
- `display: flex`
- `align-items: center`
- `justify-content: center`

**Price Display:**
- Element: `#main-price`
- Font size: 24px
- Font weight: 600
- Color: `#333`
- Text-align: center
- Padding: 16px
- Width: 100%
- Text: "Price loading..." initially, then "$XX.XX"

**Details Card:**
- `flex: 1`
- Padding: 16px
- Background: `#f0f0f0`
- Border radius: 8px
- Box-sizing: border-box
- `display: flex`
- `align-items: center`

**Details Text:**
- Font size: 12px
- Color: `#666`
- Line-height: 1.6
- Text-align: left

**Contents:**
- "Dimensions: {size} × {size}" (`#price-dimensions`)
- "Baseplate: Framed" (`#baseplate-type`)

### 10.3 Add to Cart Button

**Element:** `#add-to-cart-btn`

**Styling:**
- Width: 100%
- Padding: 16px
- Margin-bottom: 20px
- Background: `#2d5016`
- Color: white
- Border: none
- Border radius: 6px
- Font size: 16px
- Font weight: 600
- Cursor: pointer
- Text-transform: uppercase
- Box-sizing: border-box

**Text:** "ADD TO CART"

**Function:**
- Creates order on backend
- Generates 3MF/OBJ files
- Uploads to server
- Shows success/error message
- Does NOT redirect (test mode)

**Process:**
1. Check if STL and PNG files exist
2. Get processed image (from `processedImageData`)
3. Create FormData with files
4. Add grid size, stand, mounting selections
5. Calculate total price
6. POST to `/upload-for-checkout`
7. Receive order ID
8. Show alert with order details

### 10.4 Stand Toggle Section

**Element:** `#stand-section`

**Styling:**
- `margin-bottom: 15px`
- `width: 100%`

**Container:**
- `display: flex`
- `align-items: center`
- `justify-content: space-between`
- Padding: 12px
- Background: `#f9f9f9`
- Border radius: 6px
- Width: 100%
- Box-sizing: border-box

**Left Side:**
- `display: flex`
- `align-items: center`
- `flex: 1`

**Stand Image:**
- Element: `#stand-image`
- Width: 40px
- Height: 40px
- Object-fit: cover
- Border radius: 4px
- Margin-right: 12px
- Initially: `display: none`
- Shows when image loaded from admin

**Stand Info:**
- Stand Name: `#mobile-stand-name`
- Font size: 14px
- Font weight: 500
- Color: `#333`
- Text: "Stand"

- Stand Price: `#stand-price-display`
- Font size: 12px
- Color: `#666`
- Text: "$10.00" (from prices.json)

**Right Side - Toggle:**
- `position: relative`
- `display: inline-block`
- Width: 44px
- Height: 24px

**Checkbox:**
- Element: `#stand-toggle`
- Type: checkbox
- Opacity: 0 (hidden)
- Width: 0
- Height: 0

**Toggle Slider:**
- Element: `#stand-toggle + span`
- `position: absolute`
- Cursor: pointer
- Top: 0
- Left: 0
- Right: 0
- Bottom: 0
- Border radius: 24px
- Transition: 0.4s

**Unchecked State:**
- Background: `#ccc`

**Checked State:**
- Background: `#2d5016`

**Toggle Circle:**
- `position: absolute`
- Height: 18px
- Width: 18px
- Left: 3px
- Bottom: 3px
- Background: white
- Border radius: 50%
- Transition: 0.4s

**Checked Circle:**
- Transform: `translateX(20px)`

**Function:** `updateStandAndPrice()`

**Action:**
- Updates `standSelected` variable
- Recalculates total price
- Updates price display

### 10.5 Add-ons Section

**Element:** `#addons-section`

**Styling:**
- Width: 100%

**Container:**
- Same structure as Stand section

**Mounting Dots:**
- Image: `#mounting-image` (40×40px)
- Name: `#mobile-mounting-name` - "Nano Wall Mounting Dots (Pack of 8)"
- Price: `#addon-mounting-price` - "$5.99"
- Toggle: `#addon-mounting-toggle`

**Function:** `updateTotalPrice()`

**Action:**
- Updates `selectedAddons.mounting`
- Recalculates total price
- Updates price display

### 10.6 Price Calculation

**Base Price:**
- From `prices[{gridSize}x{gridSize}]`
- Example: `prices['75x75']`

**Stand Price:**
- From `prices.stand`
- Added if `standSelected === true`

**Mounting Price:**
- From `prices.wall_mounting_dots`
- Added if `selectedAddons.mounting === true`

**Total:**
```javascript
totalPrice = basePrice + (standSelected ? standPrice : 0) + (mountingSelected ? mountingPrice : 0);
```

**Update Function:** `updatePriceDisplay()`

**Action:**
- Fetches current prices
- Calculates total
- Updates `#main-price` display
- Updates dimension display
- Updates baseplate type display

---

## 11. Complete Interaction Map

### 11.1 User Flow Diagram

```
Start
  ↓
Page Loads
  ↓
[Upload Box Visible]
  ↓
User Taps Upload Box
  ↓
File Picker Opens
  ↓
User Selects Image
  ↓
Image Processing
  ↓
┌─────────────────────────────────┐
│ Upload Box HIDDEN               │
│ Tool Buttons SHOWN              │
│ Editor Panel SHOWN              │
│ Size Panel AUTO-OPENS           │
│ Cropper AUTO-SHOWS              │
│ Price Section SHOWN             │
└─────────────────────────────────┘
  ↓
User Can:
  - Click Size → Crop Image
  - Click Adjust → Change Settings
  - Click Paint → Paint Pixels
  - Click View 3D → See 3D Model
  - Click Add to Cart → Create Order
```

### 11.2 Button Click Map

**Upload Button:**
- Opens file picker
- Replaces current image

**Size Button:**
```
Click Size Button
  ↓
Hide Adjust Panel
Hide Paint Panel
  ↓
Show Size Panel
Activate Size Button
  ↓
If Image Uploaded:
  Show Cropper
  Show Crop Buttons
```

**Adjust Button:**
```
Click Adjust Button
  ↓
Hide Size Panel
Hide Paint Panel
Hide Cropper
  ↓
Show Adjust Panel
Activate Adjust Button
  ↓
Sliders Visible
Real-time Processing
```

**Paint Button:**
```
Click Paint Button
  ↓
Hide Size Panel
Hide Adjust Panel
Hide Cropper
  ↓
Show Paint Panel
Activate Paint Button
  ↓
Color Palette Visible
Brush Size Slider Visible
Canvas: crosshair cursor
Painting Enabled
```

**View in 3D Button:**
```
Click View 3D
  ↓
Check STL Loaded
  ↓
If Not Loaded:
  Load STL from Server
  ↓
Regenerate Processed PNG
  ↓
Hide Editor Panel
Show 3D Canvas Container
  ↓
Apply Colors to Mesh
Fit Camera to Mesh
Start Animation Loop
```

**Edit Photo Button (in 3D view):**
```
Click Edit Photo
  ↓
Hide 3D Canvas Container
Show Editor Panel
  ↓
Redraw Processed Canvas
```

### 11.3 Panel Visibility Matrix

| Panel | Initial | After Upload | Size Active | Adjust Active | Paint Active | 3D View |
|-------|---------|--------------|-------------|---------------|--------------|---------|
| Editor Panel | Hidden | Visible | Visible | Visible | Visible | Hidden |
| 3D Canvas | Hidden | Hidden | Hidden | Hidden | Hidden | Visible |
| Upload Box | Visible | Hidden | Hidden | Hidden | Hidden | Hidden |
| Tool Buttons | Hidden | Visible | Visible | Visible | Visible | Hidden |
| Size Panel | Hidden | Visible (auto) | Visible | Hidden | Hidden | Hidden |
| Adjust Panel | Hidden | Hidden | Hidden | Visible | Hidden | Hidden |
| Paint Panel | Hidden | Hidden | Hidden | Hidden | Visible | Hidden |
| Cropper | Hidden | Visible (if Size) | Visible | Hidden | Hidden | Hidden |
| Price Section | Hidden | Visible | Visible | Visible | Visible | Hidden |

### 11.4 State Variables

**Global State:**
- `rawUploadedImage`: Original uploaded image (Image object)
- `pngFile`: Processed PNG file (File object)
- `pngImage`: Processed PNG image (Image object)
- `processedImageData`: ImageData for editing
- `originalProcessedImageData`: Original ImageData (for reset)
- `selectedGridSize`: Current grid size (48, 75, or 96)
- `stlFile`: STL file (File object)
- `currentMesh`: Three.js mesh object
- `selectedPaintColor`: { r, g, b } object
- `brushSize`: Number (1-10)
- `standSelected`: Boolean
- `selectedAddons`: { mounting: Boolean }
- `cropCoordinates`: { x, y, size } or null

**Editor Settings:**
- `contrast`: Number (0-3, default 1.2)
- `brightness`: Number (0-3, default 1.0)
- `tones`: Number (2-4, default 4)
- `noiseReduction`: Number (0-5)
- `blackPoint`: Number (0-255)
- `whitePoint`: Number (0-255)

**Zoom/Pan State:**
- `processedZoom`: Number (default 1.0)
- `processedZoomOffsetX`: Number (default 0)
- `processedZoomOffsetY`: Number (default 0)
- `zoomMode`: String ('zoom-in', 'zoom-out', or null)

**Cropper State:**
- `cropX`: Number (crop box X position)
- `cropY`: Number (crop box Y position)
- `cropSize`: Number (crop box size)
- `cropperVisible`: Boolean
- `cropperManuallyHidden`: Boolean
- `cropInitialized`: Boolean
- `isDraggingCrop`: Boolean
- `isResizingCrop`: Boolean
- `isPanningCropper`: Boolean

**Paint State:**
- `isPainting`: Boolean
- `undoStack`: Array of ImageData
- `redoStack`: Array of ImageData
- `lastPaintState`: ImageData or null

---

## 12. CSS Dimensions - Exact Measurements

### 12.1 Main Container

**Width:** 100vw (full viewport width)
**Height:** 100vh (full viewport height)
**Max-width:** 100vw
**Overflow-x:** hidden

### 12.2 Viewer Panel (Left)

**Flex:** 1 (takes remaining space)
**Min-width:** 0
**Background:** #FFFBF5

**Editor Panel (when visible):**
- Padding: 20px 24px
- Flex: 1

**3D Canvas Container (when visible):**
- Flex: 1
- Min-height: 600px
- Border-right: 1px solid #e0e0e0

### 12.3 Control Panel (Right)

**Flex:** 0 0 450px
**Min-width:** 450px
**Padding:** 40px (top/bottom), 20px (left/right)
**Max-width:** 450px

**On Mobile (< 1024px):**
- Width: 100%
- Max-width: 100%
- Min-width: 0
- Flex: 1 1 auto
- Padding: 20px

### 12.4 Tool Buttons

**Container:**
- Width: 100%
- Height: ~60px (per button)

**Each Button:**
- Flex: 1 (equal width)
- Padding: 8px 4px
- Icon: 20px font size
- Text: 14px font size

### 12.5 Upload Box

**Initial Upload Box:**
- Width: 100%
- Padding: 40px 20px
- Min-height: 200px
- Border: 2px dashed #d0d0d0
- Border-radius: 8px

### 12.6 Canvas

**Processed Canvas:**
- Width: 100% of container
- Aspect-ratio: 1 / 1
- Max-width: 100%
- Border: 2px solid #ddd
- Border-radius: 10px
- Box-shadow: 0 4px 12px rgba(0,0,0,0.1)

**Internal Resolution:**
- Set dynamically: `containerWidth - 48px padding`

### 12.7 Buttons

**Grid Size Buttons:**
- Flex: 1 (equal width)
- Padding: 12px
- Border-radius: 6px

**Zoom Control Buttons:**
- Width: 40px
- Height: 40px
- Min/max: 40px
- Font-size: 18px

**View in 3D Button:**
- Padding: 12px 16px
- Font-size: 14px

### 12.8 Sliders

**Slider Track:**
- Width: 100%
- Height: 6px
- Background: #ddd
- Border-radius: 3px

**Slider Thumb:**
- Width: 20px
- Height: 20px
- Border-radius: 50%
- Background: black

### 12.9 Color Swatches

**Each Swatch:**
- Width: 50px
- Height: 50px
- Border-radius: 8px
- Border: 2px solid #ddd

**Labels (below):**
- Font-size: 10px
- Position: 20px below swatch

### 12.10 Price Section

**Price Card:**
- Flex: 1
- Padding: 16px
- Border-radius: 8px

**Add to Cart Button:**
- Width: 100%
- Padding: 16px
- Font-size: 16px
- Border-radius: 6px

**Toggle Switch:**
- Width: 44px
- Height: 24px
- Border-radius: 24px
- Circle: 18px diameter

### 12.11 Typography

**Title (panel):**
- Font-size: 24px
- Font-weight: normal
- Color: #E87D3E

**Section Labels:**
- Font-size: 13px
- Color: #FF6B35

**Body Text:**
- Font-size: 14px
- Color: #333333

**Small Text:**
- Font-size: 12px
- Color: #666666

**Font Family:**
- 'Courier New', Courier, 'Lucida Console', Monaco, monospace

### 12.12 Colors

**Background Colors:**
- Main: #FFFBF5
- Canvas area: #FFF8F0
- Upload area: #fafafa
- Info boxes: transparent
- Cards: #f0f0f0
- Toggle backgrounds: #f9f9f9

**Border Colors:**
- Default: #e0e0e0
- Buttons: #333333
- Canvas: #ddd
- Upload: #d0d0d0

**Text Colors:**
- Primary: #333333
- Secondary: #666666
- Orange: #E87D3E
- Red: #FF6B35

**Button Colors:**
- Default: #E0E0E0
- Active: #d0d0d0
- Primary action: #2d5016 (green)

---

## END OF MOBILE LAYOUT GUIDE

This document covers every aspect of the mobile layout. Every button, panel, interaction, and visual element has been described in detail. Use this as your complete reference for recreating the mobile version in React.



