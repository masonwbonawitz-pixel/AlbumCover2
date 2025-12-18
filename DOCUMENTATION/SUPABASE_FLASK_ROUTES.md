# Flask Routes with Supabase Integration

This document shows how to update your Flask routes to use Supabase instead of JSON files.

---

## Updated `server.py`

```python
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import uuid
from datetime import datetime

# Import Supabase services
from config import Config
from services import (
    PricesService,
    ContentService,
    ImagesService,
    OrdersService,
    STLService
)

# Import your existing processing functions
# from your_processing_module import process_stl_to_obj, etc.

app = Flask(__name__)
CORS(app)

# Load configuration
app.config.from_object(Config)

# ============================================================================
# PUBLIC API ENDPOINTS
# ============================================================================

@app.route('/api/prices', methods=['GET'])
def get_prices():
    """Get all prices"""
    try:
        prices = PricesService.get_all_prices()
        return jsonify(prices), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/images', methods=['GET'])
def get_images():
    """Get product image URLs"""
    try:
        images = ImagesService.get_all_images()
        return jsonify(images), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/content', methods=['GET'])
def get_content():
    """Get all content"""
    try:
        content = ContentService.get_all_content()
        return jsonify(content), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get-stl/<size>', methods=['GET'])
def get_stl(size):
    """Get STL file for specified grid size"""
    try:
        # Validate size
        if size not in ['48', '75', '96']:
            return jsonify({'error': 'Invalid grid size'}), 400
        
        # Download from Supabase
        stl_data = STLService.get_stl_file(size)
        
        if not stl_data:
            return jsonify({'error': 'STL file not found'}), 404
        
        # Return as file
        return send_file(
            io.BytesIO(stl_data),
            mimetype='application/octet-stream',
            as_attachment=True,
            download_name=f'{size}x{size}_grid.stl'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/generate-obj', methods=['POST'])
def generate_obj():
    """Generate OBJ and MTL files from STL and PNG"""
    try:
        # Get uploaded files
        stl_file = request.files.get('stl')
        png_file = request.files.get('png')
        grid_size = request.form.get('grid_size')
        
        if not stl_file or not png_file or not grid_size:
            return jsonify({'error': 'Missing required files or parameters'}), 400
        
        # Read file data
        stl_data = stl_file.read()
        png_data = png_file.read()
        
        # Process files (your existing processing logic)
        # obj_data, mtl_data = process_stl_to_obj(stl_data, png_data, grid_size)
        
        # For now, return placeholder
        # TODO: Implement your OBJ/MTL generation logic here
        
        return jsonify({
            'message': 'Processing complete',
            'note': 'Implement your OBJ/MTL generation here'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/upload-for-checkout', methods=['POST'])
def upload_for_checkout():
    """Process order and save files"""
    try:
        # Get uploaded files
        stl_file = request.files.get('stl')
        png_file = request.files.get('png')
        
        # Get form data
        grid_size = int(request.form.get('grid_size'))
        stand_selected = request.form.get('stand_selected') == 'true'
        mounting_selected = request.form.get('mounting_selected') == 'true'
        total_price = float(request.form.get('total_price'))
        
        if not stl_file or not png_file:
            return jsonify({'error': 'Missing required files'}), 400
        
        # Generate order ID
        order_id = str(uuid.uuid4())
        
        # Get base price
        prices = PricesService.get_all_prices()
        base_price = prices.get(f'{grid_size}x{grid_size}', 0)
        
        # Calculate addons
        addons = []
        if stand_selected:
            addons.append('Stand')
        if mounting_selected:
            addons.append('Wall Mounting Dots')
        
        # Prepare order data
        order_data = {
            'order_id': order_id,
            'grid_size': grid_size,
            'dimensions': f'{grid_size}×{grid_size}',
            'base_price': base_price,
            'stand_selected': stand_selected,
            'mounting_selected': mounting_selected,
            'total_price': total_price,
            'addons': addons
        }
        
        # Read file data
        stl_data = stl_file.read()
        png_data = png_file.read()
        
        # Process to generate OBJ and MTL
        # obj_data, mtl_data = process_stl_to_obj(stl_data, png_data, grid_size)
        # For now, use placeholder
        obj_data = b'# OBJ file placeholder'
        mtl_data = b'# MTL file placeholder'
        
        # Prepare files for upload
        files = {
            'model.obj': obj_data,
            'model.mtl': mtl_data,
            'original.png': png_data,
            'model.stl': stl_data
        }
        
        # Create order in Supabase
        order = OrdersService.create_order(order_data, files)
        
        return jsonify({
            'order_id': order_id,
            'price': total_price,
            'grid_size': grid_size,
            'message': 'Order prepared successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# ADMIN API ENDPOINTS
# ============================================================================

@app.route('/admin/prices/api', methods=['GET'])
def admin_get_prices():
    """Get prices (admin view)"""
    return get_prices()


@app.route('/admin/prices/api', methods=['POST'])
def admin_update_prices():
    """Update prices"""
    try:
        prices_data = request.json
        
        if not prices_data:
            return jsonify({'error': 'No price data provided'}), 400
        
        updated_prices = PricesService.update_prices(prices_data)
        
        return jsonify({
            'success': True,
            'prices': updated_prices
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/images/api', methods=['GET'])
def admin_get_images():
    """Get product images (admin view)"""
    return get_images()


@app.route('/admin/images/api', methods=['POST'])
def admin_upload_image():
    """Upload product image"""
    try:
        image_file = request.files.get('image')
        key = request.form.get('key')
        
        if not image_file or not key:
            return jsonify({'error': 'Missing image or key'}), 400
        
        if key not in ['stand', 'wall_mounting_dots']:
            return jsonify({'error': 'Invalid image key'}), 400
        
        # Read image data
        image_data = image_file.read()
        content_type = image_file.content_type or 'image/png'
        
        # Delete old image first
        ImagesService.delete_old_image(key)
        
        # Upload new image
        image_url = ImagesService.upload_image(key, image_data, content_type)
        
        return jsonify({
            'success': True,
            'imageUrl': image_url
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/content/api', methods=['GET'])
def admin_get_content():
    """Get content (admin view)"""
    return get_content()


@app.route('/admin/content/api', methods=['POST'])
def admin_update_content():
    """Update content"""
    try:
        content_data = request.json
        
        if not content_data:
            return jsonify({'error': 'No content data provided'}), 400
        
        updated_content = ContentService.update_content(content_data)
        
        return jsonify({
            'success': True,
            'content': updated_content
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/stl/api', methods=['GET'])
def admin_get_stl_status():
    """Get STL file status"""
    try:
        status = STLService.get_stl_status()
        return jsonify(status), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/stl/api', methods=['POST'])
def admin_upload_stl():
    """Upload STL file"""
    try:
        stl_file = request.files.get('stl')
        size = request.form.get('size')
        
        if not stl_file or not size:
            return jsonify({'error': 'Missing STL file or size'}), 400
        
        if size not in ['48', '75', '96']:
            return jsonify({'error': 'Invalid size'}), 400
        
        # Read STL data
        stl_data = stl_file.read()
        
        # Upload to Supabase
        filename = STLService.upload_stl(size, stl_data)
        
        return jsonify({
            'success': True,
            'filename': filename
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/orders/api', methods=['GET'])
def admin_get_orders():
    """Get all orders"""
    try:
        orders = OrdersService.get_all_orders()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/orders/api', methods=['POST'])
def admin_update_order():
    """Update order (mark as completed/uncompleted)"""
    try:
        data = request.json
        order_id = data.get('order_id')
        completed = data.get('completed')
        
        if not order_id or completed is None:
            return jsonify({'error': 'Missing order_id or completed status'}), 400
        
        OrdersService.update_order(order_id, {'completed': completed})
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/orders/api', methods=['DELETE'])
def admin_delete_order():
    """Delete an order"""
    try:
        order_id = request.args.get('order_id')
        
        if not order_id:
            return jsonify({'error': 'Missing order_id'}), 400
        
        success = OrdersService.delete_order(order_id)
        
        if not success:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin/orders/download/<order_id>/<filename>', methods=['GET'])
def admin_download_order_file(order_id, filename):
    """Download order file"""
    try:
        # Map filename to file type
        file_type_map = {
            'model.obj': 'obj',
            'model.mtl': 'mtl',
            'original.png': 'png',
            'model.stl': 'stl'
        }
        
        file_type = file_type_map.get(filename)
        
        if not file_type:
            return jsonify({'error': 'Invalid filename'}), 400
        
        # Download from Supabase
        file_data = OrdersService.download_order_file(order_id, file_type)
        
        if not file_data:
            return jsonify({'error': 'File not found'}), 404
        
        # Determine mimetype
        mimetype_map = {
            'obj': 'application/octet-stream',
            'mtl': 'text/plain',
            'png': 'image/png',
            'stl': 'application/octet-stream'
        }
        
        return send_file(
            io.BytesIO(file_data),
            mimetype=mimetype_map.get(file_type, 'application/octet-stream'),
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'database': 'supabase',
        'timestamp': datetime.now().isoformat()
    }), 200


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    print("🚀 Starting Flask server with Supabase backend...")
    print(f"📦 Database: {Config.SUPABASE_URL}")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
```

