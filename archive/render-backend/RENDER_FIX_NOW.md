# 🔧 Fix Render Build Error - build.sh Not Found

## The Problem
Render says: `chmod: cannot access 'build.sh': No such file or directory`

This means `build.sh` isn't in your GitHub repository.

## ✅ Solution: Use Build Command Directly (No Script Needed)

Instead of using the script, put the build commands directly in Render.

### Step 1: Update Render Build Command

1. Go to Render Dashboard → Your Service → Settings
2. Find **"Build Command"**
3. Replace it with this (copy the entire line):

```bash
pip install --upgrade pip setuptools wheel && pip install pillow --only-binary :all: --no-build-isolation && pip install -r requirements.txt --prefer-binary
```

4. Click **"Save Changes"**

### Step 2: Redeploy

1. Go to **"Manual Deploy"** → **"Deploy latest commit"**

---

## What This Does

- Upgrades pip, setuptools, wheel
- Installs Pillow with `--only-binary :all:` (forces pre-built wheels, no compilation)
- Uses `--no-build-isolation` to prevent Render from creating isolated build environment
- Installs rest of packages with `--prefer-binary` (uses wheels when available)

---

## Alternative: If You Want to Use build.sh

If you prefer to use the script, you need to:

1. **Commit build.sh to GitHub:**
   ```bash
   cd render-backend
   git add build.sh
   git commit -m "Add build script"
   git push
   ```

2. Then Render will find it.

But the direct build command above should work without needing to commit anything!

---

## Try the Direct Build Command First!

It's simpler and should work immediately.

