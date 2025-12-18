#!/usr/bin/env python3
"""
Test script for Shopify Storefront API cart creation
Tests the /api/create-cart endpoint and provides debugging info
"""
import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')
SHOPIFY_SHOP_DOMAIN = os.getenv('SHOPIFY_SHOP_DOMAIN')
SHOPIFY_STOREFRONT_TOKEN = os.getenv('SHOPIFY_STOREFRONT_TOKEN')


def test_environment_variables():
    """Check if all required environment variables are set"""
    print("=" * 60)
    print("🔍 CHECKING ENVIRONMENT VARIABLES")
    print("=" * 60)
    
    required_vars = [
        'SHOPIFY_SHOP_DOMAIN',
        'SHOPIFY_STOREFRONT_TOKEN',
        'SHOPIFY_VARIANT_48',
        'SHOPIFY_VARIANT_75',
        'SHOPIFY_VARIANT_96'
    ]
    
    missing = []
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mask tokens for security
            if 'TOKEN' in var or 'SECRET' in var:
                display_value = value[:8] + '...' + value[-4:] if len(value) > 12 else '***'
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: NOT SET")
            missing.append(var)
    
    print()
    
    if missing:
        print(f"⚠️  Missing {len(missing)} required environment variable(s)")
        print("   Please set these in your .env file or environment")
        return False
    
    print("✅ All required environment variables are set")
    return True


