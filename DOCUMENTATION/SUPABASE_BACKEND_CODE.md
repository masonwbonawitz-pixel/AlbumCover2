# Supabase Backend Code

This document contains all the Python code needed to integrate Supabase with your Flask backend.

---

## File Structure

```
backend/
├── .env                    # Environment variables
├── requirements.txt        # Python dependencies
├── config.py              # Supabase configuration
├── supabase_client.py     # Supabase client wrapper
├── server.py              # Main Flask application (updated)
└── services/
    ├── __init__.py
    ├── prices_service.py
    ├── content_service.py
    ├── images_service.py
    ├── orders_service.py
    └── stl_service.py
```

---

## 1. Configuration (`config.py`)

```python
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Supabase configuration"""
    
    # Supabase credentials
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
    
    # Storage buckets
    PRODUCT_IMAGES_BUCKET = os.getenv('SUPABASE_PRODUCT_IMAGES_BUCKET', 'product-images')
    STL_FILES_BUCKET = os.getenv('SUPABASE_STL_FILES_BUCKET', 'stl-files')
    ORDER_FILES_BUCKET = os.getenv('SUPABASE_ORDER_FILES_BUCKET', 'order-files')
    
    # Flask config
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size
    
    @staticmethod
    def validate():
        """Validate that all required config values are set"""
        required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY']
        missing = [key for key in required if not getattr(Config, key)]
        
        if missing:
            raise ValueError(f"Missing required config: {', '.join(missing)}")
        
        print("✅ Supabase configuration validated")
```

---

## 2. Supabase Client (`supabase_client.py`)

```python
from supabase import create_client, Client
from config import Config

class SupabaseClient:
    """Singleton Supabase client wrapper"""
    
    _instance = None
    _client: Client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize Supabase client"""
        Config.validate()
        
        # Create client with service key for admin operations
        self._client = create_client(
            Config.SUPABASE_URL,
            Config.SUPABASE_SERVICE_KEY
        )
        
        print("✅ Supabase client initialized")
    
    @property
    def client(self) -> Client:
        """Get Supabase client instance"""
        return self._client
    
    # Convenience methods for storage
    def upload_file(self, bucket: str, path: str, file_data: bytes, content_type: str = None):
        """Upload file to Supabase storage"""
        options = {}
        if content_type:
            options['content-type'] = content_type
        
        result = self._client.storage.from_(bucket).upload(
            path=path,
            file=file_data,
            file_options=options
        )
        return result
    
    def get_public_url(self, bucket: str, path: str) -> str:
        """Get public URL for a file"""
        result = self._client.storage.from_(bucket).get_public_url(path)
        return result
    
    def download_file(self, bucket: str, path: str) -> bytes:
        """Download file from storage"""
        result = self._client.storage.from_(bucket).download(path)
        return result
    
    def delete_file(self, bucket: str, path: str):
        """Delete file from storage"""
        result = self._client.storage.from_(bucket).remove([path])
        return result
    
    def list_files(self, bucket: str, path: str = ''):
        """List files in a bucket"""
        result = self._client.storage.from_(bucket).list(path)
        return result


# Create singleton instance
supabase = SupabaseClient()
```

---

## 3. Prices Service (`services/prices_service.py`)

```python
from supabase_client import supabase

class PricesService:
    """Service for managing prices"""
    
    @staticmethod
    def get_all_prices():
        """Get all prices as a dictionary"""
        response = supabase.client.table('prices').select('*').execute()
        
        # Convert to dictionary format
        prices = {}
        for row in response.data:
            prices[row['grid_size']] = float(row['price'])
        
        return prices
    
    @staticmethod
    def update_prices(prices_data: dict):
        """Update multiple prices"""
        for grid_size, price in prices_data.items():
            supabase.client.table('prices').update({
                'price': price
            }).eq('grid_size', grid_size).execute()
        
        return PricesService.get_all_prices()
    
    @staticmethod
    def get_price(grid_size: str):
        """Get price for specific grid size"""
        response = supabase.client.table('prices').select('price').eq(
            'grid_size', grid_size
        ).single().execute()
        
        return float(response.data['price']) if response.data else None
```

---

## 4. Content Service (`services/content_service.py`)

