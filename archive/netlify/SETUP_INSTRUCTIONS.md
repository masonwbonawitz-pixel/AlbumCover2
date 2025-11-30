# Setup Instructions

## ⚠️ IMPORTANT: STL Files Won't Load Until You Set BACKEND_URL!

### Step 1: Deploy Backend
1. Deploy your Flask backend to Render/Railway/Heroku
2. Note your backend URL (e.g., `https://your-backend.onrender.com`)

### Step 2: Update BACKEND_URL in Frontend Files

**You MUST update `BACKEND_URL` in these files:**

1. **`netlify/desktop.html`** - Line ~906
   ```javascript
   const BACKEND_URL = 'https://your-backend.onrender.com';
   ```

2. **`netlify/mobile/index.html`** - Line ~1073
   ```javascript
   const BACKEND_URL = 'https://your-backend.onrender.com';
   ```

3. **`netlify-admin/admin.html`** - Line ~1079
   ```javascript
   const BACKEND_URL = 'https://your-backend.onrender.com';
   ```

### Step 3: Deploy to Netlify

1. **Deploy Main Website:**
   - Drag `netlify` folder to Netlify
   - Creates your main customer site

2. **Deploy Admin Panel:**
   - Drag `netlify-admin` folder to Netlify (as separate site)
   - Creates your admin panel

### Step 4: Upload STL Files via Admin

1. Go to your admin panel on Netlify
2. Click "STL Files" tab
3. Upload STL files for 48×48, 75×75, and 96×96
4. STL files will now load on the main website!

## ✅ Touch Screen Cropper Fixed!

The cropper now works on touch screens - you can drag and resize the crop box with your finger!

