# Shopify Storefront Cart Checkout Integration

Complete guide for integrating Shopify cart creation and checkout using the Storefront API.

## Overview

This integration allows your 3D Album Cover Mosaic Builder to:
- Create a Shopify cart via Storefront API
- Add customized products with `customization_id` metadata
- Redirect users to Shopify's checkout page (with express checkout options like Shop Pay, Apple Pay, etc.)
- Process orders via webhooks after payment

## Architecture

```
Frontend (Hostinger) → Flask Backend (Render) → Shopify Storefront API → Checkout URL
                                ↓
                         Save customization files
                                ↓
                    Shopify Webhook (orders/paid) → Attach files to order
```

## Setup Instructions

### 1. Shopify Configuration

#### 1.1 Create Product and Variants

1. In Shopify Admin, create a product: **"Custom 3D Mosaic Print"**
2. Create variants for each size:
   - **48×48** (Small)
   - **75×75** (Medium)  
   - **96×96** (Large)
3. Optionally create addon products:
   - **Stand**
   - **Wall Mounting Dots**

#### 1.2 Get Variant GraphQL IDs

You need the GraphQL Global ID (GID) for each variant:

**Option A: Using GraphiQL App**
1. Install Shopify GraphiQL app from Shopify App Store
2. Query variants:
```graphql
{
  products(first: 10, query: "Custom 3D Mosaic") {
    edges {
      node {
        title
        id
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              sku
            }
          }
        }
      }
    }
  }
}
```
3. Note down the variant IDs (format: `gid://shopify/ProductVariant/12345678901234`)

**Option B: Using Storefront API**
Use the included test script (see Testing section below)

#### 1.3 Create Storefront API Access Token

1. Go to Shopify Admin → **Apps** → **Develop apps** (or App development)
2. Create a custom app (e.g., "3D Builder Integration")
3. Configure **Storefront API** permissions:
   - `unauthenticated_read_product_listings` (read products)
   - `unauthenticated_write_checkouts` (create carts)
   - `unauthenticated_read_checkouts` (read carts)
4. Install the app
5. Copy the **Storefront access token** (starts with lowercase letters, ~32 chars)

#### 1.4 Enable Express Checkout Methods

In Shopify Admin → **Settings** → **Payments**:
- Enable Shop Pay
- Enable Apple Pay
- Enable Google Pay
- Enable other payment methods as desired

These will automatically appear at checkout if enabled.

### 2. Backend Configuration

#### 2.1 Environment Variables

Add these to your Render (or hosting) environment variables:

```bash
# Shopify Storefront API
SHOPIFY_SHOP_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=abc123def456...
SHOPIFY_STOREFRONT_API_VERSION=2025-01

# Variant GIDs (from step 1.2)
SHOPIFY_VARIANT_48=gid://shopify/ProductVariant/48_VARIANT_ID
SHOPIFY_VARIANT_75=gid://shopify/ProductVariant/75_VARIANT_ID
SHOPIFY_VARIANT_96=gid://shopify/ProductVariant/96_VARIANT_ID
SHOPIFY_VARIANT_STAND=gid://shopify/ProductVariant/STAND_VARIANT_ID
SHOPIFY_VARIANT_MOUNTING=gid://shopify/ProductVariant/MOUNTING_VARIANT_ID

# Webhook verification (for orders/paid webhook)
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_from_shopify
```

**Important Notes:**
- Use `.myshopify.com` domain, not your custom domain
- Storefront token is different from Admin API token
- Keep API version consistent (update intentionally)

#### 2.2 Deploy Backend Changes

Your Flask backend now includes:
- `shopify_storefront_api.py` - Storefront API wrapper
- `POST /api/create-cart` endpoint - Creates cart and returns checkout URL

Deploy to Render:
```bash
git add .
git commit -m "Add Shopify Storefront cart integration"
git push origin main
```

Render will auto-deploy. Verify environment variables are set.

### 3. Webhook Configuration

#### 3.1 Create Webhook in Shopify

1. Shopify Admin → **Settings** → **Notifications**
2. Scroll to **Webhooks** section
3. Click **Create webhook**
4. Configure:
   - **Event**: `Order payment` (orders/paid)
   - **Format**: JSON
   - **URL**: `https://your-backend.onrender.com/webhooks/orders/paid`
   - **API version**: Same as your Storefront API version

5. Save and note the webhook signing secret

#### 3.2 Verify Webhook Handler

The backend already includes webhook verification using HMAC-SHA256.

Test webhook delivery:
- Make a test order
- Check Shopify Admin → Settings → Notifications → Webhooks → View recent deliveries
- Check Render logs for webhook processing

## Frontend Integration

### Modify Your Checkout Button

Update your frontend checkout flow to call the new `/api/create-cart` endpoint:

```javascript
// When user clicks "Checkout" button
async function handleCheckout() {
    try {
        // 1. Save customization files first (upload PNG/STL)
        const customizationId = await saveCustomization();
        
        // 2. Create Shopify cart
        const response = await fetch('https://your-backend.onrender.com/api/create-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        
        if (data.error) {
            alert('Error creating cart: ' + data.error);
            return;
        }
        
        // 3. Redirect to Shopify checkout
        window.location.href = data.checkout_url;
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to start checkout. Please try again.');
    }
}

// Save customization files to backend
async function saveCustomization() {
    const formData = new FormData();
    formData.append('stl', stlBlob);
    formData.append('png', pngBlob);
    formData.append('grid_size', currentGridSize);
    formData.append('stand_selected', standCheckbox.checked);
    formData.append('mounting_selected', mountingDotsCheckbox.checked);
    
    const response = await fetch('/upload-for-checkout', {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    return data.order_id; // This becomes customization_id
}
```

