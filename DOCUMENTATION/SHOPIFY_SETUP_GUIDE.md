# Shopify API Setup Guide

This guide will walk you through setting up Shopify API credentials for your 3D Album Cover Builder integration.

## Prerequisites

- A Shopify store (you already have this)
- Admin access to your Shopify store
- Your backend server URL (for webhooks)

## Step 1: Create a Private App in Shopify

1. **Log in to your Shopify Admin**
   - Go to https://your-store.myshopify.com/admin
   - Log in with your admin credentials

2. **Navigate to Apps**
   - In the left sidebar, click **"Apps"**
   - Scroll down and click **"App and sales channel settings"** (or "Manage private apps" in older versions)
   - Click **"Develop apps"** (or "Private apps" in older versions)

3. **Create a New App**
   - Click **"Create an app"** button
   - Enter a name: `3D Album Builder Integration`
   - Enter your email address (optional but recommended)
   - Click **"Create app"**

4. **Configure API Scopes**
   - Click **"Configure Admin API scopes"**
   - You need to enable these scopes:
     - ✅ `read_products` - To read product and variant information
     - ✅ `write_orders` - To create draft orders (optional, for backup)
     - ✅ `read_orders` - To read order information
     - ✅ `write_files` - To upload order files to Shopify
     - ✅ `read_files` - To read uploaded files
   - Click **"Save"**

5. **Install the App**
   - Click **"Install app"** button
   - Review the permissions and click **"Install"**

## Step 2: Get Your API Credentials

After installing the app, you'll see your API credentials:

1. **API Key (Client ID)**
   - Copy this value - you'll need it for `SHOPIFY_API_KEY`

2. **API Secret Key**
   - Click **"Reveal token once"** to see it
   - Copy this value - you'll need it for `SHOPIFY_API_SECRET`
   - ⚠️ **Important**: Save this immediately - you won't be able to see it again!

3. **Store URL**
   - Your store URL is: `your-store.myshopify.com` (without https://)
   - Use this for `SHOPIFY_STORE_URL`

## Step 3: Get Your Product and Variant IDs

You need to create products/variants in Shopify and get their IDs:

### Option A: Using Shopify Admin (Easier)

1. **Create Your Main Product**
   - Go to **Products** → **Add product**
   - Name: "Custom 3D Album Cover Mosaic"
   - Create variants for each grid size:
     - Variant 1: "48×48 Grid" - Price: $X.XX
     - Variant 2: "75×75 Grid" - Price: $X.XX
     - Variant 3: "96×96 Grid" - Price: $X.XX
   - Save the product

2. **Get Product ID**
   - In the product page URL, you'll see: `/admin/products/1234567890`
   - The number is your `SHOPIFY_PRODUCT_ID`

3. **Get Variant IDs**
   - Click on each variant to edit
   - In the URL, you'll see: `/admin/products/1234567890/variants/9876543210`
   - The last number is your variant ID
   - Save these as:
     - `SHOPIFY_VARIANT_48` = variant ID for 48×48
     - `SHOPIFY_VARIANT_75` = variant ID for 75×75
     - `SHOPIFY_VARIANT_96` = variant ID for 96×96

4. **Create Add-on Products**
   - Create product: "Display Stand" - Get variant ID → `SHOPIFY_VARIANT_STAND`
   - Create product: "Wall Mounting Dots" - Get variant ID → `SHOPIFY_VARIANT_MOUNTING`

### Option B: Using GraphQL Admin API (Advanced)

You can also use the GraphQL API to get IDs programmatically:

```graphql
query {
  products(first: 10, query: "title:Custom 3D Album") {
    edges {
      node {
        id
        title
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
            }
          }
        }
      }
    }
  }
}
```

## Step 4: Set Up Environment Variables

1. **Create a `.env` file** in your project root (copy from `.env.example`)

2. **Add your credentials:**
   ```
   SHOPIFY_STORE_URL=your-store.myshopify.com
   SHOPIFY_API_KEY=your_api_key_here
   SHOPIFY_API_SECRET=your_api_secret_here
   SHOPIFY_API_VERSION=2024-01
   SHOPIFY_PRODUCT_ID=1234567890
   SHOPIFY_VARIANT_48=1111111111
   SHOPIFY_VARIANT_75=2222222222
   SHOPIFY_VARIANT_96=3333333333
   SHOPIFY_VARIANT_STAND=4444444444
   SHOPIFY_VARIANT_MOUNTING=5555555555
   ```

3. **⚠️ Security Note**: Never commit your `.env` file to git! It's already in `.gitignore`

## Step 5: Set Up Webhooks

Webhooks allow Shopify to notify your backend when orders are created or paid.

1. **Get Your Backend URL**
   - Your backend should be accessible at: `https://your-backend-domain.com`
   - Make sure it's using HTTPS (required by Shopify)

2. **Configure Webhooks in Shopify**
   - Go to **Settings** → **Notifications**
   - Scroll down to **"Webhooks"**
   - Click **"Create webhook"**

3. **Create Two Webhooks:**

   **Webhook 1: Order Creation**
   - Event: `Order creation`
   - Format: `JSON`
   - URL: `https://your-backend-domain.com/webhooks/orders/create`
   - API version: `2024-01` (or latest)
   - Click **"Save webhook"**

   **Webhook 2: Order Payment**
   - Event: `Order payment`
   - Format: `JSON`
   - URL: `https://your-backend-domain.com/webhooks/orders/paid`
   - API version: `2024-01` (or latest)
   - Click **"Save webhook"**

## Step 6: Test Your Setup

1. **Test API Connection**
   - Start your backend server
   - Check the logs for any credential errors
   - The server will validate credentials on startup

2. **Test Webhook**
   - Create a test order in your Shopify store
   - Check your backend logs to see if the webhook was received
   - Verify the webhook signature is being validated

## Troubleshooting

### Issue: "Invalid API credentials"
- **Solution**: Double-check your API key and secret in `.env`
- Make sure there are no extra spaces or quotes
- Verify the app is installed and has correct scopes

### Issue: "Webhook signature verification failed"
- **Solution**: Make sure `SHOPIFY_API_SECRET` matches your app's secret
- Verify webhook URL is using HTTPS
- Check that webhook is receiving the correct headers

### Issue: "Product/Variant not found"
- **Solution**: Verify product and variant IDs are correct
- Make sure products are published (not draft)
- Check that variants are active

### Issue: "Insufficient permissions"
- **Solution**: Go back to your app settings and verify all required scopes are enabled
- Reinstall the app if you added new scopes

## Next Steps

After completing this setup:

1. ✅ Your backend can now connect to Shopify
2. ✅ Orders will be automatically processed via webhooks
3. ✅ Files will be uploaded to Shopify after payment
4. ✅ Admin panel can sync with Shopify orders

## Security Best Practices

1. **Never commit `.env` to version control**
2. **Use environment variables in production** (not hardcoded values)
3. **Rotate API keys periodically**
4. **Use HTTPS for all webhook endpoints**
5. **Validate webhook signatures** (already implemented in code)

## Support

If you encounter issues:
1. Check the backend logs for error messages
2. Verify all environment variables are set correctly
3. Test API connection using Shopify's GraphQL Admin API explorer
4. Check webhook delivery status in Shopify Admin → Settings → Notifications → Webhooks

