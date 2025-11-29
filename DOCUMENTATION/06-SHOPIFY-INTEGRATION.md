# Shopify Integration Guide

This guide explains how to integrate the React application with Shopify for e-commerce functionality.

---

## Integration Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  React App      │ ──────> │  Shopify Store   │ ──────> │  Backend API    │
│  (Frontend)     │         │  (Embedded App)  │         │  (Flask Server) │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

---

## Option 1: Shopify Embedded App (Recommended)

### Setup Steps

#### 1. Create Shopify App

```bash
npm install -g @shopify/cli @shopify/theme
shopify app generate
```

#### 2. App Structure

```
shopify-app/
├── app/
│   ├── components/
│   │   └── AlbumBuilder.jsx
│   ├── pages/
│   │   └── Index.jsx
│   └── App.jsx
├── extensions/
│   └── product-builder/
│       └── blocks/
│           └── album-builder.liquid
└── server/
    └── api/
        └── orders.js
```

#### 3. Embed React App in Shopify

**File: `app/pages/Index.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { AppProvider, Page, Card, Button } from '@shopify/polaris';
import AlbumBuilder from '../components/AlbumBuilder';

function Index() {
  return (
    <Page title="Album Cover Builder">
      <Card sectioned>
        <AlbumBuilder />
      </Card>
    </Page>
  );
}

export default Index;
```

#### 4. Shopify App Proxy Setup

Configure app proxy in `shopify.app.toml`:

```toml
[auth]
redirect_urls = ["https://your-backend.com/auth/callback"]

[webhooks]

[[webhooks.subscriptions]]
topic = "orders/create"
uri = "https://your-backend.com/webhooks/orders"

[[webhooks.subscriptions]]
topic = "orders/paid"
uri = "https://your-backend.com/webhooks/orders/paid"

[app_proxy]
prefix = "apps/album-builder"
subpath = "api"
```

---

## Option 2: Shopify App Proxy (Simpler)

### Setup Steps

#### 1. Create Shopify App Proxy

In Shopify Admin → Apps → App Proxy:

- **Subpath prefix**: `apps`
- **Subpath**: `album-builder`
- **Proxy URL**: `https://your-backend.com/api`

#### 2. Backend Proxy Routes

**File: `server.py` (add these routes)**

```python
@app.route('/apps/album-builder/api/prices', methods=['GET'])
def shopify_proxy_prices():
    """Proxy prices endpoint for Shopify"""
    # Verify Shopify request signature
    if not verify_shopify_request(request):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Return prices
    with open('prices.json', 'r') as f:
        prices = json.load(f)
    return jsonify(prices)

@app.route('/apps/album-builder/api/checkout', methods=['POST'])
def shopify_proxy_checkout():
    """Handle checkout and create Shopify order"""
    # Verify Shopify request
    if not verify_shopify_request(request):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Process order files
    order_id = process_order(request.files)
    
    # Create Shopify draft order
    draft_order = create_shopify_draft_order(order_id, request.form)
    
    # Return checkout URL
    return jsonify({
        'checkout_url': draft_order['checkout_url'],
        'order_id': order_id
    })
```

---

## Option 3: Shopify Product Variants

### Setup

Create a product in Shopify with variants for grid sizes:

**Product**: "Custom Album Cover Mosaic"

**Variants:**
- 48×48 Grid - $29.99
- 75×75 Grid - $48.99
- 96×96 Grid - $59.99

### Add-ons as Separate Products

**Product**: "Display Stand" - $10.00
**Product**: "Wall Mounting Dots" - $5.99

### Integration Flow

```jsx
const CheckoutButton = ({ orderData }) => {
  const addToCart = async () => {
    // Upload order files first
    const result = await apiService.uploadForCheckout(orderData);
    
    // Add to Shopify cart
    const variantId = getVariantIdForGridSize(orderData.gridSize);
    const addons = getAddonVariantIds(orderData);
    
    // Use Shopify Cart API
    await shopifyCart.add([
      {
        id: variantId,
        quantity: 1,
        properties: {
          order_id: result.order_id,
          custom_image: 'uploaded'
        }
      },
      ...addons.map(addon => ({
        id: addon,
        quantity: 1
      }))
    ]);
    
    // Redirect to checkout
    window.location.href = '/cart';
  };
  
  return (
    <button onClick={addToCart}>
      Add to Cart
    </button>
  );
};
```

