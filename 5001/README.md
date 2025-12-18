# 3D Album Cover Mosaic Builder - Backend

Flask backend for the 3D Album Cover Mosaic Builder with Shopify Storefront API integration.

## Features

- 🎨 STL + PNG → 3MF/OBJ color mapping
- 🛒 Shopify Storefront API cart creation
- 💳 Express checkout support (Shop Pay, Apple Pay, etc.)
- 📦 Webhook handling for order fulfillment
- 🔧 Admin panel for prices, images, and content management

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Shopify credentials:

```bash
cp .env.example .env
# Edit .env with your actual values
```

Required variables:
- `SHOPIFY_SHOP_DOMAIN`
- `SHOPIFY_STOREFRONT_TOKEN`
- `SHOPIFY_VARIANT_48`, `SHOPIFY_VARIANT_75`, `SHOPIFY_VARIANT_96`

### 3. Run the Server

```bash
python server.py
```

Server starts at: http://localhost:5000

### 4. Test Cart Creation

```bash
python3 test_cart_creation.py
```

## File Structure

```
5001/
├── server.py                      # Main Flask application
├── shopify_api.py                 # Admin API wrapper
├── shopify_storefront_api.py      # Storefront API wrapper (cart creation)
├── webhook_handlers.py            # Webhook processing
├── test_cart_creation.py          # Test script for cart API
├── requirements.txt               # Python dependencies
├── prices.json                    # Dynamic pricing configuration
├── images.json                    # Product image mappings
├── content.json                   # Editable text content
├── orders.json                    # Order metadata
├── stl_files/                     # STL templates (48x48, 75x75, 96x96)
├── orders/                        # Customer order files (UUID-based)
├── product_images/                # Uploaded product images
├── SHOPIFY_SETUP.md               # Quick setup guide
└── INTEGRATION_SUMMARY.md         # Implementation details
```

## API Endpoints

### Public Endpoints

- `GET /` - Main application (mobile/desktop detection)
- `GET /mobile` - Force mobile version
- `GET /desktop` - Force desktop version
- `POST /generate` - Generate 3MF file
- `POST /generate-obj` - Generate OBJ/MTL ZIP
- `GET /get-stl/<size>` - Get STL template (48, 75, or 96)
- `GET /api/prices` - Get current prices
- `GET /api/images` - Get product images
- `GET /api/content` - Get editable text content

### Checkout & Cart

- `POST /upload-for-checkout` - Save customization files, returns `order_id`
- `POST /api/create-cart` - **Create Shopify cart, returns `checkout_url`**

### Webhooks

- `POST /webhooks/orders/create` - Order created webhook
- `POST /webhooks/orders/paid` - Order paid webhook (main fulfillment)

### Admin Endpoints

- `GET /admin` - Admin panel
- `GET /admin/prices/api` - Get/edit prices (GET/POST)
- `GET /admin/images/api` - Get/upload images (GET/POST)
- `GET /admin/content/api` - Get/edit text content (GET/POST)
- `GET /admin/stl/api` - Get/upload STL files (GET/POST)
- `GET /admin/orders/api` - Get/update/delete orders (GET/POST/DELETE)
- `GET /admin/orders/download/<order_id>/<filename>` - Download order files

## Shopify Integration

### Cart Creation Flow

1. **User customizes image** on frontend
2. **Frontend saves files**: `POST /upload-for-checkout` → returns `customization_id`
3. **Frontend creates cart**: `POST /api/create-cart` with size, addons, customization_id
4. **Backend creates Shopify cart** via Storefront API
5. **Backend returns** `checkout_url`
6. **Frontend redirects** to Shopify checkout
7. **User completes payment** (express checkout available)
8. **Shopify sends webhook** to `/webhooks/orders/paid`
9. **Backend retrieves files** using `customization_id` from cart attributes

### Configuration

See **SHOPIFY_SETUP.md** for step-by-step configuration instructions.

## Testing

### Test Environment Configuration

```bash
python3 test_cart_creation.py
```

Checks:
- ✅ Environment variables set
- ✅ Storefront API connection
- ✅ Product variants available
- ✅ Cart creation endpoint working

### Test Cart Creation

```bash
curl -X POST http://localhost:5000/api/create-cart \
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

## Deployment

### Deploy to Render

1. Connect GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn server:app`
4. Add environment variables (see `.env.example`)
5. Deploy

### Environment Variables on Render

Go to Dashboard → Environment → Add Environment Variable:

```bash
SHOPIFY_SHOP_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_token_here
SHOPIFY_STOREFRONT_API_VERSION=2025-01
SHOPIFY_VARIANT_48=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_75=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_96=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_STAND=gid://shopify/ProductVariant/...
SHOPIFY_VARIANT_MOUNTING=gid://shopify/ProductVariant/...
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

## Troubleshooting

### "Storefront API not configured"
→ Check `SHOPIFY_SHOP_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` are set

### "Variant not configured"
→ Set `SHOPIFY_VARIANT_XX` environment variables with correct GIDs

### "Failed to create cart"
→ Check logs for detailed error
→ Verify variant IDs are valid and active in Shopify

### Webhook not received
→ Verify webhook URL is accessible
→ Check HMAC secret matches

## Documentation

- **SHOPIFY_SETUP.md** - Quick setup guide (~30 min)
- **INTEGRATION_SUMMARY.md** - Implementation details
- **/DOCUMENTATION/SHOPIFY_STOREFRONT_CART_INTEGRATION.md** - Complete API docs

## Development

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env

# Run server
python server.py
```

Server runs on: http://localhost:5000

### Test Webhooks Locally

Use ngrok to expose local server:

```bash
ngrok http 5000
# Use ngrok URL in Shopify webhook configuration
```

## License

Proprietary - All rights reserved

## Support

For issues or questions:
1. Check logs (Render → Logs tab)
2. Run test script: `python3 test_cart_creation.py`
3. Review documentation in `/DOCUMENTATION/`
4. Check Shopify webhook delivery logs (Admin → Settings → Notifications)



