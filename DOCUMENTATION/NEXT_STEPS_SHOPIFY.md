# 🎯 Next Steps: Deploy to Shopify

You've already set up your `.env` file and Shopify API credentials. Here's what to do next:

## ✅ Step 1: Deploy Your Backend (REQUIRED)

Shopify webhooks need HTTPS, so you must deploy your backend to a server.

### Quick Deploy to Render.com (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/5000"
   git init
   git add .
   git commit -m "Ready for deployment"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Render.com**:
   - Go to [render.com](https://render.com) and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - **Settings:**
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn --bind 0.0.0.0:$PORT --timeout 120 server:app`
   - **Add Environment Variables** (copy ALL from your `.env` file):
     - `SHOPIFY_STORE_URL`
     - `SHOPIFY_API_KEY`
     - `SHOPIFY_API_SECRET`
     - `SHOPIFY_API_VERSION`
     - `SHOPIFY_VARIANT_48`
     - `SHOPIFY_VARIANT_75`
     - `SHOPIFY_VARIANT_96`
     - `SHOPIFY_VARIANT_STAND`
     - `SHOPIFY_VARIANT_MOUNTING`
     - `ADMIN_EMAIL` (optional)
     - `BACKEND_URL` (set this to your Render URL after deployment)
   - Click "Create Web Service"
   - **Copy your backend URL** (e.g., `https://your-app.onrender.com`)

3. **Test your backend**:
   - Visit: `https://your-backend-url.onrender.com/api/prices`
   - Should see your prices JSON

---

## ✅ Step 2: Add Button to Shopify Product Page

1. **Go to Shopify Admin**:
   - Online Store → Themes → Actions → Edit code

2. **Add the Button Snippet**:
   - Go to "Snippets" folder
   - Click "Add a new snippet"
   - Name it: `shopify-button-snippet`
   - Copy the content from `5000/shopify-button-snippet.liquid`
   - **IMPORTANT**: Update these lines (around line 13-15):
     ```liquid
     {% assign builder_url = 'https://your-backend-url.onrender.com' %}
     {% assign builder_mobile_url = 'https://your-backend-url.onrender.com/mobile/' %}
     {% assign builder_desktop_url = 'https://your-backend-url.onrender.com/desktop/' %}
     ```
   - Replace `your-backend-url.onrender.com` with your actual Render URL
   - Click "Save"

3. **Add Button to Product Page**:
   - Go to "Templates" → `product.liquid` (or your product template)
   - Find where you want the button (usually after the product form)
   - Add this line:
     ```liquid
     {% render 'shopify-button-snippet' %}
   ```
   - Click "Save"

---

## ✅ Step 3: Configure Shopify Webhooks

1. **Go to Shopify Admin**:
   - Settings → Notifications → Webhooks

2. **Create Webhook 1: Order Creation**:
   - Click "Create webhook"
   - Event: `Order creation`
   - Format: `JSON`
   - URL: `https://your-backend-url.onrender.com/webhooks/orders/create`
   - API version: `2024-01` (or your version from .env)
   - Click "Save webhook"

3. **Create Webhook 2: Order Payment**:
   - Click "Create webhook"
   - Event: `Order payment`
   - Format: `JSON`
   - URL: `https://your-backend-url.onrender.com/webhooks/orders/paid`
   - API version: `2024-01` (or your version from .env)
   - Click "Save webhook"

---

## ✅ Step 4: Update Frontend Files (If Needed)

If your frontend is also deployed separately, update the backend URL:

1. **In `mobile/index.html`** - Find `BACKEND_URL` and update
2. **In `desktop.html`** - Find `BACKEND_URL` and update
3. **In `admin.html`** - Find `BACKEND_URL` and update

---

## ✅ Step 5: Test Everything

1. **Test the Button**:
   - Go to your Shopify product page
   - Click "🎨 Create Your Own Custom Design"
   - Should open builder in new window

2. **Test the Builder**:
   - Upload an image
   - Select grid size
   - Click "Add to Cart"
   - Should redirect to Shopify cart

3. **Test Checkout**:
   - Complete a test order
   - Check Render logs for webhook messages
   - Files should be uploaded to Shopify

4. **Test Admin Panel**:
   - Go to `https://your-backend-url.onrender.com/admin`
   - Click "🔄 Sync with Shopify"
   - Should see orders synced

---

## 🔧 Quick Reference

### Your Backend URL:
```
https://your-backend-url.onrender.com
```

### Webhook URLs:
- Order Creation: `https://your-backend-url.onrender.com/webhooks/orders/create`
- Order Payment: `https://your-backend-url.onrender.com/webhooks/orders/paid`

### Files to Update:
- `shopify-button-snippet.liquid` - Update builder URLs (line 13-15)
- Shopify Admin → Webhooks - Add webhook URLs
- Frontend files - Update BACKEND_URL if deployed separately

---

## 🐛 Troubleshooting

### "Webhook failed"
- Check Render logs for errors
- Verify webhook URL uses HTTPS
- Make sure `SHOPIFY_API_SECRET` matches your app secret

### "Button doesn't open builder"
- Check browser console for errors
- Verify builder URLs in snippet are correct
- Make sure backend is running and accessible

### "Files not uploading"
- Check Render logs
- Verify Shopify API credentials in Render environment variables
- Check that order files exist in `orders/` directory

---

## 📝 Checklist

- [ ] Backend deployed to Render.com
- [ ] Environment variables added to Render
- [ ] Backend URL tested and working
- [ ] Button snippet added to Shopify
- [ ] Builder URLs updated in snippet
- [ ] Button added to product page
- [ ] Webhooks configured in Shopify
- [ ] Test order created successfully
- [ ] Files uploaded after payment
- [ ] Admin panel sync working

---

**You're almost there!** Once you complete these steps, your Shopify integration will be fully functional. 🎉