## API Reference

### POST /api/create-cart

Creates a Shopify cart and returns checkout URL.

**Request Body:**
```json
{
  "size": 75,
  "quantity": 1,
  "customization_id": "ea061789-ac95-4654-b993-2199c99b77d3",
  "addons": {
    "stand": true,
    "mounting_dots": false
  }
}
```

**Response (Success):**
```json
{
  "checkout_url": "https://yourstore.myshopify.com/cart/c/Z2NwLXVzLWVhc3QxOjAxSk...",
  "cart_id": "gid://shopify/Cart/Z2NwLXVzLWVhc3QxOjAxSk...",
  "customization_id": "ea061789-ac95-4654-b993-2199c99b77d3",
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "Invalid size. Must be 48, 75, or 96"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (missing fields, invalid size)
- `500` - Server error (API not configured, cart creation failed)
- `503` - Storefront API not available

## Testing

### Test Cart Creation

```bash
# Test with curl
curl -X POST https://your-backend.onrender.com/api/create-cart \
  -H "Content-Type: application/json" \
  -d '{
    "size": 75,
    "quantity": 1,
    "customization_id": "test-123",
    "addons": {
      "stand": true,
      "mounting_dots": false
    }
  }'
```

Expected response:
```json
{
  "checkout_url": "https://...",
  "cart_id": "gid://shopify/Cart/...",
  "customization_id": "test-123",
  "success": true
}
```

### Test Full Checkout Flow

1. Open your frontend
2. Upload an image and adjust settings
3. Click "Checkout"
4. Should redirect to Shopify checkout
5. Complete test order (use Shopify test credit card: `1` for Visa)
6. Verify webhook is received
7. Check `orders.json` for order metadata

### Debug Checklist

If cart creation fails:

1. **Check environment variables** on Render
   - `SHOPIFY_SHOP_DOMAIN` format: `yourstore.myshopify.com`
   - `SHOPIFY_STOREFRONT_TOKEN` is set (32+ chars)
   - Variant GIDs are set for each size

2. **Check Render logs**
   ```
   Settings → Logs → View recent logs
   ```
   Look for:
   - "✅ Shopify Storefront API initialized"
   - "🛒 Creating cart with variant..."
   - Any error messages

3. **Test Storefront API directly**
   Use GraphiQL or Postman to test the Storefront API:
   ```graphql
   mutation {
     cartCreate(input: {
       lines: [{
         merchandiseId: "gid://shopify/ProductVariant/YOUR_VARIANT_ID"
         quantity: 1
       }]
     }) {
       cart {
         id
         checkoutUrl
       }
       userErrors {
         field
         message
       }
     }
   }
   ```

4. **Verify variant IDs are correct**
   - Must be GraphQL GIDs: `gid://shopify/ProductVariant/12345`
   - Must exist and be active in your Shopify store

## Webhook Processing

After payment, Shopify sends webhook to `/webhooks/orders/paid`:

1. Backend verifies HMAC signature
2. Extracts `customization_id` from line item attributes
3. Retrieves files from `orders/{customization_id}/`
4. (Optional) Uploads files to Shopify or sends via email
5. Marks order as ready for fulfillment

### Current Webhook Handler

The existing `webhook_handlers.py` already handles this. Make sure it's imported:

```python
# In server.py
from webhook_handlers import handle_order_paid
```

## Production Considerations

### 1. Error Handling

- Handle network timeouts (Storefront API calls)
- Validate all user inputs server-side
- Log all cart creation attempts
- Monitor failed cart creations

### 2. Security

- Never expose Storefront token in frontend
- Always verify webhook HMAC signatures
- Validate `customization_id` exists before creating cart
- Rate limit cart creation endpoint

### 3. Monitoring

Track these metrics:
- Cart creation success rate
- Checkout abandonment rate
- Webhook delivery success rate
- Average time from cart creation to order payment

### 4. File Storage

Current implementation stores files in `orders/` directory. For production:
- Consider using S3, Google Cloud Storage, or Shopify Files API
- Set up automatic cleanup of old/abandoned orders
- Implement file size limits

## Troubleshooting

### "Shopify Storefront API not configured"
- Check `SHOPIFY_SHOP_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` are set
- Verify token is Storefront API token (not Admin API)

### "Variant for size 75x75 not configured"
- Set environment variable: `SHOPIFY_VARIANT_75=gid://shopify/ProductVariant/...`

### "Failed to create cart"
- Check Render logs for detailed error
- Verify variant GID is correct
- Test Storefront API directly with GraphiQL

### Checkout URL doesn't load
- Verify `SHOPIFY_SHOP_DOMAIN` matches your store
- Check if variants are active/available
- Try creating cart manually via GraphiQL

### Webhook not received
- Verify webhook URL is accessible (test with curl)
- Check webhook secret matches `SHOPIFY_WEBHOOK_SECRET`
- View webhook delivery attempts in Shopify Admin

## Additional Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Cart API Reference](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)
- [Webhook Setup Guide](https://shopify.dev/docs/apps/webhooks)
- [Express Checkout Options](https://help.shopify.com/en/manual/payments/shop-pay)

## Next Steps

1. ✅ Set up environment variables
2. ✅ Deploy backend changes
3. ✅ Configure webhooks
4. 🔧 Update frontend checkout button
5. 🧪 Test full checkout flow
6. 📊 Monitor cart creation and order completion rates

---

**Need Help?** Check Render logs and Shopify webhook delivery logs for detailed error messages.