def test_storefront_api_directly():
    """Test Shopify Storefront API connection directly"""
    print("=" * 60)
    print("🔌 TESTING STOREFRONT API CONNECTION")
    print("=" * 60)
    
    if not SHOPIFY_SHOP_DOMAIN or not SHOPIFY_STOREFRONT_TOKEN:
        print("❌ Cannot test: Missing SHOPIFY_SHOP_DOMAIN or SHOPIFY_STOREFRONT_TOKEN")
        return False
    
    # Test with a simple shop query
    url = f"https://{SHOPIFY_SHOP_DOMAIN}/api/2025-01/graphql.json"
    headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    }
    
    query = """
    {
      shop {
        name
        paymentSettings {
          enabledPresentmentCurrencies
        }
      }
    }
    """
    
    try:
        print(f"   URL: {url}")
        print(f"   Token: {SHOPIFY_STOREFRONT_TOKEN[:8]}...{SHOPIFY_STOREFRONT_TOKEN[-4:]}")
        print()
        
        response = requests.post(
            url,
            headers=headers,
            json={'query': query},
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'errors' in data:
                print(f"❌ GraphQL Errors:")
                print(json.dumps(data['errors'], indent=2))
                return False
            
            if 'data' in data and 'shop' in data['data']:
                shop = data['data']['shop']
                print(f"✅ Connected to shop: {shop.get('name')}")
                return True
            else:
                print(f"❌ Unexpected response format:")
                print(json.dumps(data, indent=2))
                return False
        else:
            print(f"❌ Request failed")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False


def test_get_product_variants():
    """Query product variants from Shopify to help with configuration"""
    print("=" * 60)
    print("📦 FETCHING PRODUCT VARIANTS")
    print("=" * 60)
    
    if not SHOPIFY_SHOP_DOMAIN or not SHOPIFY_STOREFRONT_TOKEN:
        print("❌ Cannot query: Missing credentials")
        return
    
    url = f"https://{SHOPIFY_SHOP_DOMAIN}/api/2025-01/graphql.json"
    headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    }
    
    # Query products (adjust search query as needed)
    query = """
    {
      products(first: 10, query: "3D Mosaic") {
        edges {
          node {
            id
            title
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  sku
                }
              }
            }
          }
        }
      }
    }
    """
    
    try:
        response = requests.post(url, headers=headers, json={'query': query}, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'errors' in data:
                print("❌ GraphQL errors:")
                print(json.dumps(data['errors'], indent=2))
                return
            
            products = data.get('data', {}).get('products', {}).get('edges', [])
            
            if not products:
                print("⚠️  No products found matching '3D Mosaic'")
                print("   Tip: Adjust the search query in test_get_product_variants()")
                return
            
            for product_edge in products:
                product = product_edge['node']
                print(f"\n📦 Product: {product['title']}")
                print(f"   ID: {product['id']}")
                
                variants = product.get('variants', {}).get('edges', [])
                for variant_edge in variants:
                    variant = variant_edge['node']
                    price = variant['price']
                    print(f"\n   📌 Variant: {variant['title']}")
                    print(f"      ID: {variant['id']}")
                    print(f"      Price: {price['amount']} {price['currencyCode']}")
                    print(f"      SKU: {variant.get('sku', 'N/A')}")
                    print(f"      Available: {variant['availableForSale']}")
            
            print("\n✅ Use these variant IDs in your .env file:")
            print("   SHOPIFY_VARIANT_48=gid://shopify/ProductVariant/...")
            
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {e}")


def test_cart_creation_endpoint():
    """Test the /api/create-cart endpoint"""
    print("=" * 60)
    print("🛒 TESTING CART CREATION ENDPOINT")
    print("=" * 60)
    
    url = f"{BACKEND_URL}/api/create-cart"
    
    # Test payload
    payload = {
        "size": 75,
        "quantity": 1,
        "customization_id": "test-" + os.urandom(4).hex(),
        "addons": {
            "stand": True,
            "mounting_dots": False
        }
    }
    
    print(f"   URL: {url}")
    print(f"   Payload:")
    print(json.dumps(payload, indent=2))
    print()
    
    try:
        response = requests.post(
            url,
            headers={'Content-Type': 'application/json'},
            json=payload,
            timeout=30
        )
        
        print(f"   Status Code: {response.status_code}")
        print()
        
        try:
            data = response.json()
            print("   Response:")
            print(json.dumps(data, indent=2))
            
            if response.status_code == 200 and data.get('success'):
                print()
                print("✅ Cart created successfully!")
                print(f"   Cart ID: {data.get('cart_id')}")
                print(f"   Checkout URL: {data.get('checkout_url')}")
                print()
                print("🔗 Visit the checkout URL to test the full flow")
                return True
            else:
                print()
                print(f"❌ Cart creation failed: {data.get('error', 'Unknown error')}")
                return False
                
        except json.JSONDecodeError:
            print(f"   Response (not JSON): {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to {BACKEND_URL}")
        print("   Make sure the Flask server is running")
        print("   Run: python server.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print()
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 8 + "SHOPIFY STOREFRONT API TEST SUITE" + " " * 15 + "║")
    print("╚" + "=" * 58 + "╝")
    print()
    
    # Step 1: Check environment variables
    if not test_environment_variables():
        print()
        print("❌ Tests cannot proceed without required environment variables")
        print("   Please configure .env file based on .env.example")
        sys.exit(1)
    
    print()
    
    # Step 2: Test Storefront API connection
    if not test_storefront_api_directly():
        print()
        print("❌ Storefront API connection failed")
        print("   Please check your credentials and try again")
        sys.exit(1)
    
    print()
    
    # Step 3: Get product variants (helpful for setup)
    test_get_product_variants()
    
    print()
    
    # Step 4: Test cart creation endpoint
    success = test_cart_creation_endpoint()
    
    print()
    print("=" * 60)
    if success:
        print("✅ ALL TESTS PASSED")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Test the checkout URL in your browser")
        print("2. Complete a test order")
        print("3. Verify webhook delivery in Shopify Admin")
        sys.exit(0)
    else:
        print("❌ SOME TESTS FAILED")
        print("=" * 60)
        print()
        print("Troubleshooting:")
        print("1. Check Flask server logs for detailed errors")
        print("2. Verify all environment variables are correct")
        print("3. Ensure variant IDs are valid GraphQL GIDs")
        sys.exit(1)


if __name__ == '__main__':
    main()