---

## Key Changes from JSON-based Backend

### 1. **No More JSON File Loading**
Before:
```python
with open('prices.json', 'r') as f:
    prices = json.load(f)
```

After:
```python
prices = PricesService.get_all_prices()
```

### 2. **No More File System Storage**
Before:
```python
os.makedirs(f'orders/{order_id}', exist_ok=True)
with open(f'orders/{order_id}/model.obj', 'wb') as f:
    f.write(obj_data)
```

After:
```python
OrdersService.create_order(order_data, files)
```

### 3. **Automatic Timestamps**
Supabase automatically handles `created_at` and `updated_at` timestamps.

### 4. **Better Error Handling**
All database operations are wrapped in try-except blocks.

### 5. **Scalable File Storage**
Files are stored in Supabase storage buckets instead of local filesystem.

---

## Testing Your Routes

### Test Prices API
```bash
# Get prices
curl http://localhost:5000/api/prices

# Update prices (admin)
curl -X POST http://localhost:5000/admin/prices/api \
  -H "Content-Type: application/json" \
  -d '{"48x48": 29.99, "75x75": 48.99, "96x96": 59.99}'
```

### Test Content API
```bash
# Get content
curl http://localhost:5000/api/content

# Update content (admin)
curl -X POST http://localhost:5000/admin/content/api \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title"}'
```

### Test Orders API
```bash
# Get all orders
curl http://localhost:5000/admin/orders/api

# Update order
curl -X POST http://localhost:5000/admin/orders/api \
  -H "Content-Type: application/json" \
  -d '{"order_id": "abc123", "completed": true}'

# Delete order
curl -X DELETE "http://localhost:5000/admin/orders/api?order_id=abc123"
```

---

## Running the Server

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run server
python server.py
```

You should see:
```
🚀 Starting Flask server with Supabase backend...
📦 Database: https://bfgbukjtxmxufgocqfjf.supabase.co
✅ Supabase configuration validated
✅ Supabase client initialized
 * Running on http://0.0.0.0:5000
```

---

## Next Steps

1. ✅ Copy this `server.py` to your backend directory
2. ✅ Test each endpoint individually
3. 📝 See `SUPABASE_MIGRATION_GUIDE.md` for migrating existing data
4. 📝 See `SUPABASE_FRONTEND_CODE.md` for frontend changes


