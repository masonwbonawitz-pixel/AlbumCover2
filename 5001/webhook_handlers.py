"""
Shopify Webhook Handlers
Processes webhooks from Shopify for order events
"""
import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any
from shopify_api import get_shopify_api


def extract_order_id_from_order(order_data: Dict[str, Any]) -> Optional[str]:
    """
    Extract internal order_id from Shopify order line item properties
    Args:
        order_data: Shopify order webhook data
    Returns:
        Internal order_id if found, None otherwise
    """
    line_items = order_data.get('line_items', [])
    
    for item in line_items:
        properties = item.get('properties', [])
        for prop in properties:
            # Look for order_id in properties
            prop_name = prop.get('name', '').lower()
            prop_value = prop.get('value', '')
            
            if prop_name == '_order_id' or prop_name == 'order_id':
                return prop_value
    
    return None


def get_order_files(order_id: str) -> Dict[str, str]:
    """
    Get file paths for an order
    Args:
        order_id: Internal order ID
    Returns:
        Dictionary with file paths
    """
    orders_dir = os.path.join('orders', order_id)
    
    files = {
        'obj': os.path.join(orders_dir, 'model.obj'),
        'mtl': os.path.join(orders_dir, 'model.mtl'),
        'png': os.path.join(orders_dir, 'original.png'),
        'stl': os.path.join(orders_dir, 'model.stl')
    }
    
    # Filter to only existing files
    return {k: v for k, v in files.items() if os.path.exists(v)}


def upload_order_files_to_shopify(order_id: str, shopify_order_id: str) -> bool:
    """
    Upload order files to Shopify Files API and attach to order
    Args:
        order_id: Internal order ID
        shopify_order_id: Shopify order ID
    Returns:
        True if successful
    """
    shopify_api = get_shopify_api()
    if not shopify_api.is_configured():
        print("⚠️  Shopify API not configured, cannot upload files")
        return False
    
    # Get order files
    order_files = get_order_files(order_id)
    if not order_files:
        print(f"⚠️  No files found for order {order_id}")
        return False
    
    uploaded_urls = []
    
    # Upload each file
    for file_type, file_path in order_files.items():
        filename = f"order_{order_id}_{file_type}.{file_path.split('.')[-1]}"
        file_url = shopify_api.upload_file_to_shopify(file_path, filename)
        
        if file_url:
            uploaded_urls.append(file_url)
            print(f"✅ Uploaded {file_type} to Shopify: {file_url}")
        else:
            print(f"❌ Failed to upload {file_type}")
    
    if uploaded_urls:
        # Attach files to order
        success = shopify_api.attach_files_to_order(shopify_order_id, uploaded_urls)
        
        # Also store order_id as metafield
        shopify_api.add_metafield_to_order(
            shopify_order_id,
            'album_builder',
            'order_id',
            order_id
        )
        
        return success
    
    return False


def send_order_files_to_admin(order_id: str, order_data: Dict[str, Any]) -> bool:
    """
    Send order files download links to admin email
    Args:
        order_id: Internal order ID
        order_data: Order data
    Returns:
        True if successful
    """
    admin_email = os.getenv('ADMIN_EMAIL')
    backend_url = os.getenv('BACKEND_URL', 'http://localhost:5001')
    
    if not admin_email:
        print("⚠️  ADMIN_EMAIL not configured, cannot send email")
        return False
    
    try:
        # Create email
        msg = MIMEMultipart()
        msg['From'] = admin_email
        msg['To'] = admin_email
        msg['Subject'] = f'New Order: {order_id}'
        
        # Create download links
        download_links = {
            'OBJ': f"{backend_url}/orders/{order_id}/model.obj",
            'MTL': f"{backend_url}/orders/{order_id}/model.mtl",
            'PNG': f"{backend_url}/orders/{order_id}/original.png",
            'STL': f"{backend_url}/orders/{order_id}/model.stl"
        }
        
        # Email body
        body = f"""
New order received!

Order ID: {order_id}
Shopify Order: {order_data.get('name', 'N/A')}
Customer: {order_data.get('email', 'N/A')}
Total: ${order_data.get('total_price', 0)}

Download Links:
"""
        for file_type, url in download_links.items():
            body += f"  {file_type}: {url}\n"
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email (requires SMTP configuration)
        # For now, just print - user needs to configure SMTP
        print(f"📧 Would send email to {admin_email}")
        print(body)
        
        # Uncomment and configure SMTP to actually send:
        # smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        # smtp_port = int(os.getenv('SMTP_PORT', 587))
        # smtp_user = os.getenv('SMTP_USER')
        # smtp_password = os.getenv('SMTP_PASSWORD')
        # 
        # server = smtplib.SMTP(smtp_server, smtp_port)
        # server.starttls()
        # server.login(smtp_user, smtp_password)
        # server.send_message(msg)
        # server.quit()
        
        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False


def handle_order_create(order_data: Dict[str, Any]) -> bool:
    """
    Handle order creation webhook
    Args:
        order_data: Shopify order webhook data
    Returns:
        True if processed successfully
    """
    print(f"📦 Order created webhook received: {order_data.get('name', 'Unknown')}")
    
    # Extract internal order_id
    order_id = extract_order_id_from_order(order_data)
    
    if not order_id:
        print("⚠️  No order_id found in order properties")
        return False
    
    shopify_order_id = str(order_data.get('id', ''))
    
    print(f"🔗 Linking order {order_id} to Shopify order {shopify_order_id}")
    
    # Store mapping in orders.json
    try:
        orders_file = 'orders.json'
        orders = []
        
        if os.path.exists(orders_file):
            with open(orders_file, 'r') as f:
                orders = json.load(f)
        
        # Update order with Shopify info
        for order in orders:
            if order.get('order_id') == order_id:
                order['shopify_order_id'] = shopify_order_id
                order['shopify_order_name'] = order_data.get('name')
                order['shopify_customer_email'] = order_data.get('email')
                break
        
        with open(orders_file, 'w') as f:
            json.dump(orders, f, indent=2)
        
        print(f"✅ Order mapping saved")
        return True
    except Exception as e:
        print(f"❌ Error saving order mapping: {e}")
        return False


def handle_order_paid(order_data: Dict[str, Any]) -> bool:
    """
    Handle order paid webhook
    Args:
        order_data: Shopify order webhook data
    Returns:
        True if processed successfully
    """
    print(f"💰 Order paid webhook received: {order_data.get('name', 'Unknown')}")
    
    # Extract internal order_id
    order_id = extract_order_id_from_order(order_data)
    
    if not order_id:
        print("⚠️  No order_id found in order properties")
        return False
    
    shopify_order_id = str(order_data.get('id', ''))
    
    print(f"📤 Processing paid order {order_id} (Shopify: {shopify_order_id})")
    
    # Upload files to Shopify
    upload_success = upload_order_files_to_shopify(order_id, shopify_order_id)
    
    # Also send to admin email
    send_success = send_order_files_to_admin(order_id, order_data)
    
    # Update order status
    try:
        orders_file = 'orders.json'
        orders = []
        
        if os.path.exists(orders_file):
            with open(orders_file, 'r') as f:
                orders = json.load(f)
        
        # Update order status
        for order in orders:
            if order.get('order_id') == order_id:
                order['paid'] = True
                order['shopify_order_id'] = shopify_order_id
                order['files_uploaded'] = upload_success
                break
        
        with open(orders_file, 'w') as f:
            json.dump(orders, f, indent=2)
        
        print(f"✅ Order status updated")
        return upload_success or send_success
    except Exception as e:
        print(f"❌ Error updating order status: {e}")
        return False

