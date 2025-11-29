# Layouts and Visual Design Documentation

This document provides complete visual specifications, layouts, and appearance details for both mobile and desktop versions, including the 3D viewer.

---

## Desktop Layout

### Full Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DESKTOP LAYOUT                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────┬─────────────────────────────────┐ │
│  │                                  │                                 │ │
│  │   VIEWER PANEL (Left)            │   CONTROL PANEL (Right)         │ │
│  │   Flex: 1 (50% width)            │   Fixed: 450px width            │ │
│  │                                  │                                 │ │
│  │   ┌──────────────────────────┐  │   Title: "3D Album Cover..."   │ │
│  │   │                          │  │   Subtitle: "Create..."         │ │
│  │   │                          │  │   ─────────────────────────     │ │
│  │   │   EDITOR PANEL           │  │                                  │ │
│  │   │   (Initially shown)      │  │   📤 Upload Section             │ │
│  │   │                          │  │   ─────────────────────────     │ │
│  │   │   - Panel Title          │  │                                  │ │
│  │   │   - Canvas Preview       │  │   📏 Grid Selection             │ │
│  │   │   - Image Display        │  │   [48×48] [75×75] [96×96]      │ │
│  │   │                          │  │   ─────────────────────────     │ │
│  │   └──────────────────────────┘  │                                  │ │
│  │                                  │   ⚙️ Adjustments               │ │
│  │   OR                             │   Contrast: ━━━━━━━━━━ 1.2     │ │
│  │                                  │   Brightness: ━━━━━━━━━ 1.0    │ │
│  │   ┌──────────────────────────┐  │   Tones: ━━━━━━━━━━━━━ 4       │ │
│  │   │                          │  │   ─────────────────────────     │ │
│  │   │   3D VIEWER              │  │                                  │ │
│  │   │   (When toggled)         │  │   🎨 Painting                   │ │
│  │   │                          │  │   [Black] [Gray] [Gray] [White]│ │
│  │   │   - Three.js Canvas      │  │   ─────────────────────────     │ │
│  │   │   - Interactive Model    │  │                                  │ │
│  │   │   - Orbit Controls       │  │   💰 Pricing                    │ │
│  │   │   - Viewer Controls      │  │   Total: $58.99                 │ │
│  │   │   [Reset] [Back]         │  │   ─────────────────────────     │ │
│  │   └──────────────────────────┘  │                                  │ │
│  │                                  │   ➕ Add-ons                    │ │
│  │                                  │   ☑ Stand $10.00               │ │
│  │                                  │   ☐ Mounting Dots $5.99        │ │
│  │                                  │   ─────────────────────────     │ │
│  │                                  │                                  │ │
│  │                                  │   [View in 3D] Button           │ │
│  │                                  │                                  │ │
│  │                                  │   [Proceed to Checkout]         │ │
│  │                                  │                                 │ │
│  └──────────────────────────────────┴─────────────────────────────────┘ │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Viewer Panel (Left Side)

**Dimensions:**
- Width: 50% of screen (flex: 1)
- Height: 100vh
- Background: `#FFFBF5` (warm white)
- Border: 1px solid `#e0e0e0` on right edge

**Content:**
1. **Editor Panel** (default state)
   - Padding: 20px 24px
   - Shows panel title: "Edit Your Photo"
   - Shows canvas with processed image
   - Canvas size: Square, max 600px
   - Canvas label: "Processed (Posterized)"

2. **3D Viewer** (when toggled)
   - Full panel size
   - Three.js canvas fills entire space
   - Controls overlay in top-left:
     - "Reset Camera" button
     - "Back to Editor" button
   - Background: `#FFF8F0` (slightly warmer)

**Visual Details:**
- Smooth transition between editor and 3D view
- No scrollbars in viewer panel
- Controls have semi-transparent background

---

### Control Panel (Right Side)

**Dimensions:**
- Width: 450px (fixed)
- Height: 100vh
- Background: `#FFFBF5` (warm white)
- Border: 1px solid `#e0e0e0` on left edge
- Padding: 40px
- Scrollable: Yes (overflow-y: auto)

**Content Sections (top to bottom):**

