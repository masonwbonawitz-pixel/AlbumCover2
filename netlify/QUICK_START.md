# Quick Start Guide

## ✅ Touch Screen Cropper - FIXED!
The cropper now works on touch screens! You can drag and resize the crop box with your finger.

## ⚠️ STL Files - Setup Required

**STL files will load automatically once you:**

1. **Deploy your backend** (Render, Railway, Heroku)
2. **Set `BACKEND_URL` in these files:**
   - `netlify/desktop.html` (line ~906)
   - `netlify/mobile/index.html` (line ~1073)
   - `netlify-admin/admin.html` (line ~1079)
   
   Change from:
   ```javascript
   const BACKEND_URL = '';
   ```
   
   To:
   ```javascript
   const BACKEND_URL = 'https://your-backend.onrender.com';
   ```

3. **Upload STL files via admin panel:**
   - Go to your admin Netlify site
   - Click "STL Files" tab
   - Upload 48×48, 75×75, and 96×96 STL files
   - They'll automatically appear on the main website!

## How It Works:

```
Admin (Netlify) → Updates Backend → Main Site (Netlify) shows updates
```

Both connect to the same backend, so changes are instant!

