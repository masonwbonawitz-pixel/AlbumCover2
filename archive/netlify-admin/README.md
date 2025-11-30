# Netlify Admin Deployment Folder

This folder contains the admin panel for managing your 3D Album Cover Mosaic Builder.

## Files Included:
- `index.html` - Complete admin panel (all CSS/JS embedded) - This is the main file Netlify serves
- `admin.html` - Backup copy (same as index.html)

## How to Deploy:
1. Drag and drop this entire `netlify-admin` folder into Netlify as a **separate site**
2. This will create a separate Netlify deployment for your admin panel

## ⚠️ IMPORTANT - Backend Configuration Required:

**You MUST:**
1. Deploy your Flask backend separately (Render, Railway, Heroku, etc.)
2. **Update `BACKEND_URL` in `admin.html`** (around line 1079) to point to your backend server URL
   - Example: `const BACKEND_URL = 'https://your-backend.onrender.com';`
   - Leave empty (`''`) if backend is on same domain

## ✅ How It Connects to Main Website:

**Both the admin and main website connect to the SAME backend:**

1. **Admin (this folder)** → Makes API calls to backend → Updates backend data
2. **Main Website (netlify folder)** → Makes API calls to backend → Reads backend data
3. **When you update in admin:**
   - Changes are saved to the backend
   - Main website automatically shows the updates (no re-deploy needed!)

## Architecture:

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Admin (Netlify)│────────▶│   Backend    │◀────────│ Main Site       │
│  netlify-admin  │  API    │  (Render/    │  API    │ (Netlify)       │
│                 │  calls  │  Railway)    │  calls  │ netlify folder  │
└─────────────────┘         └──────────────┘         └─────────────────┘
     Updates data                Stores data              Shows data
```

## Setup Steps:

1. **Deploy Backend** (Render, Railway, Heroku)
   - Upload your `server.py` and all backend files
   - Note the backend URL (e.g., `https://your-backend.onrender.com`)

2. **Deploy Admin** (Netlify - separate site)
   - Upload this `netlify-admin` folder
   - Set `BACKEND_URL` in `admin.html` to your backend URL
   - Access admin at: `https://your-admin-site.netlify.app`

3. **Deploy Main Website** (Netlify - separate site)
   - Upload the `netlify` folder
   - Set `BACKEND_URL` in both `desktop.html` and `mobile/index.html` to your backend URL
   - Access main site at: `https://your-main-site.netlify.app`

4. **Both will automatically connect!**
   - Admin updates → Backend saves → Main site shows updates immediately

## Do I Need Both on Netlify?

**Yes, you need both deployed:**
- Admin on Netlify (separate site) - for you to manage content
- Main website on Netlify (separate site) - for customers to use
- Backend on Render/Railway/Heroku - stores all data

**Once both are deployed and connected to the same backend, updates work automatically!**

