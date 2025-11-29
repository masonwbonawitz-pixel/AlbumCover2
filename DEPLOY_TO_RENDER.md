# 🚀 How to Deploy to Render - Step by Step

## Problem
Render can't find `requirements.txt` because it's not in your GitHub repository.

## Solution: Add requirements.txt to GitHub

### Option 1: Using GitHub Web Interface (Easiest)

1. **Go to your GitHub repository:**
   - Open: `https://github.com/masonwbonawitz-pixel/Album-cover-creator`

2. **Click "Add file" → "Create new file"**

3. **Name the file:** `requirements.txt`

4. **Copy and paste this content:**
   ```
   flask==3.0.0
   flask-cors==4.0.0
   numpy-stl==3.1.1
   trimesh==4.0.10
   lib3mf==2.3.1
   pillow==10.1.0
   numpy==1.26.2
   networkx==3.2.1
   gunicorn==21.2.0
   ```

5. **Scroll down and click "Commit new file"**
   - Write commit message: "Add requirements.txt"
   - Click "Commit new file"

### Option 2: Using Git Commands (If you have git set up)

If you have the repository cloned locally:

```bash
# Navigate to your repository
cd /path/to/your/repo

# Make sure requirements.txt is in the root
ls requirements.txt

# Add it to git
git add requirements.txt

# Commit it
git commit -m "Add requirements.txt for Render deployment"

# Push to GitHub
git push origin main
```

## Configure Render Settings

1. **Go to Render Dashboard** → Your Service → **Settings**

2. **Build Command:**
   ```
   pip install -r requirements.txt
   ```

3. **Start Command:**
   ```
   gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app
   ```

4. **Root Directory:** Leave **BLANK** (empty)

5. **Environment Variables:**
   - NAME: `PORT`
   - VALUE: `5000` (or leave blank, Render will set it)

6. **Click "Save Changes"**

## Verify requirements.txt is in GitHub

1. Go to: `https://github.com/masonwbonawitz-pixel/Album-cover-creator`
2. You should see `requirements.txt` in the file list
3. Click on it to verify the content is correct
4. It should be at the same level as `server.py` (not inside a folder)

## After Adding to GitHub

1. Render will automatically detect the change and redeploy
2. OR manually trigger a redeploy in Render dashboard
3. Check the logs - it should now find `requirements.txt`

## Common Issues

### Issue: Still can't find requirements.txt
- **Check:** Is it really in the root of your GitHub repo? (same level as server.py)
- **Check:** Did you commit and push it?
- **Check:** Is Root Directory in Render settings blank?

### Issue: Build fails after finding requirements.txt
- Some packages might not install (like lib3mf)
- Check the build logs for specific errors
- You may need to use alternative packages

## Your requirements.txt should contain:

```
flask==3.0.0
flask-cors==4.0.0
numpy-stl==3.1.1
trimesh==4.0.10
lib3mf==2.3.1
pillow==10.1.0
numpy==1.26.2
networkx==3.2.1
gunicorn==21.2.0
```

## Next Steps

1. ✅ Add requirements.txt to GitHub (using Option 1 above)
2. ✅ Verify it appears in your GitHub repo
3. ✅ Configure Render settings (Build Command, Start Command)
4. ✅ Trigger a new deploy
5. ✅ Check logs to see if it works!

