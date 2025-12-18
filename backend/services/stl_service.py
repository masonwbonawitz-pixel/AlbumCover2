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


