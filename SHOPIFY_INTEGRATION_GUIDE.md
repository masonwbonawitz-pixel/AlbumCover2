# 🛒 Shopify Integration Guide

This guide explains how to integrate the 3D Album Cover Mosaic Builder into your Shopify store.

## 📋 Prerequisites

1. **Deploy your Flask backend** to a publicly accessible server (not localhost)
   - Options: Heroku, Railway, Render, DigitalOcean, AWS, etc.
   - Your backend should be accessible at a URL like: `https://your-api-domain.com`

2. **Enable CORS** on your Flask server (already done in `server.py` with `CORS(app)`)

3. **Shopify Admin Access** - You need to be able to edit your theme

## 🚀 Method 1: Using Custom HTML/CSS Code (Recommended)

This method embeds the application directly into a product page using Shopify's custom code feature.

### Step 1: Deploy Your Backend

1. Deploy your Flask server to a hosting service
2. Note your API URL (e.g., `https://your-api-domain.com`)

### Step 2: Host the HTML File

You have two options:

**Option A: Host on your own server/CDN**
- Upload `shopify-embed.html` to your server
- Access it via URL like: `https://your-domain.com/shopify-embed.html`

**Option B: Use Shopify Files (if you have access)**
- Go to Shopify Admin → Settings → Files
- Upload `shopify-embed.html`
- Copy the file URL

### Step 3: Add to Shopify Product Page

1. Go to **Shopify Admin** → **Online Store** → **Themes**
2. Click **Actions** → **Edit code**
3. Navigate to **Templates** → **product.liquid** (or create a new template)
4. Find where you want to add the builder (usually in the product form section)
5. Add this code:

```liquid
{% comment %}
  3D Album Cover Builder - Add this where you want the builder to appear
{% endcomment %}

<div id="album-builder-container" style="margin: 40px 0;">
  <iframe 
    id="album-builder-iframe"
    src="https://your-domain.com/shopify-embed.html"
    style="width: 100%; min-height: 800px; border: none;"
    allow="camera; microphone; fullscreen"
  ></iframe>
</div>

<script>
  // Configure API URL for the embedded app
  window.addEventListener('message', function(event) {
    // Optional: Handle messages from iframe
    if (event.data.type === 'builder-ready') {
      // Builder is ready
    }
  });
  
  // Set API URL when iframe loads
  document.getElementById('album-builder-iframe').addEventListener('load', function() {
    const iframe = this.contentWindow;
    iframe.postMessage({
      type: 'config',
      apiUrl: 'https://your-api-domain.com'  // CHANGE THIS to your API URL
    }, 'https://your-domain.com');
  });
</script>
```

**Important:** Replace:
- `https://your-domain.com/shopify-embed.html` with your actual HTML file URL
- `https://your-api-domain.com` with your actual Flask API URL

## 🚀 Method 2: Direct Embed (No Iframe)

If you prefer to embed the code directly without an iframe:

### Step 1: Create a Custom Section

1. Go to **Shopify Admin** → **Online Store** → **Themes** → **Edit code**
2. Navigate to **Sections**
3. Create a new file: `album-builder.liquid`
4. Copy the entire content from `shopify-embed.html` and paste it into the section file
5. Modify the script section to set the API URL:

```javascript
// At the top of the script section, add:
const API_BASE_URL = 'https://your-api-domain.com';  // CHANGE THIS
```

### Step 2: Add Section to Product Template

1. Go to your product template
2. Add this line where you want the builder:

```liquid
{% section 'album-builder' %}
```

### Step 3: Configure API URL

In the section file, find this line and update it:

```javascript
let API_BASE_URL = container.getAttribute('data-api-url') || 'https://your-api-domain.com';
```

## 🚀 Method 3: Using Shopify App Block (Advanced)

For a more integrated experience, you can create a custom app block:

1. Create a new section file: `sections/album-builder-block.liquid`
2. Add schema settings for API URL configuration
3. Use the same HTML/CSS/JS from `shopify-embed.html`

## 🔧 Configuration

### Setting the API URL

