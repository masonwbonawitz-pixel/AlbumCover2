# Quick Setup Guide: Shopify Storefront Cart Integration

This is a quick-start guide to get your Shopify cart integration working. For detailed documentation, see `/DOCUMENTATION/SHOPIFY_STOREFRONT_CART_INTEGRATION.md`.

## Prerequisites

- [ ] Shopify store with admin access
- [ ] Flask backend deployed (Render, etc.)
- [ ] Custom app created in Shopify with Storefront API access

## Step 1: Get Your Shopify Credentials (5 minutes)

### A. Shop Domain
Your shop domain is: `yourstore.myshopify.com` (NOT your custom domain)

### B. Storefront API Token

1. Go to: **Shopify Admin** → **Apps** → **Develop apps**
2. Click: **Create an app** (e.g., "3D Builder Integration")
3. Go to: **Configuration** → **Storefront API**
4. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
5. Click: **Save**
6. Go to: **API credentials** tab
7. Copy: **Storefront access token** (starts with lowercase letters, ~32 characters)

### C. Product Variant IDs

**Option 1: Use the test script (easiest)**
```bash
cd 5001
python3 test_cart_creation.py
```

The script will show all your products and variants with their IDs.

**Option 2: Use GraphiQL App**
1. Install "Shopify GraphiQL App" from Shopify App Store
2. Run this query:
```graphql
{
  products(first: 10, query: "Custom 3D Mosaic") {
    edges {
      node {
        title
        variants(first: 10) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
            }
          }
        }
      }
    }
  }
}
```

3. Copy the variant IDs (format: `gid://shopify/ProductVariant/12345678901234`)

## Step 2: Configure Environment Variables (3 minutes)

Add these to your hosting platform (Render, Heroku, etc.):

```bash
# Required
SHOPIFY_SHOP_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=abc123def456...
SHOPIFY_STOREFRONT_API_VERSION=2025-01

# Variant IDs (get from Step 1C)
SHOPIFY_VARIANT_48=gid://shopify/ProductVariant/YOUR_48_ID
SHOPIFY_VARIANT_75=gid://shopify/ProductVariant/YOUR_75_ID
SHOPIFY_VARIANT_96=gid://shopify/ProductVariant/YOUR_96_ID

# Optional: Addons
SHOPIFY_VARIANT_STAND=gid://shopify/ProductVariant/YOUR_STAND_ID
SHOPIFY_VARIANT_MOUNTING=gid://shopify/ProductVariant/YOUR_MOUNTING_ID

# For webhooks (get after creating webhook)
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

### On Render:
1. Go to your service → **Environment** tab
2. Click **Add Environment Variable**
3. Add each variable above
4. Click **Save Changes** (triggers auto-deploy)

## Step 3: Deploy Backend Changes (1 minute)

```bash
git add .
git commit -m "Add Shopify Storefront cart integration"
git push origin main
```

Your backend will auto-deploy (if using Render).

## Step 4: Test Cart Creation (2 minutes)

### A. Run the test script

```bash
cd 5001
python3 test_cart_creation.py
```

Expected output:
```
✅ ALL TESTS PASSED
   Cart ID: gid://shopify/Cart/...
   Checkout URL: https://yourstore.myshopify.com/cart/c/...
```

### B. Test manually with curl

```bash
curl -X POST https://your-backend.onrender.com/api/create-cart \
  -H "Content-Type: application/json" \
  -d '{
    "size": 75,
    "quantity": 1,
    "customization_id": "test-123",
    "addons": {"stand": true, "mounting_dots": false}
  }'
```

Expected response:
```json
{
  "checkout_url": "https://yourstore.myshopify.com/cart/c/...",
  "cart_id": "gid://shopify/Cart/...",
  "success": true
}
```

## Step 5: Configure Webhook (3 minutes)

1. Go to: **Shopify Admin** → **Settings** → **Notifications**
2. Scroll to: **Webhooks** section
3. Click: **Create webhook**
4. Configure:
   - **Event**: Order payment
   - **Format**: JSON
   - **URL**: `https://your-backend.onrender.com/webhooks/orders/paid`
   - **API version**: 2025-01 (same as Storefront API)
