# Shopify Storefront Cart Integration - Implementation Summary

## What Was Implemented

### 1. New Files Created

#### `shopify_storefront_api.py`
Complete Shopify Storefront API wrapper with:
- GraphQL query execution
- Cart creation (`cartCreate` mutation)
- Cart line additions (`cartLinesAdd` mutation)  
- Cart retrieval
- Error handling and logging

#### `test_cart_creation.py`
Comprehensive test script that:
- Validates environment variables
- Tests Storefront API connection
- Fetches product variants for configuration
- Tests the `/api/create-cart` endpoint
- Provides detailed debugging output

#### `SHOPIFY_SETUP.md`
Quick setup guide with:
- Step-by-step configuration instructions
- Environment variable checklist
- Troubleshooting tips
- Estimated 30-minute setup time

#### `/DOCUMENTATION/SHOPIFY_STOREFRONT_CART_INTEGRATION.md`
Complete integration documentation with:
- Architecture overview
- Detailed API reference
- Frontend integration examples
- Webhook configuration
- Production considerations

### 2. Modified Files

#### `server.py`
- Added import for `shopify_storefront_api`
- Added new endpoint: `POST /api/create-cart`
- Server-side variant selection based on size
- Addon handling (stand, mounting dots)
- Comprehensive error handling and logging

#### `requirements.txt`
- Added `requests==2.31.0` for HTTP/GraphQL calls

### 3. Backend API Endpoints

#### New: `POST /api/create-cart`
Creates a Shopify cart and returns checkout URL.

**Request:**
```json
{
  "size": 75,
  "quantity": 1,
  "customization_id": "uuid-here",
  "addons": {
    "stand": true,
    "mounting_dots": false
  }
}
```

**Response:**
```json
{
  "checkout_url": "https://store.myshopify.com/cart/c/...",
  "cart_id": "gid://shopify/Cart/...",
  "customization_id": "uuid-here",
  "success": true
}
```

## How It Works

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER CUSTOMIZES IMAGE ON FRONTEND                            │
│    - Upload image                                               │
│    - Adjust grid size (48/75/96)                               │
│    - Select addons (stand, mounting dots)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. FRONTEND SAVES CUSTOMIZATION                                 │
│    POST /upload-for-checkout                                    │
│    - Sends STL + PNG files                                      │
│    - Returns customization_id (UUID)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. FRONTEND CREATES SHOPIFY CART                                │
│    POST /api/create-cart                                        │
│    - Sends size, addons, customization_id                       │
│    - Backend validates and selects correct variant              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND CALLS SHOPIFY STOREFRONT API                         │
│    GraphQL cartCreate mutation                                  │
│    - Creates cart with main product variant                     │
│    - Adds customization_id as line attribute                    │
│    - Adds addon variants if selected                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. SHOPIFY RETURNS CHECKOUT URL                                 │
│    - Cart ID: gid://shopify/Cart/...                           │
│    - Checkout URL: https://store.myshopify.com/cart/c/...     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. FRONTEND REDIRECTS TO SHOPIFY CHECKOUT                       │
│    window.location.href = checkout_url                          │
│    - User sees express checkout options (Shop Pay, Apple Pay)   │
│    - User completes payment                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. SHOPIFY SENDS WEBHOOK                                        │
│    POST /webhooks/orders/paid                                   │
│    - Backend extracts customization_id from order               │
│    - Retrieves files from orders/{customization_id}/            │
│    - (Optional) Emails files or uploads to Shopify              │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### Server-Side Variant Selection
- Frontend sends size (48, 75, 96)
- Backend maps to correct Shopify variant GID
- Prevents frontend tampering with prices

### Customization ID as Cart Attribute
- Small UUID stored in cart: `customization_id=ea061789-...`
- Full files (STL, OBJ, MTL, PNG) stored on backend
- Shopify cart stays lightweight

### Addon Support
- Stand and mounting dots automatically added to cart
- Separate line items with proper variants
- Accurate pricing and inventory tracking

### Express Checkout Ready
- Shop Pay
- Apple Pay
- Google Pay
- Other accelerated checkouts (if enabled in Shopify)

## Environment Variables Required

```bash
# Shopify Storefront API
SHOPIFY_SHOP_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=abc123...
SHOPIFY_STOREFRONT_API_VERSION=2025-01

# Product Variants
SHOPIFY_VARIANT_48=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_75=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_96=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_STAND=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_MOUNTING=gid://shopify/ProductVariant/...

# Webhooks
SHOPIFY_WEBHOOK_SECRET=your_secret
```

