# Quick Reference - Find Code Fast

This guide helps you quickly find specific code sections in the source files.

---

## 🔍 Mobile Version (`mobile-index-COMPLETE.md`)

### Key Functions

| What to Find | Search For |
|--------------|------------|
| Image upload handler | `handleImageUpload` or `png-input` event listener |
| Image processing | `function processImage()` |
| Grid size selection | `function selectGridSize(` |
| Show/hide panels | `function togglePanel(` |
| Show cropper | `function showCropper()` |
| Hide cropper | `function hideCropper()` |
| Show 3D view | `async function show3DView()` |
| Show editor panel | `function showEditorPanel()` |
| Paint pixel | `function paintPixelAt(` |
| Undo/redo | `function undoPaint()` or `function redoPaint()` |
| Zoom controls | `function zoomInProcessed()` or `zoomOutProcessed()` |
| Load STL | `async function loadSTLFromServer(` |
| Apply colors to mesh | `function applyColorsToMesh()` |
| Add to cart | `addEventListener('click', async () => {` near "add-to-cart-btn" |

### Key CSS Classes

| What to Find | Search For |
|--------------|------------|
| Tool buttons container | `.top-action-buttons` |
| Tool button | `.top-action-btn` |
| Collapsible panels | `.collapsible-section` |
| Upload area | `.upload-area` |
| Grid size buttons | `.grid-btn` |
| Color swatches | `.color-swatch` |
| Canvas wrapper | `.canvas-wrapper` |
| Editor panel | `#editor-panel` |
| 3D canvas container | `#canvas-container` |

### Key Element IDs

| What to Find | Search For |
|--------------|------------|
| Editor panel | `id="editor-panel"` |
| Canvas container | `id="canvas-container"` |
| Processed canvas | `id="processed-canvas"` |
| Tool buttons | `id="action-buttons-container"` |
| Upload button | `id="upload-btn"` |
| Size button | `id="size-btn"` |
| Adjust button | `id="adjust-btn"` |
| Paint button | `id="paint-btn"` |
| Size panel | `id="size-panel"` |
| Adjust panel | `id="adjust-panel"` |
| Paint panel | `id="paint-panel"` |
| Crop canvas | `id="crop-canvas"` |
| Price display | `id="price-display-section"` |
| Add to cart button | `id="add-to-cart-btn"` |

### Key Variables

| What to Find | Search For |
|--------------|------------|
| Selected grid size | `let selectedGridSize` |
| Uploaded image | `let rawUploadedImage` |
| Processed image data | `let processedImageData` |
| STL file | `let stlFile` |
| Current mesh | `let currentMesh` |
| Selected paint color | `let selectedPaintColor` |
| Brush size | `let brushSize` |
| Editor settings | `let editorSettings` |
| Crop coordinates | `let cropCoordinates` |
| Stand selected | `let standSelected` |
| Prices | `let prices` |

---

## 🖥️ Desktop Version (`desktop-COMPLETE.md`)

### Key Functions

| What to Find | Search For |
|--------------|------------|
| Image processing | `function processImage()` |
| Grid size selection | `function selectGridSize(` |
| Show 3D view | `function show3DView()` |
| Show editor panel | `function showEditorPanel()` |
| Paint pixel | `function paintPixelAt(` |
| Undo/redo | `function undoPaint()` or `function redoPaint()` |
| Zoom controls | `function zoomInProcessed()` or `zoomOutProcessed()` |
| Pan toggle | `function togglePanProcessed()` |
| Wireframe toggle | `function toggleWireframe()` |
| Load STL | `async function loadSTL(` |
| Apply colors to mesh | `function applyColorsToMesh()` |

### Key CSS Classes

| What to Find | Search For |
|--------------|------------|
| Viewer panel | `.viewer-panel` |
| Control panel | `.control-panel` |
| Editor grid | `.editor-grid` |
| Canvas wrapper | `.canvas-wrapper` |
| Upload area | `.upload-area` |
| Grid buttons | `.grid-btn` |

### Key Element IDs

| What to Find | Search For |
|--------------|------------|
| Editor panel | `id="editor-panel"` |
| Canvas container | `id="canvas-container"` |
| Processed canvas | `id="processed-canvas"` |
| Processed controls | `id="processed-controls"` |
| Upload area | `id="png-upload-area"` |
| Grid size buttons | `data-size="48"`, `data-size="75"`, `data-size="96"` |

