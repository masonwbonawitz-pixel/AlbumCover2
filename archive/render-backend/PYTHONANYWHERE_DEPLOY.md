# 🐍 Deploy to PythonAnywhere (Free, No Credit Card!)

PythonAnywhere is specifically designed for Python apps and handles Pillow perfectly!

## Step 1: Sign Up

1. Go to [pythonanywhere.com](https://www.pythonanywhere.com)
2. Click "Pricing" → "Beginner" (Free tier)
3. Sign up (no credit card required!)

## Step 2: Upload Your Files

1. After signing up, go to "Files" tab
2. Create a new directory: `rize-albums-backend`
3. Upload all files from your `render-backend` folder:
   - `server.py`
   - `requirements.txt`
   - `stl_files/` folder
   - `product_images/` folder
   - `orders/` folder
   - All JSON files

## Step 3: Install Dependencies

1. Go to "Consoles" tab
2. Click "Bash" to open a terminal
3. Run:
   ```bash
   cd rize-albums-backend
   pip3.10 install --user -r requirements.txt
   ```

## Step 4: Create Web App

1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Select Python 3.10
5. Click "Next" → "Next"

## Step 5: Configure WSGI File

1. Click on the WSGI configuration file link
2. Replace the content with:
   ```python
   import sys
   import os

   path = '/home/yourusername/rize-albums-backend'
   if path not in sys.path:
       sys.path.insert(0, path)

   from server import app as application
   ```

   (Replace `yourusername` with your PythonAnywhere username)

3. Save the file

## Step 6: Configure Static Files

1. Go back to "Web" tab
2. Scroll to "Static files"
3. Add:
   - URL: `/static`
   - Directory: `/home/yourusername/rize-albums-backend/static` (if you have one)

## Step 7: Reload Web App

1. Click the green "Reload" button
2. Your app will be at: `https://yourusername.pythonanywhere.com`

## Step 8: Update Frontend

Update `BACKEND_URL` in your Netlify sites to:
```
https://yourusername.pythonanywhere.com
```

---

## Free Tier Limits

- ✅ 1 web app
- ✅ 512MB disk space
- ✅ Enough for your backend!

---

## Why This Works

- ✅ PythonAnywhere is built for Python
- ✅ Pillow works perfectly (no build errors!)
- ✅ No credit card required
- ✅ Free tier available