```python
from supabase_client import supabase

class ContentService:
    """Service for managing content"""
    
    @staticmethod
    def get_all_content():
        """Get all content as a dictionary"""
        response = supabase.client.table('content').select('*').execute()
        
        # Convert to dictionary format
        content = {}
        for row in response.data:
            content[row['key']] = row['value']
        
        return content
    
    @staticmethod
    def update_content(content_data: dict):
        """Update multiple content entries"""
        for key, value in content_data.items():
            # Try to update existing, if not found, insert new
            existing = supabase.client.table('content').select('id').eq('key', key).execute()
            
            if existing.data:
                supabase.client.table('content').update({
                    'value': value
                }).eq('key', key).execute()
            else:
                supabase.client.table('content').insert({
                    'key': key,
                    'value': value
                }).execute()
        
        return ContentService.get_all_content()
    
    @staticmethod
    def get_content(key: str):
        """Get specific content by key"""
        response = supabase.client.table('content').select('value').eq(
            'key', key
        ).single().execute()
        
        return response.data['value'] if response.data else None
```

---

## 5. Images Service (`services/images_service.py`)

```python
import uuid
from config import Config
from supabase_client import supabase

class ImagesService:
    """Service for managing product images"""
    
    @staticmethod
    def get_all_images():
        """Get all product image URLs"""
        response = supabase.client.table('product_images').select('*').execute()
        
        # Convert to dictionary format
        images = {}
        for row in response.data:
            images[row['key']] = row['image_url']
        
        return images
    
    @staticmethod
    def upload_image(key: str, file_data: bytes, content_type: str = 'image/png'):
        """Upload product image and update database"""
        # Generate unique filename
        file_extension = content_type.split('/')[-1]
        filename = f"{key}_{uuid.uuid4().hex[:8]}.{file_extension}"
        storage_path = f"product_images/{filename}"
        
        # Upload to Supabase storage
        supabase.upload_file(
            bucket=Config.PRODUCT_IMAGES_BUCKET,
            path=storage_path,
            file_data=file_data,
            content_type=content_type
        )
        
        # Get public URL
        public_url = supabase.get_public_url(
            bucket=Config.PRODUCT_IMAGES_BUCKET,
            path=storage_path
        )
        
        # Update database
        supabase.client.table('product_images').update({
            'image_url': public_url,
            'storage_path': storage_path
        }).eq('key', key).execute()
        
        return public_url
    
    @staticmethod
    def get_image_url(key: str):
        """Get image URL for specific product"""
        response = supabase.client.table('product_images').select('image_url').eq(
            'key', key
        ).single().execute()
        
        return response.data['image_url'] if response.data else None
    
    @staticmethod
    def delete_old_image(key: str):
        """Delete old image from storage before uploading new one"""
        response = supabase.client.table('product_images').select('storage_path').eq(
            'key', key
        ).single().execute()
        
        if response.data and response.data.get('storage_path'):
            try:
                supabase.delete_file(
                    bucket=Config.PRODUCT_IMAGES_BUCKET,
                    path=response.data['storage_path']
                )
            except Exception as e:
                print(f"Could not delete old image: {e}")
```

---

## 6. Orders Service (`services/orders_service.py`)

