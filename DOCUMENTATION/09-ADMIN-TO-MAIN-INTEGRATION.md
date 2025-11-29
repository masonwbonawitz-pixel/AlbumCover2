# Admin Panel to Main App Integration

This document explains exactly how the admin panel connects to and updates the main application, ensuring the React version maintains this exact same integration.

---

## Integration Flow

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐         ┌─────────────┐
│   ADMIN     │ ──────> │    BACKEND   │ ──────> │  JSON FILES  │ ──────> │  MAIN APP   │
│   PANEL     │  POST   │     API      │  WRITE  │              │  READ   │             │
│             │         │              │         │              │         │             │
│ - Edit      │         │ - /admin/    │         │ - prices.json│         │ - Fetches   │
│   Content   │         │   prices/api │         │ - content.   │         │   from      │
│ - Edit      │         │ - /admin/    │         │   json       │         │   /api/     │
│   Prices    │         │   content/   │         │ - images.    │         │   endpoints │
│ - Upload    │         │   api        │         │   json       │         │             │
│   Images    │         │ - /admin/    │         │              │         │ - Displays  │
│             │         │   images/api │         │              │         │   updated   │
└─────────────┘         └──────────────┘         └──────────────┘         └─────────────┘
```

---

## Data Flow

### Step 1: Admin Makes Changes

Admin edits content, prices, or uploads images in the admin panel.

### Step 2: Admin Saves

Admin clicks "Save All" button, which:
1. Collects all form values
2. Prepares JSON payloads
3. Sends POST requests to admin API endpoints

### Step 3: Backend Updates JSON Files

Backend receives POST requests and:
1. Validates data
2. Writes to JSON files (`prices.json`, `content.json`, `images.json`)
3. Returns success response

### Step 4: Main App Loads Data

Main app (mobile/desktop) loads on page load:
1. Fetches from public API endpoints (`/api/prices`, `/api/content`, `/api/images`)
2. Reads JSON files via backend
3. Displays content immediately

### Step 5: Changes Appear Instantly

Because JSON files are shared, changes appear immediately (no cache).

---

## JSON File Structure

### prices.json

```json
{
  "48x48": 29.99,
  "75x75": 48.99,
  "96x96": 59.99,
  "stand": 10.00,
  "wall_mounting_dots": 5.99
}
```

**Updated by:** Admin panel → `/admin/prices/api` (POST)  
**Read by:** Main app → `/api/prices` (GET)

---

### content.json

```json
{
  "title": "3D Album Cover Mosaic Builder",
  "price_subtitle": "Create colorized 3D prints",
  "upload_image_text": "Choose image file...",
  "upload_subtext": "Will be resized to 75×75 pixels",
  "section_upload": "1. Upload Color Image",
  "section_grid": "2. Select Grid Size",
  "section_adjustments": "Image Adjustments",
  "section_painting": "Painting",
  "grid_btn_48": "48 × 48",
  "grid_btn_75": "75 × 75",
  "grid_btn_96": "96 × 96",
  "slider_contrast_label": "Contrast",
  "slider_brightness_label": "Brightness",
  "slider_tones_label": "Tones",
  "label_dimensions": "Dimensions:",
  "label_addons": "Addons:",
  "stand_name": "Stand",
  "mounting_name": "Nano Wall Mounting Dots (Pack of 8)",
  "color_black_title": "Black",
  "color_darkgray_title": "Dark Gray",
  "color_lightgray_title": "Light Gray",
  "color_white_title": "White",
  "info_title": "Custom Brick Mosaic Designer",
  "info_description": "Turn your favourite photos into stunning brick art—made by you!",
  "howto_title": "How to Use",
  "howto_content": "1. Upload Your Image\n2. Select Grid Size\n...",
  "panel_title": "Edit Your Photo",
  "canvas_label": "Processed (Posterized)"
}
```

**Updated by:** Admin panel → `/admin/content/api` (POST)  
**Read by:** Main app → `/api/content` (GET)

---

### images.json

```json
{
  "stand": "/product_images/stand_abc12345.png",
  "wall_mounting_dots": "/product_images/wall_mounting_dots_def67890.png"
}
```

**Updated by:** Admin panel → `/admin/images/api` (POST)  
**Read by:** Main app → `/api/images` (GET)

---

## API Endpoint Mapping

### Admin Endpoints (Write)

| Endpoint | Method | Purpose | Updates File |
|----------|--------|---------|--------------|
| `/admin/prices/api` | POST | Update prices | `prices.json` |
| `/admin/content/api` | POST | Update content | `content.json` |
| `/admin/images/api` | POST | Upload images | `images.json` |
| `/admin/stl/api` | POST | Upload STL files | File system |

### Public Endpoints (Read)

| Endpoint | Method | Purpose | Reads File |
|----------|--------|---------|------------|
| `/api/prices` | GET | Get prices | `prices.json` |
| `/api/content` | GET | Get content | `content.json` |
| `/api/images` | GET | Get images | `images.json` |

**Important:** Both admin and public endpoints read/write the **same JSON files**, ensuring immediate synchronization.

---

## Code Examples

### Admin Panel: Saving Prices

```javascript
// Admin panel saves prices
async function savePrices() {
    const updatedPrices = {
        '48x48': parseFloat(document.getElementById('admin-price-48x48').value) || 0,
        '75x75': parseFloat(document.getElementById('admin-price-75x75').value) || 0,
        '96x96': parseFloat(document.getElementById('admin-price-96x96').value) || 0,
        'stand': parseFloat(document.getElementById('admin-stand-price').value) || 0,
        'wall_mounting_dots': parseFloat(document.getElementById('admin-mounting-price').value) || 0
    };

    const response = await fetch('/admin/prices/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPrices)
    });

    const result = await response.json();
    // prices.json is now updated
}
```

### Backend: Handling Price Update

```python
# Backend receives price update
@app.route('/admin/prices/api', methods=['POST'])
def admin_prices_api():
    if request.method == 'POST':
        new_prices = request.get_json()
        with open('prices.json', 'w') as f:
            json.dump(new_prices, f, indent=2)
        return jsonify({'success': True, 'prices': new_prices})
