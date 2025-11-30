# 🐳 Use Docker on Render (Should Fix Pillow!)

I've created a Dockerfile that installs system dependencies for Pillow. This should fix the build errors!

## How to Use Docker on Render

### Step 1: Update Render Settings

1. Go to Render Dashboard → Your Service → Settings
2. Scroll to **"Docker"** section
3. Make sure **"Docker"** is selected (not "Pip")
4. **Remove the Build Command** (Docker handles it)
5. **Keep Start Command:** `gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app`

### Step 2: Redeploy

1. Go to "Manual Deploy" → "Deploy latest commit"
2. Render will use the Dockerfile automatically!

---

## What the Dockerfile Does

- ✅ Uses Python 3.11 (official image)
- ✅ Installs system libraries Pillow needs (libjpeg-dev, zlib1g-dev)
- ✅ Installs Python packages from requirements.txt
- ✅ Starts your server

This should **definitely** fix the Pillow build errors because we're installing the system dependencies it needs!

---

## If You Don't See Docker Option

1. Delete your current Render service
2. Create a **new** Web Service
3. When creating, select **"Docker"** as the environment
4. Connect your GitHub repo
5. Render will automatically use the Dockerfile

---

## This Should Work!

The Dockerfile approach gives us full control over the build environment, so Pillow will compile correctly with all its dependencies installed.

