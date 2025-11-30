#!/usr/bin/env python3
"""
Helper script to get Shopify store URL and product/variant IDs
This will help you complete Step 4 of the setup
"""
import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv('SHOPIFY_API_KEY')
api_secret = os.getenv('SHOPIFY_API_SECRET')
store_url = os.getenv('SHOPIFY_STORE_URL')

if not api_key or not api_secret or not store_url:
    print("❌ Error: SHOPIFY_API_KEY, SHOPIFY_API_SECRET, and SHOPIFY_STORE_URL must be set in .env file")
    sys.exit(1)

print("🔍 Fetching Shopify information...")
print(f"Store: {store_url}")
print(f"API Key: {api_key[:10]}...")
print()

# Use REST API directly
api_version = os.getenv('SHOPIFY_API_VERSION', '2024-01')
base_url = f"https://{api_key}:{api_secret}@{store_url}/admin/api/{api_version}"

try:
    # Get products
    response = requests.get(f"{base_url}/products.json", timeout=10)
    
    if response.status_code == 401:
        print("❌ Authentication failed. Check your API credentials.")
        sys.exit(1)
    elif response.status_code != 200:
        print(f"❌ Error: {response.status_code} - {response.text[:200]}")
        sys.exit(1)
    
    data = response.json()
    products = data.get('products', [])
    
    if not products:
        print("⚠️  No products found in your store.")
        print("   You need to create products first in Shopify Admin:")
        print("   1. Go to Products → Add product")
        print("   2. Create 'Custom 3D Album Cover Mosaic' with variants:")
        print("      - 48×48 Grid")
        print("      - 75×75 Grid")
        print("      - 96×96 Grid")
        print("   3. Create 'Display Stand' product")
        print("   4. Create 'Wall Mounting Dots' product")
        print()
        print("   Then run this script again to get the IDs.")
        sys.exit(0)
    
    print("=" * 60)
    print("📦 PRODUCTS AND VARIANTS")
    print("=" * 60)
    print()
    
    print(f"Found {len(products)} product(s):\n")
    
    for product in products:
        print(f"📦 Product: {product['title']}")
        print(f"   ID: {product['id']}")
        print(f"   Variants:")
        
        variants = product.get('variants', [])
        for variant in variants:
            print(f"      - {variant['title']}: ID = {variant['id']}")
        print()
    
    # Look for specific products
    print("=" * 60)
    print("🎯 VALUES FOR YOUR .env FILE")
    print("=" * 60)
    print()
    
    main_product = None
    stand_product = None
    mounting_product = None
    
    for product in products:
        title_lower = product['title'].lower()
        if 'album' in title_lower or 'mosaic' in title_lower or 'cover' in title_lower or '3d' in title_lower:
            main_product = product
        if 'stand' in title_lower:
            stand_product = product
        if 'mounting' in title_lower or 'dots' in title_lower or 'wall' in title_lower:
            mounting_product = product
    
    print("Copy these values into your .env file:\n")
    print("# Main Product")
    if main_product:
        print(f"SHOPIFY_PRODUCT_ID={main_product['id']}")
        variants = main_product.get('variants', [])
        for variant in variants:
            title = variant['title'].lower()
            if '48' in title:
                print(f"SHOPIFY_VARIANT_48={variant['id']}")
            elif '75' in title:
                print(f"SHOPIFY_VARIANT_75={variant['id']}")
            elif '96' in title:
                print(f"SHOPIFY_VARIANT_96={variant['id']}")
    else:
        print("# Create 'Custom 3D Album Cover Mosaic' product first")
        print("SHOPIFY_PRODUCT_ID=your_product_id_here")
        print("SHOPIFY_VARIANT_48=variant_id_for_48x48")
        print("SHOPIFY_VARIANT_75=variant_id_for_75x75")
        print("SHOPIFY_VARIANT_96=variant_id_for_96x96")
    
    print()
    print("# Add-on Products")
    if stand_product:
        variants = stand_product.get('variants', [])
        if variants:
            print(f"SHOPIFY_VARIANT_STAND={variants[0]['id']}")
        else:
            print("# Display Stand has no variants")
    else:
        print("# Create 'Display Stand' product first")
        print("SHOPIFY_VARIANT_STAND=variant_id_for_stand")
    
    if mounting_product:
        variants = mounting_product.get('variants', [])
        if variants:
            print(f"SHOPIFY_VARIANT_MOUNTING={variants[0]['id']}")
        else:
            print("# Wall Mounting Dots has no variants")
    else:
        print("# Create 'Wall Mounting Dots' product first")
        print("SHOPIFY_VARIANT_MOUNTING=variant_id_for_mounting_dots")
    
    print()
    print("=" * 60)
    print("✅ Copy the values above into your .env file")
    print("=" * 60)
    
except requests.exceptions.RequestException as e:
    print(f"❌ Error connecting to Shopify: {e}")
    print(f"   Check your internet connection and API credentials")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