---

## Shopify Cart API Integration

### File: `src/services/shopifyCart.js`

```jsx
const SHOPIFY_STORE = process.env.REACT_APP_SHOPIFY_STORE_URL;

export const shopifyCart = {
  add: async (items) => {
    const response = await fetch(`${SHOPIFY_STORE}/cart/add.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items
      })
    });
    return response.json();
  },

  get: async () => {
    const response = await fetch(`${SHOPIFY_STORE}/cart.js`);
    return response.json();
  },

  update: async (updates) => {
    const response = await fetch(`${SHOPIFY_STORE}/cart/update.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    return response.json();
  }
};
```

---

## Order Management Integration

### Webhook Handler

**File: `server.py`**

```python
@app.route('/webhooks/orders/paid', methods=['POST'])
def shopify_order_webhook():
    """Handle Shopify order paid webhook"""
    # Verify webhook signature
    if not verify_webhook_signature(request):
        return '', 401
    
    order_data = request.get_json()
    order_id = order_data.get('order_id')
    
    # Find order files by order ID in cart properties
    line_items = order_data.get('line_items', [])
    for item in line_items:
        properties = item.get('properties', {})
        if 'order_id' in properties:
            order_id = properties['order_id']
            # Send files to customer
            send_order_files(order_id, order_data['customer']['email'])
            break
    
    return '', 200
```

---

## File Storage with Shopify Files API

### Upload Files to Shopify

**File: `server.py`**

```python
import shopify

def upload_order_file_to_shopify(order_id, file_path, filename):
    """Upload order file to Shopify Files API"""
    with open(file_path, 'rb') as f:
        file_data = f.read()
    
    # Upload to Shopify Files API
    file_url = shopify.File.create({
        'filename': filename,
        'contents': file_data
    })
    
    return file_url.url
```

---

## Shopify Metafields

### Store Order Data in Metafields

```python
def create_order_with_metafields(order_id, order_data):
    """Create Shopify order with order data in metafields"""
    draft_order = shopify.DraftOrder.create({
        'line_items': [{
            'variant_id': order_data['variant_id'],
            'quantity': 1
        }],
        'metafields': [
            {
                'namespace': 'album_builder',
                'key': 'order_id',
                'value': order_id,
                'type': 'single_line_text_field'
            },
            {
                'namespace': 'album_builder',
                'key': 'grid_size',
                'value': str(order_data['grid_size']),
                'type': 'number_integer'
            },
            {
                'namespace': 'album_builder',
                'key': 'stand_selected',
                'value': str(order_data['stand_selected']),
                'type': 'boolean'
            }
        ]
    })
    
    return draft_order
```

---

## Customer-Facing Integration

### Embed in Product Page

**File: `extensions/product-builder/blocks/album-builder.liquid`**

```liquid
<div id="album-builder-root"></div>

<script>
  window.albumBuilderConfig = {
    apiUrl: '{{ shop.metafields.album_builder.api_url }}',
    shopifyStore: '{{ shop.permanent_domain }}',
    productId: {{ product.id }},
    variants: [
      {% for variant in product.variants %}
      {
        id: {{ variant.id }},
        title: '{{ variant.title }}',
        price: {{ variant.price | divided_by: 100.0 }},
        gridSize: {{ variant.metafields.album_builder.grid_size | default: 75 }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  };
</script>

<script src="{{ 'album-builder.js' | asset_url }}" defer></script>
```

---

## Pricing Integration

### Sync Prices from Shopify

**File: `src/services/shopifyPrices.js`**

```jsx
export const fetchShopifyPrices = async (productId) => {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              metafields(first: 5) {
                edges {
                  node {
                    key
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  
  const response = await fetch(`/apps/album-builder/api/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id: productId } })
  });
  
  const { data } = await response.json();
  return data.product.variants.edges.map(edge => edge.node);
};
```

---

## Checkout Flow

### Complete Integration

```jsx
const CheckoutFlow = () => {
  const handleCheckout = async () => {
    // 1. Generate order files
    const orderResult = await apiService.uploadForCheckout({
      stlFile,
      pngFile,
      gridSize,
      standSelected,
      mountingSelected,
      totalPrice
    });
    
    // 2. Create Shopify cart items
    const cartItems = [
      {
        id: getVariantId(gridSize),
        quantity: 1,
        properties: {
          '_order_id': orderResult.order_id,
          '_custom': 'true'
        }
      }
    ];
    
    if (standSelected) {
      cartItems.push({
        id: STAND_VARIANT_ID,
        quantity: 1
      });
    }
    
    if (mountingSelected) {
      cartItems.push({
        id: MOUNTING_VARIANT_ID,
        quantity: 1
      });
    }
    
    // 3. Add to cart
    await shopifyCart.add({ items: cartItems });
    
    // 4. Redirect to checkout
    window.location.href = '/cart';
  };
  
  return (
    <button onClick={handleCheckout}>
      Add to Cart
    </button>
  );
};
```

---

## Order Fulfillment

### Automatic Fulfillment Setup

1. **Create Fulfillment Service** in Shopify Admin
2. **Set up Webhook** for order creation
3. **Process Order Files** when webhook received
4. **Mark Order as Fulfilled** with file download links

**File: `server.py`**

```python
@app.route('/webhooks/orders/create', methods=['POST'])
def handle_order_creation():
    order = request.get_json()
    
    # Extract order ID from line item properties
    order_id = None
    for item in order.get('line_items', []):
        for prop in item.get('properties', []):
            if prop['name'] == '_order_id':
                order_id = prop['value']
                break
    
    if order_id:
        # Get order files
        order_files = get_order_files(order_id)
        
        # Upload to Shopify Files API
        file_urls = upload_files_to_shopify(order_files)
        
        # Create fulfillment with file links
        create_fulfillment(order['id'], file_urls)
    
    return '', 200