#### 1. Title Section
- **Title**: "3D Album Cover Mosaic Builder"
  - Font: 32px, Courier New
  - Color: `#E87D3E` (orange)
  - Weight: Normal
  - Margin-bottom: 10px

- **Subtitle**: "Create colorized 3D prints"
  - Font: 20px, Courier New
  - Color: `#333333` (dark gray)
  - Border-bottom: 1px solid `#e0e0e0`
  - Padding-bottom: 20px
  - Margin-bottom: 30px

#### 2. Upload Section
- **Section Label**: "1. Upload Color Image"
  - Font: 16px, Courier New
  - Color: `#FF6B35` (bright orange)
  - Margin-bottom: 12px

- **Upload Area**:
  - Border: 2px dashed `#ddd`
  - Border-radius: 12px
  - Padding: 30px
  - Background: `#fafafa`
  - Icon: 🖼️ (40px, 50% opacity)
  - Text: "Choose image file..." (14px)
  - Subtext: "Will be resized to 75×75 pixels" (12px)
  - Hover: Border color changes to `#999`

#### 3. Grid Selection Section
- **Section Label**: "2. Select Grid Size"
- **Grid Buttons**: Three buttons side-by-side
  - Inactive: Light gray background (`#E0E0E0`)
  - Active: Dark background (`#333333`) with white text
  - Border: 1px solid `#333333`
  - Padding: 12px
  - Border-radius: 6px
  - Hover: Darker gray on inactive buttons

#### 4. Image Adjustments Section
- **Section Label**: "Image Adjustments"
- **Three Sliders**:
  - Label on left, value on right
  - Slider track: Light gray (`#ddd`)
  - Slider thumb: Black circle (20px)
  - Real-time value display

#### 5. Painting Section
- **Section Label**: "Painting"
- **Color Palette**: Four color swatches in a row
  - Swatch size: 50px × 50px
  - Border-radius: 8px
  - Selected: 3px border with double ring effect
  - Color labels below swatches
  - Hover: Scale up 10%

#### 6. Pricing Section
- **Main Price Display**: Large number ($XX.XX)
  - Font: 24px
  - Font-weight: 600
  - Color: `#333333`

- **Price Details**:
  - Dimensions: "75 × 75"
  - Addons list
  - Grid size prices (48×48, 75×75, 96×96)

#### 7. Add-ons Section
- **Stand Toggle**:
  - Image preview (40px × 40px)
  - Product name
  - Price input
  - Toggle switch (44px × 24px)
  - Background: `#f9f9f9`

- **Mounting Dots Toggle**:
  - Same layout as Stand

#### 8. Action Buttons
- **View in 3D Button**: Primary style
  - Background: `#333333`
  - Color: White
  - Full width

- **Checkout Button**: Primary style
  - Background: `#2d5016` (dark green)
  - Color: White
  - Full width
  - Large padding (16px 24px)

---

## Mobile Layout

### Full Page Structure

```
┌─────────────────────────────┐
│      MOBILE LAYOUT          │
├─────────────────────────────┤
│                             │
│  ┌────────────────────────┐ │
│  │                        │ │
│  │   VIEWER/EDITOR PANEL  │ │
│  │   Full width           │ │
│  │   ~50% of screen       │ │
│  │                        │ │
│  │   - Panel Title        │ │
│  │   - Canvas/3D Viewer   │ │
│  │   - Viewer Controls    │ │
│  │                        │ │
│  └────────────────────────┘ │
│                             │
│  ┌────────────────────────┐ │
│  │                        │ │
│  │   CONTROL PANEL        │ │
│  │   Full width           │ │
│  │   Scrollable           │ │
│  │                        │ │
│  │   Title                │ │
│  │   ─────────────────    │ │
│  │                        │ │
│  │   📤 Upload            │ │
│  │   ─────────────────    │ │
│  │                        │ │
│  │   📏 Grid Selection    │ │
│  │   [48] [75] [96]      │ │
│  │   ─────────────────    │ │
│  │                        │ │
│  │   ⚙️ Adjustments       │ │
│  │   ─────────────────    │ │
│  │                        │ │
│  │   🎨 Painting          │ │
│  │   ─────────────────    │ │
│  │                        │ │
│  │   💰 Pricing           │ │
│  │   ─────────────────    │ │
│  │                        │ │
│  │   ➕ Add-ons           │ │
│  │   ─────────────────    │ │
│  │                        │ │
│  │   [View 3D]            │ │
│  │   [Checkout]           │ │
│  │                        │ │
│  └────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

### Mobile Viewer Panel (Top)

**Dimensions:**
- Width: 100% of screen
- Height: ~50% of viewport (flexible)
- Background: `#FFFBF5`
- Padding: 20px 24px (reduced)

