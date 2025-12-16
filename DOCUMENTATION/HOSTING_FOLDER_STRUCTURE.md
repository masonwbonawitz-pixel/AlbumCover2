# Hosting Folder Structure Guide

This document provides the complete, organized folder structure for hosting your application.

---

## 📁 Complete Folder Structure

```
your-website-root/
│
├── index.html                    ← MAIN ENTRY POINT (device detection & routing)
│
├── desktop.html                  ← Desktop version (OR use desktop/index.html)
│
├── admin.html                    ← Admin panel (OR use admin/index.html)
│
├── mobile/                       ← Mobile version folder
│   └── index.html                ← Mobile-optimized version
│
├── assets/                       ← All static assets
│   ├── css/
│   │   ├── styles-layout-mobile.css
│   │   ├── styles-layout-desktop.css
│   │   ├── styles-grid-buttons.css
│   │   ├── styles-sliders.css
│   │   ├── styles-color-palette.css
│   │   ├── styles-toggle-switch.css
│   │   └── styles-upload-area.css
│   │
│   ├── js/
│   │   ├── main-app-content-loading.js
│   │   ├── three.js (or use CDN)
│   │   ├── STLLoader.js (or use CDN)
│   │   └── OrbitControls.js (or use CDN)
│   │
│   └── images/
│       └── (product images, icons, etc.)
│
└── api/                          ← Backend API (if separate)
    └── (Flask server files)
```

---

## 🎯 Recommended Structure (Option 1: Flat Admin)

**Best for simple hosting:**

```
your-website-root/
│
├── index.html                    ← MAIN: Device detection & routing
├── desktop.html                  ← Desktop version
├── admin.html                    ← Admin panel
│
├── mobile/
│   └── index.html                ← Mobile version
│
└── assets/                       ← All CSS, JS, images
    ├── css/
    ├── js/
    └── images/
```

**URLs:**
- `https://yoursite.com/` → `index.html` (routes to mobile or desktop)
- `https://yoursite.com/desktop.html` → Desktop version
- `https://yoursite.com/admin.html` → Admin panel
- `https://yoursite.com/mobile/` → Mobile version (direct access)

---

## 🎯 Alternative Structure (Option 2: Organized Folders)

**Best for cleaner URLs:**

```
your-website-root/
│
├── index.html                    ← MAIN: Device detection & routing
│
├── desktop/
│   └── index.html                ← Desktop version
│
├── mobile/
│   └── index.html                ← Mobile version
│
├── admin/
│   └── index.html                ← Admin panel
│
└── assets/                       ← All CSS, JS, images
    ├── css/
    ├── js/
    └── images/
```

**URLs:**
- `https://yoursite.com/` → `index.html` (routes to mobile or desktop)
- `https://yoursite.com/desktop/` → Desktop version
- `https://yoursite.com/mobile/` → Mobile version
- `https://yoursite.com/admin/` → Admin panel

---

## 📄 File Purposes

### 1. **index.html** (Root - REQUIRED)
- **Purpose**: Main entry point that detects device type
- **Function**: Automatically redirects users to mobile or desktop version
- **Location**: Must be at root level
- **Contains**: Device detection script + redirect logic

### 2. **mobile/index.html** (Mobile Version)
- **Purpose**: Mobile-optimized interface
- **Function**: Full mobile experience with touch controls
- **Location**: `mobile/` folder
- **Access**: Via redirect from root OR direct URL `/mobile/`

### 3. **desktop.html** OR **desktop/index.html** (Desktop Version)
- **Purpose**: Desktop-optimized interface
- **Function**: Two-panel side-by-side layout
- **Location**: Root level OR `desktop/` folder
- **Access**: Via redirect from root OR direct URL `/desktop.html` or `/desktop/`

### 4. **admin.html** OR **admin/index.html** (Admin Panel)
- **Purpose**: Content management interface
- **Function**: Edit prices, content, images, view orders
- **Location**: Root level OR `admin/` folder
- **Access**: Direct URL `/admin.html` or `/admin/`
- **Note**: Should add authentication in production!

---

## 🔗 How They Connect

### Routing Flow:

```
User visits: https://yoursite.com/
    ↓
index.html loads
    ↓
Device detection script runs
    ↓
    ├─→ Mobile device? → Redirect to /mobile/
    └─→ Desktop device? → Redirect to /desktop.html (or /desktop/)
```

### Admin Access:

```
User visits: https://yoursite.com/admin.html (or /admin/)
    ↓
admin.html loads directly
    ↓
No redirect needed - admin is separate
```

---

## ✅ Recommended Setup (My Recommendation)

**Use Option 1 (Flat Admin) for simplicity:**

```
your-website-root/
│
├── index.html                    ← Device detection & routing
├── desktop.html                  ← Desktop version
├── admin.html                    ← Admin panel
│
├── mobile/
│   └── index.html                ← Mobile version
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
└── (backend files if needed)
```