```

---

## Security Considerations

### 1. Request Verification

```python
import hmac
import hashlib

def verify_shopify_request(request):
    """Verify Shopify request signature"""
    hmac_header = request.headers.get('X-Shopify-Hmac-Sha256')
    calculated_hmac = hmac.new(
        SHOPIFY_SECRET.encode(),
        request.data,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(calculated_hmac, hmac_header)
```

### 2. CORS Configuration

```python
from flask_cors import CORS

CORS(app, resources={
    r"/apps/album-builder/*": {
        "origins": ["https://*.myshopify.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type", "X-Shopify-*"]
    }
})
```

---

## Testing Checklist

- [ ] App loads in Shopify admin
- [ ] Product page integration works
- [ ] Prices sync from Shopify
- [ ] Cart functionality works
- [ ] Checkout flow completes
- [ ] Order webhooks receive data
- [ ] Files upload to Shopify
- [ ] Customer receives order files
- [ ] Order fulfillment works

---

## Deployment

### 1. Deploy Backend

```bash
# Deploy Flask backend
gcloud app deploy
# or
heroku create rize-albums-backend
git push heroku main
```

### 2. Deploy React App

```bash
# Build React app
npm run build

# Deploy to Netlify/Vercel
netlify deploy --prod
```

### 3. Configure Shopify App

1. Update app proxy URL to backend URL
2. Configure webhook URLs
3. Set API permissions
4. Test in development store
5. Submit for review

---

## Environment Variables

### Backend (.env)

```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_STORE_URL=your-store.myshopify.com
BACKEND_URL=https://your-backend.com
```

### React App (.env)

```
REACT_APP_SHOPIFY_STORE_URL=https://your-store.myshopify.com
REACT_APP_API_URL=https://your-backend.com
REACT_APP_SHOPIFY_APP_URL=https://your-app.com
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Verify CORS configuration allows Shopify domains
2. **Webhook Failures**: Check webhook signature verification
3. **Cart API Errors**: Ensure cart is accessible (not password-protected)
4. **File Upload Issues**: Check Shopify Files API permissions

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## Resources

- [Shopify App Development Docs](https://shopify.dev/docs/apps)
- [Shopify Cart API](https://shopify.dev/docs/api/storefront/2023-10/queries/cart)
- [Shopify Webhooks](https://shopify.dev/docs/apps/webhooks)
- [Shopify Metafields](https://shopify.dev/docs/apps/custom-data/metafields)