## Testing

### 1. Environment Check
```bash
python3 test_cart_creation.py
```

### 2. Manual API Test
```bash
curl -X POST http://localhost:5000/api/create-cart \
  -H "Content-Type: application/json" \
  -d '{"size":75,"quantity":1,"customization_id":"test-123","addons":{"stand":true}}'
```

### 3. Frontend Integration Test
1. Complete image customization
2. Click checkout button
3. Should redirect to Shopify checkout
4. Complete test order
5. Verify webhook delivery

## Frontend Changes Needed

Update your checkout button handler:

```javascript
async function handleCheckout() {
    try {
        // Show loading state
        checkoutButton.disabled = true;
        checkoutButton.textContent = 'Creating cart...';
        
        // 1. Save customization files
        const customizationId = await saveCustomization();
        
        // 2. Create Shopify cart
        const response = await fetch('/api/create-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                size: currentGridSize,
                quantity: 1,
                customization_id: customizationId,
                addons: {
                    stand: document.getElementById('standCheckbox').checked,
                    mounting_dots: document.getElementById('mountingCheckbox').checked
                }
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            alert('Error: ' + data.error);
            return;
        }
        
        // 3. Redirect to checkout
        window.location.href = data.checkout_url;
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to create cart. Please try again.');
    } finally {
        checkoutButton.disabled = false;
        checkoutButton.textContent = 'Checkout';
    }
}
```

## Security Considerations

✅ **Implemented:**
- Environment-based configuration (no hardcoded secrets)
- Server-side variant selection (prevents price tampering)
- Webhook HMAC verification (validates webhook authenticity)
- Input validation (size, quantity, customization_id)

🔒 **Recommended:**
- Rate limiting on `/api/create-cart` endpoint
- Validate customization_id exists before cart creation
- Monitor for cart abandonment and cleanup old files
- Use HTTPS in production (enforce SSL)

## Next Steps

1. **Deploy to Production**
   - Push changes to repository
   - Set environment variables on hosting platform
   - Verify deployment logs

2. **Configure Shopify**
   - Get variant IDs using test script
   - Set up webhook
   - Test with Shopify test orders

3. **Update Frontend**
   - Integrate new checkout flow
   - Add loading states
   - Handle errors gracefully

4. **Test End-to-End**
   - Complete full checkout flow
   - Verify webhook delivery
   - Check file retrieval works

5. **Monitor & Optimize**
   - Track cart creation success rate
   - Monitor checkout abandonment
   - Review error logs regularly

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| "Storefront API not configured" | Set `SHOPIFY_SHOP_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` |
| "Variant not configured" | Set `SHOPIFY_VARIANT_XX` environment variables |
| "Failed to create cart" | Check Render logs; verify variant IDs are correct |
| Checkout URL loads but cart empty | Verify variant is active in Shopify store |
| Webhook not received | Check webhook URL is accessible; verify HMAC secret |

## Files Modified/Created Summary

```
5001/
├── shopify_storefront_api.py      [NEW] - Storefront API wrapper
├── test_cart_creation.py          [NEW] - Test script
├── SHOPIFY_SETUP.md               [NEW] - Quick setup guide
├── INTEGRATION_SUMMARY.md         [NEW] - This file
├── server.py                      [MODIFIED] - Added /api/create-cart
└── requirements.txt               [MODIFIED] - Added requests

DOCUMENTATION/
└── SHOPIFY_STOREFRONT_CART_INTEGRATION.md  [NEW] - Full documentation
```

## Success Metrics

After implementation, you should see:
- ✅ Cart creation success rate > 95%
- ✅ Checkout completion time < 60 seconds
- ✅ Webhook delivery success rate > 98%
- ✅ Express checkout usage > 30% (if enabled)

## Support & Resources

- **Test Script**: `python3 test_cart_creation.py`
- **Quick Setup**: See `SHOPIFY_SETUP.md`
- **Full Docs**: See `/DOCUMENTATION/SHOPIFY_STOREFRONT_CART_INTEGRATION.md`
- **Backend Logs**: Render Dashboard → Logs tab
- **Shopify Webhooks**: Admin → Settings → Notifications → Webhooks
- **Shopify API Docs**: https://shopify.dev/docs/api/storefront

---

**Integration Status**: ✅ Complete - Ready for configuration and testing

**Estimated Configuration Time**: 30 minutes  
**Estimated Testing Time**: 15 minutes  
**Total Time to Production**: ~45 minutes



