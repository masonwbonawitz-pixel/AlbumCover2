# Reference Code Folder

This folder contains exact code snippets and examples from the current HTML/JS implementation that you can reference when building the React version to ensure everything looks and works identically.

---

## File Structure

```
REFERENCE_CODE/
├── README.md (this file)
├── admin/
│   ├── admin-save-function.js
│   ├── admin-load-function.js
│   └── admin-api-calls.js
├── main-app/
│   ├── content-loading.js
│   ├── price-loading.js
│   ├── image-loading.js
│   └── api-calls.js
├── components/
│   ├── upload-area.html
│   ├── grid-buttons.html
│   ├── canvas-component.html
│   ├── sliders.html
│   ├── color-palette.html
│   └── toggle-switch.html
├── styles/
│   ├── desktop-styles.css
│   ├── mobile-styles.css
│   └── admin-styles.css
├── three-viewer/
│   ├── viewer-setup.js
│   ├── controls-setup.js
│   └── color-mapping.js
└── backend/
    ├── api-endpoints.py
    ├── json-handlers.py
    └── image-upload.py
```

---

## How to Use

1. **Reference exact HTML/CSS** from `components/` and `styles/` to recreate React components
2. **Copy API patterns** from `main-app/` and `admin/` for React service layer
3. **Use Three.js code** from `three-viewer/` for React Three Fiber integration
4. **Follow backend patterns** from `backend/` for API endpoints

---

## Key Code Snippets

Each file contains working code from the current implementation. When building React components, use these as exact references to ensure identical functionality and appearance.

---

## Migration Notes

- **HTML → JSX**: Convert class → className, for → htmlFor
- **Inline Styles**: Keep exact same values
- **Event Handlers**: Convert onclick → onClick
- **DOM Manipulation**: Replace with React state and refs
- **API Calls**: Convert to async/await hooks

