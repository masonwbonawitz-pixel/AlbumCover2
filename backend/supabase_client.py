"""
Supabase Client Wrapper
"""

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

