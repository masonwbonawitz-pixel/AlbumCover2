# Frontend Integration with Supabase Backend

This document shows how to update your frontend code to work with the new Supabase backend.

**Good news**: Your frontend API calls remain mostly the same! The backend routes haven't changed, only the backend implementation.

---

## What Stays the Same

✅ All API endpoint URLs remain the same
✅ All request/response formats remain the same
✅ Your existing fetch calls work without changes
✅ Admin panel JavaScript works without changes

---

## Minor Changes Needed

### 1. Update Image URLs

Since images are now stored in Supabase storage, the URLs will be fully qualified URLs instead of relative paths.

#### Before (JSON-based):
```javascript
{
  "stand": "/product_images/stand_abc123.png",
  "wall_mounting_dots": "/product_images/mounting_dots_def456.png"
}
```

#### After (Supabase):
```javascript
{
  "stand": "https://bfgbukjtxmxufgocqfjf.supabase.co/storage/v1/object/public/product-images/product_images/stand_abc123.png",
  "wall_mounting_dots": "https://bfgbukjtxmxufgocqfjf.supabase.co/storage/v1/object/public/product-images/product_images/mounting_dots_def456.png"
}
```

Your frontend will automatically handle this since it uses the URLs returned by the API.

---

## Optional: Direct Supabase Client (Frontend)

If you want to use Supabase directly from the frontend (for real-time updates, etc.), here's how:

### Install Supabase JS Client

```bash
npm install @supabase/supabase-js
# or
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Initialize Supabase Client

```javascript
// supabase-client.js
const SUPABASE_URL = 'https://bfgbukjtxmxufgocqfjf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_A2Zsk38UyW76hGWZR7cLCA_phEru3KA...';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
```

### Real-time Price Updates

```javascript
// Listen for price changes in real-time
supabaseClient
  .channel('prices-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'prices'
    },
    (payload) => {
      console.log('Prices updated!', payload);
      // Refresh prices display
      fetchAndDisplayPrices();
    }
  )
  .subscribe();
```

### Real-time Order Updates (Admin Panel)

```javascript
// Admin panel - listen for new orders
supabaseClient
  .channel('orders-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'orders'
    },
    (payload) => {
      console.log('New order received!', payload);
      // Show notification
      showNotification('New order received!');
      // Refresh orders list
      loadOrders();
    }
  )
  .subscribe();
