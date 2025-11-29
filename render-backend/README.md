# Render Backend Deployment

This folder contains all files needed to deploy the Flask backend to Render.com

## Files Included:
- `server.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `stl_files/` - STL grid files (48x48, 75x75, 96x96)
- `product_images/` - Folder for uploaded product images
- `orders/` - Folder for order data
- `prices.json` - Initial prices configuration
- `images.json` - Initial images configuration
- `content.json` - Initial content configuration
- `orders.json` - Initial orders data

## Render Configuration:

### Build Command:
```
pip install -r requirements.txt
```

### Start Command:
```
gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app
```

### Root Directory:
- **If files are in repo root:** Leave blank (empty)
- **If files are in `render-backend/` folder:** Set to `render-backend`

### Environment Variables:
- `PORT` - Automatically set by Render (don't need to add manually)

## Deployment Steps:

1. **Upload to GitHub:**
   - Create a new repository OR
   - Upload this entire `render-backend` folder to your existing repo
   - Make sure `requirements.txt` and `server.py` are visible in GitHub

2. **Connect to Render:**
   - Go to render.com
   - Create new Web Service
   - Connect your GitHub repository
   - Select the branch (usually `main` or `master`)

3. **Configure Settings:**
   - **Build Command:** `pip install --upgrade pip setuptools wheel && pip install --only-binary=pillow pillow && pip install -r requirements.txt`
   - **Start Command:** `gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app`
   - **Root Directory:** 
     - If files are in repo root: Leave **BLANK**
     - If files are in `render-backend/` folder: Set to `render-backend`

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete
   - Copy your backend URL (e.g., `https://your-app.onrender.com`)

5. **Update Admin Panel:**
   - Open `admin.html` in your main project
   - Find line ~1088 with `BACKEND_URL`
   - Replace `YOUR_BACKEND_URL_HERE` with your Render URL
   - Example: `'https://rize-albums-backend.onrender.com'`

## Troubleshooting:

### Error: "Failed to build 'pillow'" or "KeyError: __version__"
**This is a common Pillow build error on Render!**

**Solution:**
1. Use this **Build Command** (forces pre-built wheels):
   ```
   pip install --upgrade pip setuptools wheel && pip install --only-binary :all: -r requirements.txt || pip install -r requirements.txt
   ```

2. **Alternative:** If that fails, try installing Pillow separately first:
   ```
   pip install --upgrade pip setuptools wheel && pip install pillow --only-binary :all: && pip install -r requirements.txt
   ```

3. **Last resort:** Use `requirements-render.txt` instead:
   - Change Build Command to: `pip install --upgrade pip setuptools wheel && pip install -r requirements-render.txt`
   - This uses more flexible version constraints

### Error: "Getting requirements to build wheel did not run successfully"
**This is usually caused by `py3mf` or `trimesh` packages.**

**Solution:**
1. ✅ I've already removed `py3mf` from `requirements.txt` (it's optional - code handles it gracefully)
2. Use the Build Command above (it upgrades build tools first)

### Error: "Could not open requirements file"
- **Check:** Is `requirements.txt` in your GitHub repo?
- **Check:** Is Root Directory set correctly?
- **Fix:** If files are in `render-backend/` folder, set Root Directory to `render-backend`
- **Fix:** Or move `requirements.txt` and `server.py` to repo root

### Error: "Module not found"
- Check build logs for which package failed
- The code handles missing `py3mf` gracefully - it's optional

### Build succeeds but service won't start
- Check logs for errors
- Verify Start Command is correct: `gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app`
- Make sure `gunicorn` is in requirements.txt

