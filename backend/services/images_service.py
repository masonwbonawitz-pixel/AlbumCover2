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

