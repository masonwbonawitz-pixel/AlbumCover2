"""
Supabase Configuration
"""

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


