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