```

### Main App: Loading Prices

```javascript
// Main app loads prices on page load
async function loadPrices() {
    const response = await fetch('/api/prices');
    const prices = await response.json();
    
    // Use prices immediately
    updatePriceDisplay(prices);
    calculateTotalPrice(prices);
}
```

---

## Real-Time Updates

### Cache Prevention

Both admin and public endpoints use no-cache headers:

```python
response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
response.headers['Pragma'] = 'no-cache'
response.headers['Expires'] = '0'
```

This ensures changes appear immediately without browser caching.

---

## Content Field Mapping

Every field in the admin panel maps to a field in `content.json`, which maps to an element in the main app:

| Admin Field ID | content.json Key | Main App Element |
|----------------|------------------|------------------|
| `admin-title` | `title` | Page title |
| `admin-price-subtitle` | `price_subtitle` | Subtitle |
| `admin-upload-text` | `upload_image_text` | Upload button text |
| `admin-section-upload` | `section_upload` | Upload section label |
| `admin-grid-btn-48` | `grid_btn_48` | 48×48 button text |
| `admin-stand-name` | `stand_name` | Stand product name |
| `admin-info-title` | `info_title` | Info box title |
| ... | ... | ... |

**Complete mapping:** See `04-ADMIN-PANEL.md` for all field mappings.

---

## Image Upload Flow

### Admin Uploads Image

```javascript
// Admin uploads stand image
async function uploadImage(key, file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', key); // 'stand' or 'wall_mounting_dots'
    
    const response = await fetch('/admin/images/api', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    // Image saved to product_images/ directory
    // images.json updated with URL
}
```

### Backend Saves Image

```python
# Backend saves image
@app.route('/admin/images/api', methods=['POST'])
def admin_images_api():
    file = request.files['image']
    key = request.form.get('key')
    
    # Generate filename
    filename = f"{key}_{uuid.uuid4().hex[:8]}.{file.filename.rsplit('.', 1)[1].lower()}"
    filepath = os.path.join('product_images', filename)
    file.save(filepath)
    
    # Update images.json
    images[key] = f'/product_images/{filename}'
    with open('images.json', 'w') as f:
        json.dump(images, f, indent=2)
    
    return jsonify({'success': True, 'imageUrl': images[key]})
```

### Main App Displays Image

```javascript
// Main app loads and displays image
async function loadImages() {
    const response = await fetch('/api/images');
    const images = await response.json();
    
    // Display stand image
    if (images.stand) {
        document.getElementById('stand-image').src = images.stand;
    }
    
    // Display mounting dots image
    if (images.wall_mounting_dots) {
        document.getElementById('mounting-image').src = images.wall_mounting_dots;
    }
}
```

---

## Backend URL Configuration

### Admin Panel Backend URL

The admin panel needs to know the backend URL:

```javascript
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://your-backend-url.com';
```

**Important:** Update this in production!

### Main App Backend URL

Main app uses relative URLs (same domain) or can use environment variables:

```javascript
const API_BASE_URL = process.env.API_URL || '';
```

---

## Page Load Sequence

### Main App (Mobile/Desktop)

```javascript
window.addEventListener('load', async () => {
    // 1. Load content
    const content = await fetch('/api/content').then(r => r.json());
    
    // 2. Load prices
    const prices = await fetch('/api/prices').then(r => r.json());
    
    // 3. Load images
    const images = await fetch('/api/images').then(r => r.json());
    
    // 4. Populate UI with loaded data
    populateContent(content);
    populatePrices(prices);
    populateImages(images);
});
```

### Admin Panel

```javascript
window.addEventListener('load', async () => {
    // 1. Load existing data
    await loadPrices();
    await loadImages();
    await loadTextContent();
    
    // 2. Populate admin forms
    populateAdminForms();
});
```

---

## React Implementation

### Admin Context Provider

```jsx
// AdminContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [content, setContent] = useState({});
  const [images, setImages] = useState({});

  const loadData = async () => {
    const [pricesData, contentData, imagesData] = await Promise.all([
      apiService.getAdminPrices(),
      apiService.getAdminContent(),
      apiService.getAdminImages()
    ]);
    setPrices(pricesData);
    setContent(contentData);
    setImages(imagesData);
  };

  const saveData = async (type, data) => {
    await apiService.saveAdminData(type, data);
    await loadData(); // Reload to ensure sync
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminContext.Provider value={{ prices, content, images, saveData, loadData }}>
      {children}
    </AdminContext.Provider>
  );
};
```

### Main App Context Provider

```jsx
// MainAppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const MainAppContext = createContext();

