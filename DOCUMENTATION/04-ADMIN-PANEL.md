# Admin Panel Documentation

## Overview

The admin panel provides a comprehensive interface for managing all aspects of the application:
- **Content Management**: Edit all text content displayed on the site
- **Price Management**: Set prices for grid sizes and add-ons
- **Image Management**: Upload product images
- **Order Management**: View, complete, and delete orders
- **STL Management**: Upload STL files for each grid size

## Access

**URL**: `/admin` or `/admin.html`

**Note**: Currently no authentication. Should add login/authentication in production.

---

## Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│ Admin Panel Header                                       │
│ - Title                                                  │
│ - Tabs: [Edit] [Orders]                                  │
├───────────────────────────┬─────────────────────────────┤
│ Left Panel (Preview)      │ Right Panel (Controls)       │
│ - Preview of UI elements  │ - Title Editor               │
│                           │ - Upload Text Editor         │
│                           │ - Grid Button Editors        │
│                           │ - Price Inputs               │
│                           │ - Add-on Configuration       │
│                           │ - STL Upload                 │
│                           │ - Info Box Editors           │
│                           │ - Save All Button            │
└───────────────────────────┴─────────────────────────────┘
```

---

## Tab 1: Edit

### Section: Title & Subtitle

**Fields:**
- `admin-title` - Main page title
  - Default: "3D Album Cover Mosaic Builder"
  - Input type: Text
  - Updates: `content.json.title`

- `admin-price-subtitle` - Subtitle under title
  - Default: "Create colorized 3D prints"
  - Input type: Text
  - Updates: `content.json.price_subtitle`

---

### Section: Upload Area

**Fields:**
- `admin-upload-text` - Upload button text
  - Default: "Choose image file..."
  - Input type: Text
  - Updates: `content.json.upload_image_text`

- `admin-upload-subtext` - Upload description
  - Default: "Will be resized to 75×75 pixels"
  - Input type: Text
  - Updates: `content.json.upload_subtext`

---

### Section: Grid Size Buttons

**Fields:**
- `admin-grid-btn-48` - 48×48 button text
  - Default: "48 × 48"
  - Input type: ContentEditable button
  - Updates: `content.json.grid_btn_48`

- `admin-grid-btn-75` - 75×75 button text
  - Default: "75 × 75"
  - Input type: ContentEditable button
  - Updates: `content.json.grid_btn_75`

- `admin-grid-btn-96` - 96×96 button text
  - Default: "96 × 96"
  - Input type: ContentEditable button
  - Updates: `content.json.grid_btn_96`

**Note**: These are contenteditable buttons - click to edit text directly.

---

### Section: Image Adjustments

**Fields:**
- `admin-slider-contrast-label` - Contrast slider label
  - Default: "Contrast"
  - Input type: ContentEditable span
  - Updates: `content.json.slider_contrast_label`

- `admin-slider-brightness-label` - Brightness slider label
  - Default: "Brightness"
  - Input type: ContentEditable span
  - Updates: `content.json.slider_brightness_label`

- `admin-slider-tones-label` - Tones slider label
  - Default: "Tones"
  - Input type: ContentEditable span
  - Updates: `content.json.slider_tones_label`

---

### Section: Painting

**Color Labels (ContentEditable):**
- `admin-color-black-title` - Black color label
  - Default: "Black"
  - Updates: `content.json.color_black_title`

- `admin-color-darkgray-title` - Dark gray label
  - Default: "Dark Gray"
  - Updates: `content.json.color_darkgray_title`

- `admin-color-lightgray-title` - Light gray label
  - Default: "Light Gray"
  - Updates: `content.json.color_lightgray_title`

- `admin-color-white-title` - White label
  - Default: "White"
  - Updates: `content.json.color_white_title`

---

### Section: Pricing

**Grid Size Prices:**
- `admin-price-48x48` - 48×48 price
  - Input type: Number (step: 0.01)
  - Default: 29.99
  - Updates: `prices.json["48x48"]`

- `admin-price-75x75` - 75×75 price (also syncs with main price)
  - Input type: Number (step: 0.01)
  - Default: 48.99
  - Updates: `prices.json["75x75"]`

- `admin-price-96x96` - 96×96 price
  - Input type: Number (step: 0.01)
  - Default: 59.99
  - Updates: `prices.json["96x96"]`

**Main Price Display:**
- `admin-main-price` - Main price (syncs with 75×75)
  - Input type: Number (step: 0.01)
  - Read-only display, updates 75×75 on change

**Labels (ContentEditable):**
- `admin-label-dimensions` - "Dimensions:" label
- `admin-label-addons` - "Addons:" label
- `admin-label-48x48` - "48×48:" label
- `admin-label-75x75` - "75×75:" label
- `admin-label-96x96` - "96×96:" label

---

### Section: Stand Add-on

**Configuration:**
- `admin-stand-name` - Product name
  - Default: "Stand"
  - Input type: ContentEditable
  - Updates: `content.json.stand_name`

- `admin-stand-image` - Product image preview
  - Display only (shows uploaded image)
  - Updates: `images.json.stand`

- `admin-stand-upload-btn` - Upload button text
  - Default: "Upload Image"
  - Input type: ContentEditable button
  - Updates: `content.json.stand_upload_btn`

- `admin-stand-image-upload` - File input (hidden)
  - Accepts: image/*
  - Uploads to: `/admin/images/api`

- `admin-stand-price` - Price
  - Input type: Number (step: 0.01)
  - Default: 10.00
  - Updates: `prices.json.stand`

- `admin-stand-toggle` - Enable/disable toggle
  - Currently no effect (always visible)

---

### Section: Wall Mounting Dots Add-on

Same structure as Stand section:
- `admin-mounting-name` - Product name
- `admin-mounting-image` - Image preview
- `admin-mounting-upload-btn` - Upload button text
- `admin-mounting-image-upload` - File input
- `admin-mounting-price` - Price
- `admin-mounting-toggle` - Enable/disable toggle

---

### Section: STL File Upload

**Files:**
- `admin-stl-upload-48` - Upload 48×48 STL
  - Status shown in: `admin-stl-status-48x48`
  - Uploads to: `/admin/stl/api`

- `admin-stl-upload-75` - Upload 75×75 STL
  - Status shown in: `admin-stl-status-75x75`

- `admin-stl-upload-96` - Upload 96×96 STL
  - Status shown in: `admin-stl-status-96x96`

**Status Display:**
- "No file" - Not uploaded
- "Uploading..." - Upload in progress
- "Uploaded ✓" - Successfully uploaded
- "File exists ✓" - File found on server

---

### Section: Info Box

**Fields:**
- `admin-info-title` - Info box title
  - Default: "Custom Brick Mosaic Designer"
  - Input type: Text
  - Updates: `content.json.info_title`

- `admin-info-description` - Main description
  - Default: "Turn your favourite photos into stunning brick art—made by you!"
  - Input type: Textarea
  - Updates: `content.json.info_description`

- `admin-info-additional` - Additional text
  - Default: "Bring your memories to life..."
  - Input type: Textarea
  - Updates: `content.json.info_additional`

---

### Section: How-to Instructions

**Fields:**
- `admin-howto-title` - How-to section title
  - Default: "How to Use"
  - Input type: Text
  - Updates: `content.json.howto_title`

- `admin-howto-content` - How-to content (multiline)
  - Default: Step-by-step instructions
  - Input type: Textarea
  - Updates: `content.json.howto_content`

**Format**: Plain text with line breaks (newlines preserved)

---

### Section: Desktop Preview Labels

These are editable elements shown in the left preview panel:

- `admin-panel-title-preview` - Panel title
  - Default: "Edit Your Photo"
  - Input type: ContentEditable
  - Updates: `content.json.panel_title`

- `admin-canvas-label-preview` - Canvas label
  - Default: "Processed (Posterized)"
  - Input type: ContentEditable
  - Updates: `content.json.canvas_label`

---

## Tab 2: Orders

### Order List Display

Each order shows:
- **Order ID**: First 8 characters + completion status
- **Date**: Formatted timestamp
- **Price**: Total price (green, large font)
- **Dimensions**: Grid size
- **Base Price**: Price before add-ons
- **Add-ons**: List of selected add-ons as badges
- **Files**: Download buttons for OBJ, MTL, PNG, STL
- **Delete Button**: Individual order deletion

### Bulk Actions

**Controls:**
- Select All checkbox - Select/deselect all orders
- Mark Selected as Completed - Batch mark orders
- Mark Selected as Not Completed - Batch unmark orders
- Delete Selected - Bulk delete (with count)

**Workflow:**
1. Check orders to select
2. Use bulk action buttons
3. Confirm action
4. Orders update/delete

---

## Save All Button

Located at bottom-right (fixed position).

**Functionality:**
1. Disables button ("Saving...")
2. Saves prices to `/admin/prices/api`
3. Saves content to `/admin/content/api`
4. Verifies images are saved
5. Shows success/error message
6. Re-enables button

**Status Messages:**
- Success: "All changes saved successfully!"
- Error: Shows error message
- Warning: Mentions if images not uploaded

---

## API Integration

### Loading Data on Page Load

```javascript
window.addEventListener('load', async () => {
    await loadPrices();        // Load from /admin/prices/api
    await loadImages();        // Load from /admin/images/api
    await loadTextContent();   // Load from /admin/content/api
    await checkSTLStatus();    // Check STL files from /admin/stl/api
    setupColorEditor();        // Setup color swatch interactions
});
```

### Saving Data

All saves go through "Save All" button which:
1. Collects all form values
2. Prepares JSON payloads
3. Sends POST requests to admin APIs
4. Handles errors and success messages

---

## Image Upload Process

### Uploading Product Images

1. Click "Upload Image" button
2. Select image file
3. File uploaded to `/admin/images/api`
4. Response contains image URL
5. Image preview updated immediately
6. Images saved to `images.json`
7. Files saved to `product_images/` directory

### File Naming
- Format: `{key}_{uuid8}.{extension}`
- Example: `stand_abc12345.png`
- UUID ensures unique filenames

---

## STL Upload Process

1. Click "Upload STL" button for desired size
2. Select STL file
3. File uploaded to `/admin/stl/api`
4. Saved as `{size}x{size}_grid.stl`
5. Status updated to "Uploaded ✓"
6. File available at `/get-stl/{size}`

---

## ContentEditable Elements

Many elements use `contenteditable="true"` for inline editing:
- Section labels
- Button text
- Color labels
- Preview labels

**Behavior:**
- Click to edit
- Visual hover/focus states
- Saves with "Save All" button

---

## Error Handling

### Backend Connection Errors

If backend URL not configured:
- Shows error message on page load
- Console error logged
- API calls fail gracefully

### Image Upload Errors

- Shows error status message
- File input remains accessible for retry
- Previous image (if any) remains

### Save Errors

- Shows error message with details
- Button re-enabled for retry
- Partial saves may occur (prices saved but content failed)

---

## Security Considerations

### Current State
- **No Authentication**: Admin panel is publicly accessible
- **No Rate Limiting**: Unlimited API calls
- **No Input Validation**: Malicious input possible

### Recommendations for Production
1. Add authentication (login system)
2. Add rate limiting
3. Validate all inputs
4. Sanitize file uploads
5. Add CSRF protection
6. Use HTTPS only
7. Add audit logging

---

## Data Storage

### JSON Files

**prices.json:**
```json
{
  "48x48": 29.99,
  "75x75": 48.99,
  "96x96": 59.99,
  "stand": 10.00,
  "wall_mounting_dots": 5.99
}
```

**content.json:**
```json
{
  "title": "...",
  "upload_image_text": "...",
  // ... all content fields
}
```

**images.json:**
```json
{
  "stand": "/product_images/stand_abc123.png",
  "wall_mounting_dots": "/product_images/wall_mounting_dots_def456.png"
}
```

**orders.json:**
```json
[
  {
    "order_id": "...",
    "timestamp": "...",
    // ... order data
  }
]
```

---

## Backend URL Configuration

Located at top of admin.html JavaScript:

```javascript
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://your-backend-url.com';
```

**Important**: Update production backend URL before deployment.

---

## Status Messages

Displayed at top of page (fixed position):

**Success:**
- Green background
- Shows: "All changes saved successfully!"
- Auto-hides after 5 seconds

**Error:**
- Red background
- Shows error message
- Auto-hides after 5 seconds