### Differences from Mobile

- **No tool buttons** - All sections always visible
- **Side-by-side layout** - Editor left, controls right
- **No collapsible panels** - Everything visible at once
- **Wireframe toggle** - Extra button in 3D viewer

---

## 🛠️ Admin Panel (`admin-COMPLETE.md`)

### Key Functions

| What to Find | Search For |
|--------------|------------|
| Save all | `async function saveAll()` |
| Load prices | `async function loadPrices()` |
| Load images | `async function loadImages()` |
| Load content | `async function loadTextContent()` |
| Load orders | `async function loadOrders()` |
| Upload image | `async function uploadImage(` |
| Upload STL | `async function uploadSTL(` |
| Delete order | `async function deleteOrder(` |
| Show tab | `function showTab(` |
| Display orders | `function displayOrders()` |

### Key Element IDs

| What to Find | Search For |
|--------------|------------|
| Edit tab | `id="edit-tab"` |
| Orders tab | `id="orders-tab"` |
| Save button | `class="save-all-button"` |
| Orders list | `id="orders-list"` |
| Price inputs | `id="admin-price-48x48"`, etc. |
| Content inputs | `id="admin-title"`, `id="admin-upload-text"`, etc. |

### API Endpoints Used

| What to Find | Search For |
|--------------|------------|
| Prices API | `/admin/prices/api` |
| Images API | `/admin/images/api` |
| Content API | `/admin/content/api` |
| Orders API | `/admin/orders/api` |
| STL API | `/admin/stl/api` |

---

## 🔧 Backend Server (`server-COMPLETE.md`)

### Key Functions

| What to Find | Search For |
|--------------|------------|
| Generate 3MF | `def generate_3mf_from_inputs(` |
| Generate OBJ | `def generate_obj_from_inputs(` |
| Prices API | `@app.route('/admin/prices/api'` |
| Images API | `@app.route('/admin/images/api'` |
| Content API | `@app.route('/admin/content/api'` |
| Orders API | `@app.route('/admin/orders/api'` |
| STL API | `@app.route('/admin/stl/api'` |
| Upload for checkout | `@app.route('/upload-for-checkout'` |
| Get STL | `@app.route('/get-stl/` |

### Key Routes

| What to Find | Search For |
|--------------|------------|
| All admin routes | `/admin/` |
| Public API routes | `/api/` |
| STL download | `/get-stl/` |
| File upload | `/upload-for-checkout` |
| Order download | `/admin/orders/download/` |

---

## 🎨 Common Patterns

### Finding Event Listeners

Search for:
- `addEventListener(` - All event listeners
- `onclick="` - Inline click handlers
- `onchange="` - Input change handlers

### Finding CSS Styles

Search for:
- `style="` - Inline styles
- `.class-name {` - CSS class definitions
- `#element-id {` - CSS ID definitions

### Finding API Calls

Search for:
- `fetch(` - All fetch requests
- `getApiUrl(` - API URL construction
- `await fetch(` - Async API calls

### Finding State Management

Search for:
- `localStorage.` - Local storage usage
- `IndexedDB` - Database operations
- `let ` or `const ` - Variable declarations

---

## 📍 Line Number Ranges (Approximate)

### Mobile Index

- **Lines 1-50:** Redirect script, library includes
- **Lines 51-800:** CSS styles
- **Lines 801-1100:** HTML structure
- **Lines 1101-5542:** JavaScript code

### Desktop

- **Lines 1-80:** Button removal script, library includes
- **Lines 81-700:** CSS styles
- **Lines 701-1000:** HTML structure
- **Lines 1001-4004:** JavaScript code

### Admin

- **Lines 1-850:** CSS styles
- **Lines 851-1100:** HTML structure
- **Lines 1101-1924:** JavaScript code

---

## 💡 Pro Tips

1. **Use multiple searches** - Search for function name, then search for where it's called
2. **Follow the flow** - Start with event listener, find handler function, trace execution
3. **Check both files** - Mobile and desktop may have different implementations
4. **Search for comments** - Code often has helpful comments explaining behavior
5. **Use regex** - Enable regex search for pattern matching

---

## 🔗 Cross-Reference

When building React:

1. Find the function in these source files
2. Copy the exact logic
3. Adapt to React patterns (hooks, components, etc.)
4. Reference documentation for React examples

**These files are your source of truth!**

