# Netlify Deployment Folder

This folder contains all the files needed to deploy the FRONTEND to Netlify.

## Files Included:
- `index.html` - Main entry point that detects device and redirects
- `desktop.html` - Desktop version of the app (all CSS/JS embedded)
- `mobile/index.html` - Mobile version of the app (all CSS/JS embedded)
- `_redirects` - Netlify routing configuration

## Why Only These Files?

The HTML files are **self-contained** - all CSS and JavaScript is embedded inside them. They use:
- ✅ CDN links for Three.js (loaded from internet)
- ✅ Embedded CSS and JavaScript (inside the HTML files)
- ❌ No separate CSS/JS files needed
- ❌ No image files needed (images come from backend API)
- ❌ No STL files needed (loaded from backend API)

## How to Deploy:
1. Drag and drop this entire `netlify` folder into Netlify
2. Or use Netlify CLI: `netlify deploy --dir=netlify`
3. Netlify will automatically detect the `_redirects` file

## ⚠️ IMPORTANT - Backend Configuration Required:

The frontend makes API calls to your backend server for:
- `/api/prices` - Product prices
- `/api/images` - Product images
- `/api/content` - Text content
- `/get-stl/` - STL file downloads
- `/generate-obj` - File generation
- `/upload-for-checkout` - Order processing

**You MUST:**
1. Deploy your Flask backend separately (Render, Railway, Heroku, etc.)
2. **Update `BACKEND_URL` in both `desktop.html` and `mobile/index.html`** to point to your backend server URL
   - Example: `const BACKEND_URL = 'https://your-backend.onrender.com';`
   - Leave empty (`''`) if backend is on same domain

**STL files won't load until you set the BACKEND_URL!**

## ✅ Admin Connection:

**YES! The admin is fully connected and will update the frontend automatically:**

**Setup:**
1. **Deploy Admin separately** - Use the `netlify-admin` folder as a separate Netlify site
2. **Both connect to same backend** - Admin and main site both point to your backend URL
3. **When you upload via admin:**
   - Images → Saved to backend → Frontend fetches via `/api/images`
   - STL files → Saved to backend → Frontend loads via `/get-stl/`
   - Prices → Saved to backend → Frontend fetches via `/api/prices`
   - Content → Saved to backend → Frontend fetches via `/api/content`
4. **Frontend automatically updates** - The frontend on Netlify makes API calls to your backend, so any changes you make in the admin will immediately appear on the frontend!

**Example workflow:**
- Upload STL file via admin → Backend saves it → Frontend loads it when user selects that grid size
- Update prices via admin → Backend saves it → Frontend shows new prices immediately
- Upload product images via admin → Backend saves them → Frontend displays them

**You need BOTH deployed:**
- ✅ Admin on Netlify (separate site from `netlify-admin` folder)
- ✅ Main site on Netlify (this folder)
- ✅ Backend on Render/Railway/Heroku

## What About Other Folders?

- `product_images/` - Served by backend API, not needed here
- `stl_files/` - Served by backend API, not needed here
- `orders/` - Backend storage, not needed here
- `shopify-version/` - Alternative version, not needed for Netlify
- Python files - Backend code, deploy separately