**Content:**
- Panel title: Smaller font (20px)
- Canvas: Smaller max size (300-400px)
- Controls: Compact buttons

### Mobile Control Panel (Bottom)

**Dimensions:**
- Width: 100% of screen
- Height: ~50% of viewport (scrollable)
- Background: `#FFFBF5`
- Padding: 20px (reduced from 40px)

**Differences from Desktop:**
- Smaller font sizes (14px instead of 16px)
- More compact spacing
- Single column layout
- Touch-optimized button sizes
- Larger tap targets (minimum 44px)

---

## 3D Viewer Detailed Appearance

### Visual Layout

```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Reset] [Back to Editor]   │   │ ← Controls Overlay
│  └─────────────────────────────┘   │
│                                     │
│                                     │
│         ╱╲                          │
│        ╱  ╲                         │
│       ╱    ╲                        │
│      ╱      ╲                       │
│     ╱        ╲                      │
│    ╱          ╲                     │
│   ╱            ╲                    │
│  ╱  COLORED     ╲                   │
│ ╱   3D MODEL     ╲                  │ ← 3D Mesh
│╱___________________╲                │
││                    │               │
││                    │               │
│                                     │
└─────────────────────────────────────┘
```

### Viewer Controls Overlay

**Position:** Top-left corner
- Top: 20px
- Left: 20px
- Z-index: 10

**Buttons:**
1. **Reset Camera Button**
   - Background: `#E0E0E0`
   - Border: 1px solid `#333333`
   - Padding: 10px 15px
   - Border-radius: 6px
   - Text: "Reset"
   - Hover: Darker gray

2. **Back to Editor Button**
   - Same styling as Reset
   - Text: "Back to Editor"

### 3D Scene Appearance

**Background Color:** `#f5f5f5` (light gray)

**Lighting:**
- Ambient light: White, 60% intensity
- Directional light: White, 80% intensity
- Light position: (1, 1, 1)

**Camera:**
- Type: Perspective
- Field of view: 75 degrees
- Near: 0.1
- Far: 1000
- Initial position: Automatically centered on model

**Model Appearance:**
- Material: MeshStandardMaterial with vertex colors
- Flat shading: Enabled
- Colors: Applied per triangle from image

**Controls:**
- **Orbit**: Left-click drag to rotate
- **Zoom**: Scroll wheel or pinch
- **Pan**: Right-click drag
- **Damping**: Enabled for smooth movement

### Transitions

**Editor → 3D View:**
- Smooth fade transition
- Canvas slides out
- 3D viewer fades in
- Duration: ~300ms

**3D View → Editor:**
- Reverse of above
- Smooth transition back

---

## Component Visual Details

### Canvas/Image Preview

**Appearance:**
- Border: 2px solid `#ddd`
- Border-radius: 10px
- Box-shadow: 0 4px 12px rgba(0,0,0,0.1)
- Background: `#ffffff`
- Square aspect ratio maintained
- Centered in container

**Size:**
- Desktop: Max 600px × 600px
- Mobile: Max 400px × 400px
- Scales down to fit container

**Label:**
- Position: Above canvas
- Text: "Processed (Posterized)"
- Font: 17px, Courier New
- Color: `#E87D3E` (orange)
- Centered

### Upload Area

**Visual States:**

**Default:**
- Border: 2px dashed `#ddd`
- Background: `#fafafa`
- Icon: 40px, 50% opacity

**Hover:**
- Border: 2px dashed `#999`
- Background: `#f5f5f5`

**Active (clicking):**
- Border: 2px solid `#333333`
- Background: `#ffffff`