5. Click: **Save**
6. Copy the webhook signing secret
7. Add to environment: `SHOPIFY_WEBHOOK_SECRET=your_secret`

## Step 6: Update Frontend (10 minutes)

Add this to your checkout button handler:

```javascript
async function handleCheckout() {
    // 1. Save customization
    const customizationId = await saveCustomization();
    
    // 2. Create cart
    const response = await fetch('/api/create-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            size: currentGridSize, // 48, 75, or 96
            quantity: 1,
            customization_id: customizationId,
            addons: {
                stand: standCheckbox.checked,
                mounting_dots: mountingDotsCheckbox.checked
            }
        })
    });
    
    const data = await response.json();
    
    // 3. Redirect to Shopify checkout
    if (data.checkout_url) {
        window.location.href = data.checkout_url;
    }
}
```

## Step 7: Test Full Flow (5 minutes)

1. Open your frontend
2. Upload an image
3. Click "Checkout"
4. Should redirect to Shopify checkout page
5. Complete test order:
   - Use test card: `1` (Visa)
   - Any future expiry date
   - Any CVV
6. Verify order appears in Shopify Admin
7. Check webhook was delivered (Settings → Notifications → Webhooks → View)

## Troubleshooting

### "Shopify Storefront API not configured"
→ Check environment variables are set on your hosting platform

### "Variant for size 75x75 not configured"
→ Add `SHOPIFY_VARIANT_75=gid://shopify/ProductVariant/...` to environment

### "Failed to create cart"
→ Check backend logs (Render → Logs tab)
→ Verify variant IDs are correct GraphQL GIDs

### Checkout URL loads but cart is empty
→ Verify variant is active and available in Shopify
→ Check variant ID format includes `gid://shopify/ProductVariant/` prefix

### Test script fails to connect
→ Make sure Flask server is running: `python server.py`
→ Or test against deployed backend: `BACKEND_URL=https://your-app.onrender.com python3 test_cart_creation.py`

## Environment Variables Checklist

Copy this checklist to verify your setup:

```bash
# 1. Shopify credentials
[ ] SHOPIFY_SHOP_DOMAIN=yourstore.myshopify.com
[ ] SHOPIFY_STOREFRONT_TOKEN=abc123...
[ ] SHOPIFY_STOREFRONT_API_VERSION=2025-01

# 2. Product variants (3 required)
[ ] SHOPIFY_VARIANT_48=gid://shopify/ProductVariant/...
[ ] SHOPIFY_VARIANT_75=gid://shopify/ProductVariant/...
[ ] SHOPIFY_VARIANT_96=gid://shopify/ProductVariant/...

# 3. Addon variants (optional)
[ ] SHOPIFY_VARIANT_STAND=gid://shopify/ProductVariant/...
[ ] SHOPIFY_VARIANT_MOUNTING=gid://shopify/ProductVariant/...

# 4. Webhook (set after creating webhook)
[ ] SHOPIFY_WEBHOOK_SECRET=your_secret
```

## Next Steps

Once everything is working:

1. **Enable express checkout** (Shopify Admin → Settings → Payments)
   - Shop Pay
   - Apple Pay
   - Google Pay

2. **Monitor cart creation** (check Render logs regularly)

3. **Test webhook delivery** (make test orders and verify webhooks arrive)

4. **Set up file delivery** (customize webhook handler to email files or upload to Shopify)

## Getting Help

- **Test script fails**: Run with verbose output: `python3 test_cart_creation.py`
- **Backend errors**: Check Render logs: Dashboard → Logs tab
- **Webhook issues**: Check delivery status: Shopify Admin → Settings → Notifications → Webhooks
- **Detailed docs**: See `/DOCUMENTATION/SHOPIFY_STOREFRONT_CART_INTEGRATION.md`

---

**Estimated Setup Time**: ~30 minutes total