export const MainAppProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [content, setContent] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    // Load data on mount
    const loadData = async () => {
      const [pricesData, contentData, imagesData] = await Promise.all([
        apiService.getPrices(),
        apiService.getContent(),
        apiService.getImages()
      ]);
      setPrices(pricesData);
      setContent(contentData);
      setImages(imagesData);
    };
    
    loadData();
    
    // Optionally reload periodically to get admin updates
    const interval = setInterval(loadData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <MainAppContext.Provider value={{ prices, content, images }}>
      {children}
    </MainAppContext.Provider>
  );
};
```

### Shared API Service

```jsx
// api.js
const API_BASE = process.env.REACT_APP_API_URL || '';

export const apiService = {
  // Public endpoints (main app)
  getPrices: () => fetch(`${API_BASE}/api/prices`).then(r => r.json()),
  getContent: () => fetch(`${API_BASE}/api/content`).then(r => r.json()),
  getImages: () => fetch(`${API_BASE}/api/images`).then(r => r.json()),

  // Admin endpoints
  getAdminPrices: () => fetch(`${API_BASE}/admin/prices/api`).then(r => r.json()),
  getAdminContent: () => fetch(`${API_BASE}/admin/content/api`).then(r => r.json()),
  getAdminImages: () => fetch(`${API_BASE}/admin/images/api`).then(r => r.json()),

  // Admin save endpoints
  saveAdminPrices: (prices) => fetch(`${API_BASE}/admin/prices/api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prices)
  }).then(r => r.json()),

  saveAdminContent: (content) => fetch(`${API_BASE}/admin/content/api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
  }).then(r => r.json()),

  uploadAdminImage: (key, file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', key);
    return fetch(`${API_BASE}/admin/images/api`, {
      method: 'POST',
      body: formData
    }).then(r => r.json());
  }
};
```

---

## Synchronization Strategy

### Immediate Updates

Changes in admin panel → Save to JSON → Main app sees immediately because:
1. No caching (cache headers set)
2. Same JSON files shared
3. API endpoints read directly from files

### Optional: WebSocket Updates

For real-time updates without polling:

```javascript
// Admin saves → emit event
websocket.emit('content-updated', { type: 'prices', data: prices });

// Main app listens
websocket.on('content-updated', ({ type, data }) => {
  if (type === 'prices') setPrices(data);
  if (type === 'content') setContent(data);
  if (type === 'images') setImages(data);
});
```

### Optional: Polling

Main app can poll for updates:

```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const [prices, content, images] = await Promise.all([
      apiService.getPrices(),
      apiService.getContent(),
      apiService.getImages()
    ]);
    // Only update if changed
    if (JSON.stringify(prices) !== JSON.stringify(currentPrices)) {
      setPrices(prices);
    }
    // ... same for content and images
  }, 5000); // Poll every 5 seconds
  
  return () => clearInterval(interval);
}, []);
```

---

## Testing Integration

### Test Flow

1. **Open Admin Panel**
   - Navigate to `/admin`
   - Verify data loads

2. **Make Changes**
   - Edit title in admin
   - Change price
   - Upload new image

3. **Save Changes**
   - Click "Save All"
   - Verify success message

4. **Check Main App**
   - Open main app in new tab
   - Verify changes appear immediately
   - Refresh if needed (cache)

5. **Verify JSON Files**
   - Check `prices.json` updated
   - Check `content.json` updated
   - Check `images.json` updated
   - Check image file exists in `product_images/`

---

## File Permissions

Ensure JSON files are writable:

```bash
chmod 644 prices.json content.json images.json
```

Ensure `product_images/` directory is writable:

```bash
chmod 755 product_images/
```

---

## Error Handling

### Admin Save Errors

```javascript
try {
  await savePrices();
  showSuccess('Prices saved!');
} catch (error) {
  showError('Failed to save prices: ' + error.message);
}
```

### Main App Load Errors

```javascript
try {
  const prices = await apiService.getPrices();
  setPrices(prices);
} catch (error) {
  console.error('Failed to load prices:', error);
  // Use default/fallback prices
  setPrices(DEFAULT_PRICES);
}
```

---

## Summary

**Key Points:**
1. Admin panel writes to JSON files via POST endpoints
2. Main app reads from same JSON files via GET endpoints
3. Both use same backend server
4. No caching ensures immediate updates
5. All content is editable from admin panel
6. Changes appear instantly in main app

**React Implementation:**
- Use Context Providers for data management
- Load data on component mount
- Optionally poll for updates
- Share API service between admin and main app
- Maintain exact same JSON structure

This integration ensures the React version will work exactly the same way!

