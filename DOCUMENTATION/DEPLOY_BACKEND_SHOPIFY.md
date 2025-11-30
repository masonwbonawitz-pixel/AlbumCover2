# 🚀 Deploy Your Backend with Shopify Integration

This guide will help you deploy your Flask backend to Render.com (recommended) or another hosting service.

## Prerequisites

- Your `.env` file is configured (✅ You already did this!)
- A GitHub account (free)
- A Render.com account (free tier available)

## Step 1: Prepare Your Code

### 1.1 Make sure requirements.txt is up to date

Your `requirements.txt` should include:
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
python-dotenv==1.0.0
PyShopify==0.9.11
```

### 1.2 Make sure server.py is in the root

Your `server.py` should be in the root of your project (same level as `requirements.txt`).

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)

```bash
cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums"
git init
git add .
git commit -m "Initial commit with Shopify integration"
```

### 2.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it something like `rize-albums-backend`
3. Don't initialize with README (you already have files)

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/rize-albums-backend.git
git branch -M main
git push -u origin main
```

**⚠️ Important:** Make sure `.env` is in `.gitignore` so you don't commit your API keys!

## Step 3: Deploy to Render.com

### 3.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free)
3. Connect your GitHub account

### 3.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (`rize-albums-backend`)
3. Select the repository

### 3.3 Configure Settings

**Basic Settings:**
- **Name:** `rize-albums-backend` (or any name you like)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** Leave **BLANK** (empty)
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app`

**Environment Variables:**
Click **"Add Environment Variable"** and add ALL of these from your `.env` file:

```
SHOPIFY_STORE_URL=rizemaps.myshopify.com
SHOPIFY_API_KEY=93e4732859f75d96d212b040692ef1f1
SHOPIFY_API_SECRET=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
SHOPIFY_API_VERSION=2025-10
SHOPIFY_PRODUCT_ID=10470739312945
SHOPIFY_VARIANT_48=10470738559281
SHOPIFY_VARIANT_75=10470738952497
SHOPIFY_VARIANT_96=10470739312945
SHOPIFY_VARIANT_STAND=10470741901617
SHOPIFY_VARIANT_MOUNTING=10470742655281
```

**Optional (but recommended):**
```
ADMIN_EMAIL=your-email@example.com
BACKEND_URL=https://your-backend-name.onrender.com
```

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://rize-albums-backend.onrender.com`)

## Step 4: Test Your Backend

### 4.1 Test the API

Open in browser:
```
https://your-backend-name.onrender.com/api/prices
```

You should see your prices JSON.

### 4.2 Check Logs

In Render dashboard → **Logs**, you should see:
```
✅ Shopify credentials configured
🚀 Starting Album Cover 3D Color Mapper server...
```

## Step 5: Update Frontend URLs

After deployment, update your frontend files to point to your new backend URL:

### 5.1 Update mobile/index.html

Find line with `BACKEND_URL` and update:
```javascript
const BACKEND_URL = 'https://your-backend-name.onrender.com';
```

### 5.2 Update desktop.html

Find line with `BACKEND_URL` and update:
```javascript
const BACKEND_URL = 'https://your-backend-name.onrender.com';
```

### 5.3 Update admin.html

Find line with `BACKEND_URL` and update:
```javascript
const BACKEND_URL = 'https://your-backend-name.onrender.com';
```

## Step 6: Set Up Shopify Webhooks

Now that your backend is deployed, set up webhooks:

1. Go to Shopify Admin → **Settings** → **Notifications** → **Webhooks**
2. Click **"Create webhook"**

**Webhook 1: Order Creation**
- Event: `Order creation`
- Format: `JSON`
- URL: `https://your-backend-name.onrender.com/webhooks/orders/create`
- API version: `2025-10`

**Webhook 2: Order Payment**
- Event: `Order payment`
- Format: `JSON`
- URL: `https://your-backend-name.onrender.com/webhooks/orders/paid`
- API version: `2025-10`

3. Click **"Save webhook"** for each

## Troubleshooting

### Issue: Build fails
- Check Render logs for specific errors
- Make sure `requirements.txt` is in the root
- Some packages might need alternatives (like `py3mf` instead of `lib3mf`)

### Issue: "Shopify credentials not configured"
- Check that all environment variables are set in Render
- Make sure there are no extra spaces or quotes
- Verify the values match your `.env` file

### Issue: Webhooks not working
- Make sure your backend URL uses HTTPS (required by Shopify)
- Check Render logs for webhook errors
- Verify webhook URLs in Shopify match your backend URL

### Issue: Backend goes to sleep (free tier)
- Render free tier spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to paid tier for always-on service

## Alternative Hosting Options

### Railway.app
1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Deploy from repository
4. Add environment variables
5. Similar setup to Render

### Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub
4. Add environment variables in Settings
5. Deploy

## Next Steps

After deployment:
1. ✅ Test your backend API endpoints
2. ✅ Update frontend URLs
3. ✅ Set up Shopify webhooks
4. ✅ Test the full flow (create order → webhook → file upload)

## Your Backend URL

Once deployed, your backend URL will be:
```
https://your-backend-name.onrender.com
```

Save this URL - you'll need it for:
- Frontend configuration
- Shopify webhooks
- Testing

---

**Need help?** Check the Render logs for error messages, or refer to the main `DEPLOYMENT_GUIDE.md` for more details.

