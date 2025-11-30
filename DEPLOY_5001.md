# 🚀 Deploy 5001 Folder to Render

## Answer: Give Render the WHOLE repo!

You should connect your **entire GitHub repository** to Render. Here's why:

✅ **Render will ONLY deploy what you tell it to** via `render.yaml`
✅ The `render.yaml` in the **root** has `rootDir: 5001`, so it will **only deploy the 5001 folder**
✅ Later, you can easily switch to 5000 by changing one line in `render.yaml`

## How It Works

1. **Connect whole repo to Render** - Render connects to your GitHub repo
2. **Render looks for `render.yaml` in the root** - It finds the one we created
3. **`rootDir: 5001` tells Render** - "Only use files from the 5001 folder"
4. **Render deploys only 5001** - It ignores 5000, DOCUMENTATION, archive, etc.

## Step-by-Step Deployment

### 1. Push Everything to GitHub

```bash
cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums"
git add .
git commit -m "Add render.yaml for 5001 deployment"
git push
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. **Connect your GitHub account** (if not already)
4. **Select your repository** (the whole repo)
5. Render will detect `render.yaml` automatically
6. Click **"Create Web Service"**

### 3. Add Environment Variables

In Render dashboard → Your service → **Environment** tab:

Add all your `.env` variables:
```
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_API_VERSION=2024-01
SHOPIFY_PRODUCT_ID=1234567890
SHOPIFY_VARIANT_48=1111111111
SHOPIFY_VARIANT_75=2222222222
SHOPIFY_VARIANT_96=3333333333
SHOPIFY_VARIANT_STAND=4444444444
SHOPIFY_VARIANT_MOUNTING=5555555555
ADMIN_EMAIL=your-email@example.com
BACKEND_URL=https://your-service-name.onrender.com
```

**Note**: Update `BACKEND_URL` after deployment with your actual Render URL.

## ✅ What Gets Deployed

With `rootDir: 5001` in `render.yaml`:
- ✅ **5001/** folder - Deployed
- ❌ **5000/** folder - Ignored
- ❌ **DOCUMENTATION/** - Ignored
- ❌ **archive/** - Ignored
- ❌ Everything else - Ignored

Render will:
1. Look in `5001/` for `requirements.txt`
2. Run `pip install -r requirements.txt` (from 5001 folder)
3. Run `gunicorn server:app` (using `5001/server.py`)

## 🔄 Switch to 5000 Later

When you want to deploy 5000 instead:

1. Edit `render.yaml` in the root
2. Change `rootDir: 5001` to `rootDir: 5000`
3. Commit and push:
   ```bash
   git add render.yaml
   git commit -m "Switch deployment to 5000"
   git push
   ```
4. Render will automatically redeploy with 5000

## 📁 File Structure

```
Cursor Code for Rize albums/
├── render.yaml          ← Root render.yaml (points to 5001)
├── 5000/
│   ├── server.py
│   ├── requirements.txt
│   └── render.yaml      ← Not used (we use root one)
├── 5001/
│   ├── server.py        ← This gets deployed
│   ├── requirements.txt ← This gets used
│   └── render.yaml      ← Not used (we use root one)
└── ... (other folders ignored)
```

## 🎯 Summary

- ✅ **Connect the whole repo** to Render
- ✅ **Render uses `render.yaml` in root** with `rootDir: 5001`
- ✅ **Only 5001 folder gets deployed**
- ✅ **Easy to switch** by changing `rootDir` in `render.yaml`

---

**You're all set!** Deploy the whole repo, and Render will only deploy 5001. 🚀