```

---

## API Call Examples (No Changes Needed)

Your existing API calls will continue to work:

### Fetch Prices
```javascript
async function fetchPrices() {
  const response = await fetch('/api/prices');
  const prices = await response.json();
  return prices;
}
```

### Fetch Content
```javascript
async function fetchContent() {
  const response = await fetch('/api/content');
  const content = await response.json();
  return content;
}
```

### Fetch Product Images
```javascript
async function fetchImages() {
  const response = await fetch('/api/images');
  const images = await response.json();
  // images.stand will be full Supabase URL
  // images.wall_mounting_dots will be full Supabase URL
  return images;
}
```

### Upload for Checkout
```javascript
async function uploadForCheckout(files, orderData) {
  const formData = new FormData();
  formData.append('stl', files.stl);
  formData.append('png', files.png);
  formData.append('grid_size', orderData.gridSize);
  formData.append('stand_selected', orderData.standSelected);
  formData.append('mounting_selected', orderData.mountingSelected);
  formData.append('total_price', orderData.totalPrice);

  const response = await fetch('/upload-for-checkout', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result;
}
```

---

## Admin Panel - No Changes Needed

Your admin panel JavaScript will continue to work:

### Update Prices
```javascript
async function savePrices() {
  const prices = {
    '48x48': parseFloat(document.getElementById('price-48').value),
    '75x75': parseFloat(document.getElementById('price-75').value),
    '96x96': parseFloat(document.getElementById('price-96').value),
    'stand': parseFloat(document.getElementById('price-stand').value),
    'wall_mounting_dots': parseFloat(document.getElementById('price-mounting').value)
  };

  const response = await fetch('/admin/prices/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prices)
  });

  const result = await response.json();
  console.log('Prices saved:', result);
}
```

### Upload Product Image
```javascript
async function uploadProductImage(file, key) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', key);

  const response = await fetch('/admin/images/api', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  console.log('Image uploaded:', result.imageUrl);
  
  // Update image display
  document.querySelector(`img[data-key="${key}"]`).src = result.imageUrl;
}
```

### Update Content
```javascript
async function saveContent() {
  const content = {
    title: document.getElementById('content-title').textContent,
    price_subtitle: document.getElementById('content-subtitle').textContent,
    // ... more content fields
  };

  const response = await fetch('/admin/content/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
  });

  const result = await response.json();
  console.log('Content saved:', result);
}
```

### Load Orders
```javascript
async function loadOrders() {
  const response = await fetch('/admin/orders/api');
  const orders = await response.json();
  
  // Display orders
  orders.forEach(order => {
    displayOrder(order);
  });
}
```

### Mark Order as Complete
```javascript
async function toggleOrderComplete(orderId, completed) {
  const response = await fetch('/admin/orders/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderId,
      completed: completed
    })
  });

  const result = await response.json();
  console.log('Order updated:', result);
}
```

### Delete Order
```javascript
async function deleteOrder(orderId) {
  if (!confirm('Are you sure you want to delete this order?')) {
    return;
  }

  const response = await fetch(`/admin/orders/api?order_id=${orderId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Order deleted');
    // Remove from UI
    document.querySelector(`[data-order-id="${orderId}"]`).remove();
  }
}
```

---

## Enhanced Features with Direct Supabase Access

### 1. Real-time Admin Dashboard

```javascript
// admin-realtime.js
function initializeRealtimeUpdates() {
  // Listen for new orders
  supabaseClient
    .channel('admin-orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        // Add new order to list without refresh
        addOrderToList(payload.new);
        
        // Show notification
        showToast('New order received!');
        
        // Play sound (optional)
        playNotificationSound();
      }
    )
    .subscribe();

  // Listen for order updates
  supabaseClient
    .channel('admin-order-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        // Update order in list
        updateOrderInList(payload.new);
      }
    )
    .subscribe();
}

// Call on admin panel load
if (window.location.pathname.includes('admin')) {
  initializeRealtimeUpdates();
}
```

### 2. Real-time Price Updates on Main Site

```javascript
// main-app-realtime.js
function watchPriceChanges() {
  supabaseClient
    .channel('public-prices')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'prices'
      },
      async (payload) => {
        console.log('Prices updated by admin');
        
        // Refetch prices
        const response = await fetch('/api/prices');
        const newPrices = await response.json();
        
        // Update UI
        updatePriceDisplay(newPrices);
      }
    )
    .subscribe();
}

// Initialize on page load
window.addEventListener('load', () => {
  watchPriceChanges();
});
```

### 3. Direct Image Upload to Supabase Storage

```javascript
// Direct upload bypassing backend (optional)
async function uploadImageDirectly(file, bucket, path) {
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

// Usage
const imageUrl = await uploadImageDirectly(
  imageFile,
  'product-images',
  `product_images/stand_${Date.now()}.png`
);
```

---

## Configuration File (Optional)

Create a `config.js` file for frontend configuration:

```javascript
// config.js
const APP_CONFIG = {
  // Supabase
  supabase: {
    url: 'https://bfgbukjtxmxufgocqfjf.supabase.co',
    anonKey: 'sb_publishable_A2Zsk38UyW76hGWZR7cLCA_phEru3KA...'
  },
  
  // API endpoints (backend)
  api: {
    baseUrl: window.location.origin,
    endpoints: {
      prices: '/api/prices',
      content: '/api/content',
      images: '/api/images',
      generateObj: '/generate-obj',
      uploadCheckout: '/upload-for-checkout',
      getStl: (size) => `/get-stl/${size}`
    }
  },
  
  // Storage buckets
  storage: {
    productImages: 'product-images',
    stlFiles: 'stl-files',
    orderFiles: 'order-files'
  }
};

// Make available globally
window.APP_CONFIG = APP_CONFIG;
```

---

## Summary

### ✅ What You DON'T Need to Change:
1. Existing API fetch calls
2. Admin panel save functions
3. Order upload logic
4. Image display code (uses URLs from API)
5. Price calculation logic

### 📝 What You CAN Add (Optional):
1. Real-time updates for admin dashboard
2. Real-time price updates on main site
3. Direct Supabase client for advanced features
4. Better loading states
5. Optimistic UI updates

### 🎯 Recommendation:
Start by keeping your existing frontend code as-is. It will work perfectly with the new Supabase backend. Then gradually add real-time features as needed.

---

## Next Steps

1. ✅ Keep existing frontend code
2. ✅ Test with new backend
3. 📝 Optionally add real-time features
4. 📝 See `SUPABASE_MIGRATION_GUIDE.md` for data migration