### Grid Buttons

**Inactive State:**
- Background: `#E0E0E0` (light gray)
- Border: 1px solid `#333333`
- Text: `#333333` (dark gray)
- Padding: 12px
- Border-radius: 6px

**Active State:**
- Background: `#333333` (dark)
- Border: 1px solid `#333333`
- Text: `#FFFFFF` (white)
- Same padding and border-radius

**Hover (inactive):**
- Background: `#d0d0d0` (darker gray)

### Sliders

**Track:**
- Height: 6px
- Background: `#ddd` (light gray)
- Border-radius: 3px
- Full width

**Thumb:**
- Size: 20px × 20px
- Background: `#000000` (black)
- Border-radius: 50%
- Smooth dragging

**Label:**
- Left: Control name ("Contrast")
- Right: Current value ("1.2")
- Font: 14px
- Color: `#333333`

### Color Palette

**Swatch Appearance:**
- Size: 50px × 50px
- Border-radius: 8px
- Border: 2px solid `#ddd` (default)
- Colors:
  - Black: `rgb(0, 0, 0)`
  - Dark Gray: `rgb(85, 85, 85)`
  - Light Gray: `rgb(170, 170, 170)`
  - White: `rgb(255, 255, 255)`

**Selected State:**
- Border: 3px solid `#333333`
- Box-shadow: 0 0 0 2px white, 0 0 0 4px `#333333` (double ring)

**Hover:**
- Transform: scale(1.1)
- Smooth transition

**Labels:**
- Position: Below swatch
- Font: 10px
- Color: `#333333`
- Centered

### Toggle Switches

**Unchecked:**
- Background: `#ccc` (gray)
- Slider: White circle on left

**Checked:**
- Background: `#2d5016` (dark green)
- Slider: White circle on right

**Animation:**
- Transition: 0.4s
- Smooth slider movement

### Price Display

**Main Price:**
- Font: 24px
- Font-weight: 600
- Color: `#333333`
- Prominent display

**Price Breakdown:**
- Font: 12px
- Color: `#666666`
- Two-column layout:
  - Left: Label
  - Right: Value

### Buttons

**Primary Button:**
- Background: `#2d5016` (dark green)
- Color: `#ffffff` (white)
- Padding: 16px 24px
- Border-radius: 8px
- Font: 16px
- Font-weight: 600
- Full width
- Hover: Darker green (`#1f3a0f`)

**Secondary Button:**
- Background: `#333333` (dark)
- Color: `#ffffff` (white)
- Same padding and styling

**Disabled State:**
- Background: `#ccc` (gray)
- Cursor: not-allowed
- No hover effect

---

## Color Palette Reference

### Primary Colors
- **Background**: `#FFFBF5` - Warm white
- **Primary Accent**: `#E87D3E` - Orange
- **Secondary Accent**: `#FF6B35` - Bright orange
- **Text**: `#333333` - Dark gray
- **Borders**: `#e0e0e0` - Light gray
- **Secondary Text**: `#666666` - Medium gray

### Interactive Colors
- **Button Background**: `#E0E0E0` - Light gray
- **Active Button**: `#333333` - Dark
- **Hover**: `#d0d0d0` - Darker gray
- **Checkout Button**: `#2d5016` - Dark green
- **Toggle Active**: `#2d5016` - Dark green

### Image Colors (4-Color Palette)
- **Black**: `rgb(0, 0, 0)` / `#000000`
- **Dark Gray**: `rgb(85, 85, 85)` / `#555555`
- **Light Gray**: `rgb(170, 170, 170)` / `#AAAAAA`
- **White**: `rgb(255, 255, 255)` / `#FFFFFF`

---

## Typography

### Font Family
- **Primary**: `'Courier New', Courier, 'Lucida Console', Monaco, monospace`
- **Fallback**: System monospace fonts

### Font Sizes

**Desktop:**
- Title: 32px
- Subtitle: 20px
- Section Labels: 16px
- Body Text: 14px
- Small Text: 12px
- Canvas Label: 17px
- Price: 24px