**Why this structure?**
- ✅ Simple and straightforward
- ✅ Easy to understand
- ✅ Works with most hosting providers
- ✅ Clear separation of concerns
- ✅ Admin is easily accessible

---

## 📝 index.html Device Detection Code

Your root `index.html` should contain:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Album Cover Mosaic Builder</title>
    <script>
        // Device detection and routing
        (function() {
            // Check URL parameters first (for testing)
            const urlParams = new URLSearchParams(window.location.search);
            const forceMobile = urlParams.get('mobile') === 'true';
            const forceDesktop = urlParams.get('desktop') === 'true';
            
            if (forceMobile) {
                window.location.href = '/mobile/';
                return;
            }
            
            if (forceDesktop) {
                window.location.href = '/desktop.html';
                return;
            }
            
            // Detect if device is desktop
            function isDesktopDevice() {
                // Check screen width
                if (window.innerWidth > 1024) {
                    // Check user agent
                    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
                    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
                    
                    // If screen is large AND not a mobile user agent, it's desktop
                    if (!isMobileUA) {
                        return true;
                    }
                }
                return false;
            }
            
            // Redirect based on device
            if (isDesktopDevice()) {
                window.location.href = '/desktop.html';
            } else {
                window.location.href = '/mobile/';
            }
        })();
    </script>
</head>
<body>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <p>Redirecting...</p>
    </div>
</body>
</html>
```

---

## 🎨 Assets Organization

### CSS Files (in `assets/css/`)
- `styles-layout-mobile.css` - Mobile layout styles
- `styles-layout-desktop.css` - Desktop layout styles
- `styles-grid-buttons.css` - Grid button styles
- `styles-sliders.css` - Slider control styles
- `styles-color-palette.css` - Color palette styles
- `styles-toggle-switch.css` - Toggle switch styles
- `styles-upload-area.css` - Upload area styles

### JavaScript Files (in `assets/js/`)
- `main-app-content-loading.js` - Content loading logic
- (Or use CDN for Three.js libraries)

### Images (in `assets/images/`)
- Product images
- Icons
- Stand images
- Mounting dot images

---

## 🔐 Admin Panel Notes

### Do You Need an Index Folder for Admin?

**Short answer: No, but it's cleaner if you use one.**

**Options:**

1. **Flat (Simple)**: `admin.html` at root
   - URL: `/admin.html`
   - ✅ Simple
   - ✅ Easy to access

2. **Folder (Clean URLs)**: `admin/index.html`
   - URL: `/admin/` or `/admin`
   - ✅ Cleaner URL
   - ✅ Can add more admin files later
   - ✅ Better organization

**Recommendation**: Use `admin.html` at root for simplicity, unless you plan to expand admin features.

---

## 🚀 Deployment Checklist

- [ ] `index.html` at root (device detection)
- [ ] `mobile/index.html` exists
- [ ] `desktop.html` exists (or `desktop/index.html`)
- [ ] `admin.html` exists (or `admin/index.html`)
- [ ] All CSS files in `assets/css/`
- [ ] All JS files in `assets/js/` (or using CDN)
- [ ] All images in `assets/images/`
- [ ] Backend API configured (if separate)
- [ ] CORS configured (if API is separate domain)
- [ ] Admin authentication added (for production)

---

## 📋 Quick Reference

| File/Folder | Purpose | URL |
|------------|---------|-----|
| `index.html` | Device detection & routing | `/` |
| `mobile/index.html` | Mobile version | `/mobile/` |
| `desktop.html` | Desktop version | `/desktop.html` |
| `admin.html` | Admin panel | `/admin.html` |
| `assets/css/` | Stylesheets | `/assets/css/` |
| `assets/js/` | JavaScript files | `/assets/js/` |
| `assets/images/` | Images | `/assets/images/` |

---

## 💡 Tips

1. **Keep it simple**: Start with Option 1 (flat admin structure)
2. **Test routing**: Make sure device detection works on both mobile and desktop
3. **Admin security**: Add authentication before going live
4. **CDN for libraries**: Use CDN for Three.js to reduce file size
5. **Backend separation**: Keep backend API separate if possible

---

## ❓ Common Questions

**Q: Do I need the mobile folder?**
A: Yes! The mobile version should be in `mobile/index.html` so it's accessible at `/mobile/`

**Q: Can I put desktop in a folder too?**
A: Yes! You can use `desktop/index.html` instead of `desktop.html` for cleaner URLs

**Q: Does admin need to be in a folder?**
A: No, but `admin/index.html` gives you cleaner URLs (`/admin/` vs `/admin.html`)

**Q: What if I want everything in folders?**
A: Use Option 2 structure - it's cleaner but requires updating all internal links

---

This structure will work with any hosting provider (Netlify, Vercel, GitHub Pages, traditional web hosting, etc.)



