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