**Mobile:**
- Title: 24px (reduced)
- Subtitle: 18px (reduced)
- Section Labels: 14px (reduced)
- Body Text: 14px
- Small Text: 12px

### Font Weights
- Normal: 400 (default)
- Bold: 600 (prices, buttons)
- Light: 300 (not used)

---

## Spacing System

### Padding
- **Control Panel (Desktop)**: 40px
- **Control Panel (Mobile)**: 20px
- **Section Spacing**: 30px margin-bottom
- **Button Padding**: 12px 24px (standard), 16px 24px (large)

### Margins
- **Title Margin**: 10px bottom
- **Subtitle Margin**: 30px bottom
- **Section Margin**: 30px bottom
- **Element Margin**: 15px bottom (within sections)

### Gaps
- **Grid Buttons**: 10px
- **Color Swatches**: 10px
- **Viewer Controls**: 10px

---

## Responsive Breakpoints

### Desktop
- **Min Width**: 1025px
- **Layout**: Two columns side-by-side
- **Panel Width**: 50% / 450px fixed

### Tablet
- **Width**: 768px - 1024px
- **Layout**: Two columns (narrower)
- **Adjustments**: Slightly reduced padding

### Mobile
- **Max Width**: 767px
- **Layout**: Single column stacked
- **Adjustments**: All sizes reduced, touch-optimized

---

## Visual States

### Loading States
- **Spinner**: Centered, 40px
- **Placeholder**: Large icon (80px) with text
- **Background**: Same as container

### Error States
- **Message**: Red text
- **Background**: Light red tint
- **Position**: Top of control panel

### Success States
- **Message**: Green text
- **Background**: Light green tint
- **Position**: Top of control panel

### Disabled States
- **Opacity**: 0.5
- **Cursor**: not-allowed
- **No interactions**: All events disabled

---

## Animations & Transitions

### Button Hover
- Duration: 0.2s
- Property: background-color
- Easing: ease

### Color Swatch Hover
- Duration: 0.2s
- Property: transform
- Effect: scale(1.1)

### Toggle Switch
- Duration: 0.4s
- Property: transform (slider), background-color
- Effect: Smooth slide

### View Transitions
- Duration: 0.3s
- Property: opacity, transform
- Effect: Fade and slide

### Loading Animations
- Duration: 1s
- Property: transform (rotation)
- Effect: Continuous spin

---

## Touch Interactions (Mobile)

### Button Sizes
- **Minimum**: 44px × 44px (tap target)
- **Standard**: 48px height
- **Large**: 56px height (checkout button)

### Gestures
- **Tap**: Single finger tap
- **Scroll**: Single finger drag (vertical)
- **Pinch Zoom**: Two finger pinch (3D viewer)

### Feedback
- **Active State**: Visual feedback on touch
- **Haptic**: Can be added for better UX

---

## 3D Viewer Controls

### Mouse Controls (Desktop)
- **Left Click + Drag**: Rotate model
- **Right Click + Drag**: Pan view
- **Scroll Wheel**: Zoom in/out
- **Double Click**: Focus on clicked point

### Touch Controls (Mobile)
- **Single Finger Drag**: Rotate model
- **Two Finger Pinch**: Zoom
- **Two Finger Drag**: Pan view

### Control Buttons
- **Reset Camera**: Returns to initial position
- **Back to Editor**: Switches to editor view

---

## Visual Hierarchy

### Importance Levels

1. **Primary Actions**
   - Checkout button (most prominent)
   - View in 3D button

2. **Secondary Actions**
   - Grid selection buttons
   - Upload area
   - Tool buttons

3. **Tertiary Actions**
   - Adjustment sliders
   - Add-on toggles
   - Color swatches

4. **Information**
   - Title
   - Price display
   - Section labels

---

## Empty States

### No Image Uploaded
- **Icon**: 📷 (80px, 30% opacity)
- **Text**: "Upload an image to begin"
- **Center**: Vertically and horizontally

### No 3D Model Loaded
- **Icon**: 🎨 (80px, 30% opacity)
- **Text**: "Load 3D model to view"
- **Center**: Vertically and horizontally

---

This completes the visual design and layout documentation for both mobile and desktop versions, including detailed 3D viewer specifications!