```python
import uuid
from datetime import datetime
from config import Config
from supabase_client import supabase

class OrdersService:
    """Service for managing orders"""
    
    @staticmethod
    def create_order(order_data: dict, files: dict):
        """Create new order with files"""
        order_id = order_data.get('order_id') or str(uuid.uuid4())
        
        # Upload files to storage
        file_paths = {}
        for file_type, file_data in files.items():
            storage_path = f"orders/{order_id}/{file_type}"
            
            supabase.upload_file(
                bucket=Config.ORDER_FILES_BUCKET,
                path=storage_path,
                file_data=file_data
            )
            
            file_paths[f"{file_type}_file_path"] = storage_path
        
        # Prepare order data for database
        db_order = {
            'order_id': order_id,
            'grid_size': order_data['grid_size'],
            'dimensions': order_data['dimensions'],
            'base_price': order_data['base_price'],
            'stand_selected': order_data.get('stand_selected', False),
            'mounting_selected': order_data.get('mounting_selected', False),
            'total_price': order_data['total_price'],
            'addons': order_data.get('addons', []),
            'completed': False,
            **file_paths
        }
        
        # Insert into database
        response = supabase.client.table('orders').insert(db_order).execute()
        
        return response.data[0] if response.data else None
    
    @staticmethod
    def get_all_orders():
        """Get all orders sorted by timestamp (newest first)"""
        response = supabase.client.table('orders').select('*').order(
            'timestamp', desc=True
        ).execute()
        
        return response.data
    
    @staticmethod
    def get_order(order_id: str):
        """Get specific order by order_id"""
        response = supabase.client.table('orders').select('*').eq(
            'order_id', order_id
        ).single().execute()
        
        return response.data if response.data else None
    
    @staticmethod
    def update_order(order_id: str, update_data: dict):
        """Update order (e.g., mark as completed)"""
        response = supabase.client.table('orders').update(update_data).eq(
            'order_id', order_id
        ).execute()
        
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_order(order_id: str):
        """Delete order and associated files"""
        # Get order to find file paths
        order = OrdersService.get_order(order_id)
        
        if not order:
            return False
        
        # Delete files from storage
        for key in ['obj_file_path', 'mtl_file_path', 'png_file_path', 'stl_file_path']:
            if order.get(key):
                try:
                    supabase.delete_file(
                        bucket=Config.ORDER_FILES_BUCKET,
                        path=order[key]
                    )
                except Exception as e:
                    print(f"Could not delete file {key}: {e}")
        
        # Delete order from database
        supabase.client.table('orders').delete().eq('order_id', order_id).execute()
        
        return True
    
    @staticmethod
    def download_order_file(order_id: str, file_type: str):
        """Download order file"""
        order = OrdersService.get_order(order_id)
        
        if not order:
            return None
        
        file_path_key = f"{file_type}_file_path"
        file_path = order.get(file_path_key)
        
        if not file_path:
            return None
        
        return supabase.download_file(
            bucket=Config.ORDER_FILES_BUCKET,
            path=file_path
        )
```

---

## 7. STL Service (`services/stl_service.py`)

```python
import uuid
from config import Config
from supabase_client import supabase

class STLService:
    """Service for managing STL files"""
    
    @staticmethod
    def get_stl_status():
        """Get status of all STL files (which ones exist)"""
        response = supabase.client.table('stl_files').select('*').execute()
        
        # Convert to dictionary format
        status = {}
        for row in response.data:
            status[f"{row['size']}x{row['size']}"] = bool(row['file_path'])
        
        return status
    
    @staticmethod
    def upload_stl(size: str, file_data: bytes):
        """Upload STL file for specific grid size"""
        # Generate filename
        filename = f"{size}x{size}_grid.stl"
        storage_path = f"stl_files/{filename}"
        
        # Upload to Supabase storage
        supabase.upload_file(
            bucket=Config.STL_FILES_BUCKET,
            path=storage_path,
            file_data=file_data,
            content_type='application/octet-stream'
        )
        
        # Get public URL
        public_url = supabase.get_public_url(
            bucket=Config.STL_FILES_BUCKET,
            path=storage_path
        )
        
        # Update database
        supabase.client.table('stl_files').update({
            'file_path': public_url,
            'storage_path': storage_path
        }).eq('size', size).execute()
        
        return filename
    
    @staticmethod
    def get_stl_file(size: str):
        """Download STL file for specific grid size"""
        response = supabase.client.table('stl_files').select('storage_path').eq(
            'size', size
        ).single().execute()
        
        if not response.data or not response.data.get('storage_path'):
            return None
        
        return supabase.download_file(
            bucket=Config.STL_FILES_BUCKET,
            path=response.data['storage_path']
        )
    
    @staticmethod
    def get_stl_url(size: str):
        """Get public URL for STL file"""
        response = supabase.client.table('stl_files').select('file_path').eq(
            'size', size
        ).single().execute()
        
        return response.data['file_path'] if response.data else None
```

---

## 8. Services Init (`services/__init__.py`)

```python
from .prices_service import PricesService
from .content_service import ContentService
from .images_service import ImagesService
from .orders_service import OrdersService
from .stl_service import STLService

__all__ = [
    'PricesService',
    'ContentService',
    'ImagesService',
    'OrdersService',
    'STLService'
]
```

---

## 9. Updated Requirements (`requirements.txt`)

```
Flask==3.0.0
Flask-CORS==4.0.0
Pillow==10.0.0
numpy==1.24.0
trimesh==4.0.0
supabase==2.3.0
python-dotenv==1.0.0
```

---

## Next Steps

1. Create these files in your backend directory
2. Install dependencies: `pip install -r requirements.txt`
3. See `SUPABASE_FLASK_ROUTES.md` for updated Flask routes
4. Test each service individually before integrating

