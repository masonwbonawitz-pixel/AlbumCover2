# 🚀 Complete Deployment Guide

## The Problem
You tried to deploy `render-backend` to Netlify, but that's a **Python Flask backend** - Netlify only hosts static HTML/CSS/JS files!

## The Solution: 3 Separate Deployments

### 1️⃣ Backend → Render.com (Python Flask Server)

**Folder:** `render-backend/`

**What it is:** Your Flask API server that handles:
- STL file serving
- Image processing
- Order generation
- Admin API endpoints

**How to deploy:**
1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repo (or upload `render-backend` folder)
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app`
   - **Root Directory:** `render-backend` (if files are in that folder)
5. Deploy and copy your backend URL (e.g., `https://your-backend.onrender.com`)

---

### 2️⃣ Admin Panel → Netlify (Static Frontend)

**Folder:** `netlify-admin/`

**What it is:** Admin interface HTML file

**How to deploy:**
1. Go to [netlify.com](https://netlify.com)
2. Create new site
3. Drag and drop the **entire `netlify-admin` folder**
4. Your admin will be at: `https://your-admin-site.netlify.app`

**After deploying:**
- Open `netlify-admin/index.html` in a text editor
- Find line 1079: `const BACKEND_URL = '';`
- Change to: `const BACKEND_URL = 'https://your-backend.onrender.com';` (use your Render URL)
- Re-upload to Netlify

---

### 3️⃣ Main Website → Netlify (Static Frontend)

**Folder:** `netlify/`

**What it is:** Customer-facing website (mobile + desktop)

**How to deploy:**
1. Go to [netlify.com](https://netlify.com) (create a **different site** from admin)
2. Drag and drop the **entire `netlify` folder**
3. Your website will be at: `https://your-main-site.netlify.app`

**After deploying:**
- Open `netlify/desktop.html` - find `BACKEND_URL` (line ~906) and set it
- Open `netlify/mobile/index.html` - find `BACKEND_URL` (line ~1073) and set it
- Re-upload to Netlify

---

## Summary

```
┌─────────────────┐
│  Render.com     │  ← Backend (Python Flask)
│  render-backend │     Handles API, STL files, orders
└────────┬────────┘
         │
         │ API calls
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│Netlify│ │ Netlify │
│ Admin │ │  Main   │  ← Frontends (HTML/CSS/JS)
│ Panel │ │ Website │     Connect to backend
└───────┘ └─────────┘
```

## Quick Checklist

- [ ] Deploy `render-backend` to **Render.com** → Get backend URL
- [ ] Deploy `netlify-admin` to **Netlify** → Set `BACKEND_URL` in `index.html`
- [ ] Deploy `netlify` to **Netlify** (separate site) → Set `BACKEND_URL` in both HTML files
- [ ] Test admin panel - upload STL files
- [ ] Test main website - STL files should load!

## Why Netlify Shows 404 for Backend

Netlify can't run Python/Flask - it only serves static files. That's why `render-backend` shows 404 on Netlify. You need Render.com (or Railway, Heroku) for the backend!

