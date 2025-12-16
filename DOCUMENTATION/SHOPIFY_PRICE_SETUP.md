# Shopify Price Integration Setup

## Overview
Prices are now automatically synced from your Shopify store. The admin panel cannot edit prices - they must be managed in Shopify.

## Setup Instructions

### 1. Set Environment Variables

Create or update your `.env` file in the `5001` directory with the following:

```bash
# Shopify Store Configuration
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_API_TOKEN=30ba18e5fea165e58297dcc58ad3ea7c
SHOPIFY_API_VERSION=2024-01

# Shopify Variant IDs (from your store)
SHOPIFY_VARIANT_48=10470738559281
SHOPIFY_VARIANT_75=10470738952497
SHOPIFY_VARIANT_96=10470739312945
SHOPIFY_VARIANT_STAND=10470741901617
SHOPIFY_VARIANT_MOUNTING=10470742655281
```

**Note:** The variant IDs above are the defaults from your admin panel image. Update them if they differ in your Shopify store.

### 2. How It Works

- **Prices**: Automatically fetched from Shopify using variant IDs
- **Admin Panel**: Price inputs are read-only. Shows current Shopify prices
- **Main App**: Fetches prices from `/api/prices` which pulls from Shopify
- **Checkout**: Uses Shopify Cart API - "Add to Cart" adds items to your Shopify cart

### 3. Updating Prices

To change prices:
1. Go to your Shopify Admin Panel
2. Navigate to Products
3. Edit the variant prices
4. Save - prices will automatically sync to your app (within 5 minutes due to caching)

### 4. Variant IDs

Variant IDs are displayed in the Admin Panel under the "Shopify Variant IDs" section. These IDs are:
- Used to fetch prices from Shopify
- Used when adding items to cart
- Configured via environment variables

### 5. Testing

After setting up:
1. Restart your Flask server
2. Open the admin panel - prices should load from Shopify
3. Open the main app - prices should match Shopify
4. Test "Add to Cart" - should add to Shopify cart

## Troubleshooting

### Prices not loading?
- Check that `SHOPIFY_API_TOKEN` is set correctly
- Check that `SHOPIFY_STORE_URL` is set (without https://)
- Check that variant IDs are correct
- Check server logs for API errors

### Checkout not working?
- Ensure variant IDs match your Shopify store
- Check that Shopify Cart API is accessible from your app
- Verify store URL is correct

### Admin panel shows old prices?
- Prices are cached for 5 minutes
- Refresh the page after updating in Shopify
- Check that API token has read access to products/variants


