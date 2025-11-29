# 🔧 Fix for Pillow Build Error on Render

## The Problem
You're getting: **"Failed to build 'pillow' when getting requirements to build wheel"** or **"KeyError: __version__"**

This happens because Render is trying to compile Pillow from source, which requires system libraries.

## ✅ The Fix

### Option 1: Use Pre-built Wheels (Recommended)

**Update your Render Build Command to:**
```
pip install --upgrade pip setuptools wheel && pip install --only-binary :all: -r requirements.txt || pip install -r requirements.txt
```

This forces pip to use pre-built wheels (no compilation needed).

---

### Option 2: Install Pillow Separately First

**Update your Render Build Command to:**
```
pip install --upgrade pip setuptools wheel && pip install pillow --only-binary :all: && pip install -r requirements.txt
```

This installs Pillow first using pre-built wheels, then installs the rest.

---

### Option 3: Use Flexible Requirements

If Options 1 and 2 fail, use `requirements-render.txt`:

**Change your Build Command to:**
```
pip install --upgrade pip setuptools wheel && pip install -r requirements-render.txt
```

This uses more flexible version constraints that allow pip to find compatible pre-built wheels.

---

## 🚀 How to Update in Render

1. Go to your Render dashboard
2. Click on your service
3. Go to **"Settings"**
4. Scroll to **"Build Command"**
5. Replace it with one of the commands above (try Option 1 first)
6. Click **"Save Changes"**
7. Go to **"Manual Deploy"** → **"Deploy latest commit"**

---

## Why This Works

- `--only-binary :all:` tells pip to only use pre-built wheels (no compilation)
- `|| pip install -r requirements.txt` is a fallback if the first command fails
- Upgrading `pip setuptools wheel` first ensures you have the latest build tools

---

## Still Having Issues?

If none of these work, check the build logs to see the exact error. Sometimes Render's build environment needs specific system packages, but the pre-built wheel approach should work in 99% of cases.