The application looks for the API URL in this order:

1. **Data attribute** on the container:
   ```html
   <div id="album-cover-builder" data-api-url="https://your-api-domain.com">
   ```

2. **Window variable**:
   ```javascript
   window.ALBUM_BUILDER_API_URL = 'https://your-api-domain.com';
   ```

3. **Default** to current origin (for same-domain hosting)

### Example Configuration

```html
<!-- Method 1: Data attribute -->
<div id="album-cover-builder" data-api-url="https://api.yourdomain.com">
  <!-- App content -->
</div>

<!-- Method 2: Window variable -->
<script>
  window.ALBUM_BUILDER_API_URL = 'https://api.yourdomain.com';
</script>
```

## 🔒 Security Considerations

1. **CORS Configuration**: Ensure your Flask server allows requests from your Shopify domain:
   ```python
   from flask_cors import CORS
   CORS(app, origins=["https://your-shop.myshopify.com", "https://your-custom-domain.com"])
   ```

2. **HTTPS**: Always use HTTPS for both your API and Shopify store

3. **API Keys** (Optional): If you want to restrict access, add API key authentication:
   ```python
   @app.route('/generate-obj', methods=['POST'])
   def generate_obj_route():
       api_key = request.headers.get('X-API-Key')
       if api_key != os.environ.get('API_KEY'):
           return jsonify({'error': 'Unauthorized'}), 401
       # ... rest of code
   ```

## 📱 Mobile Responsiveness

The embedded version is already responsive. Test on mobile devices to ensure proper display.

## 🐛 Troubleshooting

### Issue: "Failed to generate file" error

**Solution:**
1. Check that your API URL is correct
2. Verify CORS is enabled on your Flask server
3. Check browser console for specific error messages
4. Ensure your Flask server is running and accessible

### Issue: Iframe not loading

**Solution:**
1. Check that the HTML file URL is accessible
2. Verify there are no CSP (Content Security Policy) restrictions
3. Check browser console for errors

### Issue: CORS errors

**Solution:**
1. Update your Flask server's CORS configuration:
   ```python
   CORS(app, origins=["*"])  # For development
   # Or specify your Shopify domain for production
   CORS(app, origins=["https://your-shop.myshopify.com"])
   ```

### Issue: API requests failing

**Solution:**
1. Test your API directly: `curl -X POST https://your-api-domain.com/generate-obj`
2. Check server logs for errors
3. Verify all required dependencies are installed on your server

## 📝 Example: Complete Integration

Here's a complete example for a product page:

```liquid
{% comment %}
  product.liquid - Add this in your product template
{% endcomment %}

<div class="product-form">
  <!-- Your existing product form -->
  
  <!-- 3D Album Builder -->
  <div class="album-builder-section" style="margin-top: 40px; padding: 20px; background: #f5f5f5;">
    <h2>Customize Your Album Cover</h2>
    
    <iframe 
      id="album-builder"
      src="https://your-domain.com/shopify-embed.html"
      style="width: 100%; min-height: 800px; border: 1px solid #ddd; border-radius: 8px;"
      allow="camera; microphone; fullscreen"
    ></iframe>
    
    <script>
      (function() {
        const iframe = document.getElementById('album-builder');
        const API_URL = 'https://your-api-domain.com';  // CHANGE THIS
        
        iframe.addEventListener('load', function() {
          // Set API URL in iframe
          iframe.contentWindow.ALBUM_BUILDER_API_URL = API_URL;
        });
      })();
    </script>
  </div>
</div>
```

## 🎨 Customization

You can customize the appearance by:

1. **Modifying CSS** in `shopify-embed.html`
2. **Adding Shopify theme variables** for colors/fonts
3. **Adjusting container styles** in your Liquid template

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify your Flask server is running and accessible
3. Test API endpoints directly
4. Check CORS configuration

## 🔄 Updates

To update the builder:
1. Make changes to `shopify-embed.html`
2. Re-upload to your hosting location
3. Clear browser cache if needed

---

**Note:** Make sure to replace all placeholder URLs with your actual domain names before deploying!

