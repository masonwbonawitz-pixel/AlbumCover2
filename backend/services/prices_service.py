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


