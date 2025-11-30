# 🚀 Deploy to Render.com - Quick Guide

## Step 1: Push to GitHub

Make sure your `5000/` folder is in a GitHub repository:

```bash
cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/5000"
git add .
git commit -m "Add render.yaml for deployment"
git push
```

## Step 2: Deploy on Render

1. **Go to Render.com** and sign in
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Select your repository**

## Step 3: Render will auto-detect render.yaml

Since you now have `render.yaml`, Render will automatically:
- ✅ Detect it's a Python service
- ✅ Use the build command: `pip install -r requirements.txt`
- ✅ Use the start command: `gunicorn --bind 0.0.0.0:$PORT --timeout 120 --workers 2 server:app`
- ✅ Set up health checks

## Step 4: Add Environment Variables

Even though `render.yaml` lists the env vars, you still need to **add the actual values** in Render:

1. In the Render dashboard, go to your service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add each variable from your `.env` file:

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

**Important**: Set `BACKEND_URL` to your Render URL **after** deployment (you can update it later).

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for first deployment
3. Copy your service URL (e.g., `https://rize-albums-backend.onrender.com`)

## Step 6: Update BACKEND_URL

After deployment, go back to Environment variables and update:
```
BACKEND_URL=https://your-actual-service-name.onrender.com
```

Then click "Manual Deploy" → "Deploy latest commit" to restart with the correct URL.

## ✅ Test Your Deployment

Visit: `https://your-service-name.onrender.com/api/prices`

You should see your prices JSON.

## 🐛 Troubleshooting

### Build fails
- Check Render logs for specific errors
- Make sure `requirements.txt` has all dependencies
- Some packages might need alternatives (try `py3mf` instead of `lib3mf` if needed)

### "Shopify credentials not configured"
- Check that all environment variables are set in Render
- Make sure there are no extra spaces or quotes
- Verify values match your `.env` file

### Service goes to sleep (free tier)
- Render free tier spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading for always-on service

## 📝 Files You Need

✅ `render.yaml` - Configuration file (already created)
✅ `requirements.txt` - Python dependencies (already exists)
✅ `server.py` - Main Flask app (already exists)
✅ `.env` - Your credentials (keep local, add to Render as environment variables)

---

**That's it!** Once deployed, you'll have your backend URL to use in Shopify webhooks and button snippets.

