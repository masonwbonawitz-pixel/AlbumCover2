# Migration Guide: JSON Files → Supabase

This guide will help you migrate your existing data from JSON files to Supabase.

---

## Overview

You need to migrate:
1. ✅ Prices from `prices.json`
2. ✅ Content from `content.json`
3. ✅ Images from `images.json` + `product_images/` folder
4. ✅ Orders from `orders.json` + `orders/` folder
5. ✅ STL files from `stl_files/` folder

---

## Step 1: Backup Your Data

**IMPORTANT**: Before migrating, backup all your data!

```bash
# Create backup directory
mkdir -p backup_$(date +%Y%m%d)

# Copy all JSON files
cp prices.json backup_$(date +%Y%m%d)/
cp content.json backup_$(date +%Y%m%d)/
cp images.json backup_$(date +%Y%m%d)/
cp orders.json backup_$(date +%Y%m%d)/

# Copy all directories
cp -r product_images/ backup_$(date +%Y%m%d)/
cp -r stl_files/ backup_$(date +%Y%m%d)/
cp -r orders/ backup_$(date +%Y%m%d)/
```

---

## Step 2: Create Migration Script

Create a Python script to migrate your data:

### `migrate_to_supabase.py`

```python
import json
import os
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("🚀 Starting migration to Supabase...\n")

# ============================================================================
# 1. MIGRATE PRICES
# ============================================================================

def migrate_prices():
    print("📊 Migrating prices...")
    
    try:
        with open('prices.json', 'r') as f:
            prices = json.load(f)
        
        for grid_size, price in prices.items():
            supabase.table('prices').update({
                'price': price
            }).eq('grid_size', grid_size).execute()
            
            print(f"  ✅ {grid_size}: ${price}")
        
        print("✅ Prices migrated successfully!\n")
        
    except FileNotFoundError:
        print("⚠️  prices.json not found, using defaults\n")
    except Exception as e:
        print(f"❌ Error migrating prices: {e}\n")


# ============================================================================
# 2. MIGRATE CONTENT
# ============================================================================

def migrate_content():
    print("📝 Migrating content...")
    
    try:
        with open('content.json', 'r') as f:
            content = json.load(f)
        
        count = 0
        for key, value in content.items():
            # Check if exists
            existing = supabase.table('content').select('id').eq('key', key).execute()
            
            if existing.data:
                # Update existing
                supabase.table('content').update({
                    'value': value
                }).eq('key', key).execute()
            else:
                # Insert new
                supabase.table('content').insert({
                    'key': key,
                    'value': value
                }).execute()
            
            count += 1
            print(f"  ✅ {key}")
        
        print(f"✅ {count} content entries migrated successfully!\n")
        
    except FileNotFoundError:
        print("⚠️  content.json not found, using defaults\n")
    except Exception as e:
        print(f"❌ Error migrating content: {e}\n")


# ============================================================================
# 3. MIGRATE PRODUCT IMAGES
# ============================================================================

def migrate_product_images():
    print("🖼️  Migrating product images...")
    
    try:
        with open('images.json', 'r') as f:
            images = json.load(f)
        
        product_images_dir = Path('product_images')
        
        if not product_images_dir.exists():
            print("⚠️  product_images/ directory not found\n")
            return
        
        for key, local_url in images.items():
            # Extract filename from local URL
            filename = local_url.split('/')[-1]
            local_path = product_images_dir / filename
            
            if not local_path.exists():
                print(f"  ⚠️  {filename} not found, skipping")
                continue
            
            # Read file
            with open(local_path, 'rb') as f:
                file_data = f.read()
            
            # Upload to Supabase storage
            storage_path = f"product_images/{filename}"
            
            try:
                supabase.storage.from_('product-images').upload(
                    path=storage_path,
                    file=file_data,
                    file_options={'content-type': 'image/png'}
                )
            except Exception as e:
                # File might already exist, that's okay
                if 'already exists' not in str(e):
                    print(f"  ⚠️  Error uploading {filename}: {e}")
            
            # Get public URL
            public_url = supabase.storage.from_('product-images').get_public_url(storage_path)
            
            # Update database
            supabase.table('product_images').update({
                'image_url': public_url,
                'storage_path': storage_path
            }).eq('key', key).execute()
            
            print(f"  ✅ {key}: {filename}")
        
        print("✅ Product images migrated successfully!\n")
        
    except FileNotFoundError:
        print("⚠️  images.json not found\n")
    except Exception as e:
        print(f"❌ Error migrating images: {e}\n")


# ============================================================================
# 4. MIGRATE STL FILES
# ============================================================================

def migrate_stl_files():
    print("🔺 Migrating STL files...")
    
    stl_dir = Path('stl_files')
    
    if not stl_dir.exists():
        print("⚠️  stl_files/ directory not found\n")
        return
    
    stl_files = {
        '48': '48x48_grid.stl',
        '75': '75x75_grid.stl',
        '96': '96x96_grid.stl'
    }
    
    for size, filename in stl_files.items():
        local_path = stl_dir / filename
        
        if not local_path.exists():
            print(f"  ⚠️  {filename} not found, skipping")
            continue
        
        # Read file
        with open(local_path, 'rb') as f:
            file_data = f.read()
        
        # Upload to Supabase storage
        storage_path = f"stl_files/{filename}"
        
        try:
            supabase.storage.from_('stl-files').upload(
                path=storage_path,
                file=file_data,
                file_options={'content-type': 'application/octet-stream'}
            )
        except Exception as e:
            if 'already exists' not in str(e):
                print(f"  ⚠️  Error uploading {filename}: {e}")
        
        # Get public URL
        public_url = supabase.storage.from_('stl-files').get_public_url(storage_path)
        
        # Update database
        supabase.table('stl_files').update({
            'file_path': public_url,
            'storage_path': storage_path
        }).eq('size', size).execute()
        
        print(f"  ✅ {size}x{size}: {filename}")
    
    print("✅ STL files migrated successfully!\n")


# ============================================================================
# 5. MIGRATE ORDERS
# ============================================================================

def migrate_orders():
    print("📦 Migrating orders...")
    
    try:
        with open('orders.json', 'r') as f:
            orders = json.load(f)
        
        orders_dir = Path('orders')
        
        if not orders_dir.exists():
            print("⚠️  orders/ directory not found\n")
            return
        
        migrated_count = 0
        skipped_count = 0
        
        for order in orders:
            order_id = order['order_id']
            order_folder = orders_dir / order_id
            
            if not order_folder.exists():
                print(f"  ⚠️  Order folder {order_id} not found, skipping")
                skipped_count += 1
                continue
            
            # Upload order files
            file_paths = {}
            files = {
                'obj': 'model.obj',
                'mtl': 'model.mtl',
                'png': 'original.png',
                'stl': 'model.stl'
            }
            
            for file_type, filename in files.items():
                file_path = order_folder / filename
                
                if not file_path.exists():
                    print(f"    ⚠️  {filename} not found")
                    continue
                
                # Read file
                with open(file_path, 'rb') as f:
                    file_data = f.read()
                
                # Upload to Supabase storage
                storage_path = f"orders/{order_id}/{filename}"
                
                try:
                    supabase.storage.from_('order-files').upload(
                        path=storage_path,
                        file=file_data
                    )
                    
                    file_paths[f"{file_type}_file_path"] = storage_path
                    
                except Exception as e:
                    if 'already exists' not in str(e):
                        print(f"    ⚠️  Error uploading {filename}: {e}")
            
            # Insert order into database
            try:
                supabase.table('orders').insert({
                    'order_id': order['order_id'],
                    'timestamp': order.get('timestamp'),
                    'grid_size': order['grid_size'],
                    'dimensions': order['dimensions'],
                    'base_price': order['base_price'],
                    'stand_selected': order.get('stand_selected', False),
                    'mounting_selected': order.get('mounting_selected', False),
                    'total_price': order['total_price'],
                    'addons': order.get('addons', []),
                    'completed': order.get('completed', False),
                    **file_paths
                }).execute()
                
                print(f"  ✅ Order {order_id}")
                migrated_count += 1
                
            except Exception as e:
                if 'duplicate key' in str(e).lower():
                    print(f"  ⚠️  Order {order_id} already exists, skipping")
                    skipped_count += 1
                else:
                    print(f"  ❌ Error migrating order {order_id}: {e}")
                    skipped_count += 1
        
        print(f"✅ {migrated_count} orders migrated successfully!")
        if skipped_count > 0:
            print(f"⚠️  {skipped_count} orders skipped\n")
        else:
            print()
        
    except FileNotFoundError:
        print("⚠️  orders.json not found\n")
    except Exception as e:
        print(f"❌ Error migrating orders: {e}\n")


# ============================================================================
# RUN MIGRATION
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("  DATA MIGRATION: JSON → SUPABASE")
    print("=" * 60)
    print()
    
    # Run migrations
    migrate_prices()
    migrate_content()
    migrate_product_images()
    migrate_stl_files()
    migrate_orders()
    
    print("=" * 60)
    print("  MIGRATION COMPLETE!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Verify data in Supabase dashboard")
    print("2. Test your application with the new backend")
    print("3. Keep JSON files as backup until fully tested")
    print()
```

---

## Step 3: Run Migration

```bash
# Install dependencies
pip install supabase python-dotenv

# Make sure your .env file is configured
# SUPABASE_URL=https://bfgbukjtxmxufgocqfjf.supabase.co
# SUPABASE_SERVICE_KEY=sb_secret_...

# Run migration script
python migrate_to_supabase.py
```

You should see output like:

```
============================================================
  DATA MIGRATION: JSON → SUPABASE
============================================================

📊 Migrating prices...
  ✅ 48x48: $29.99
  ✅ 75x75: $48.99
  ✅ 96x96: $59.99
  ✅ stand: $10.0
  ✅ wall_mounting_dots: $5.99
✅ Prices migrated successfully!

📝 Migrating content...
  ✅ title
  ✅ price_subtitle
  ✅ upload_image_text
  ...
✅ 30 content entries migrated successfully!

🖼️  Migrating product images...
  ✅ stand: stand_abc123.png
  ✅ wall_mounting_dots: mounting_def456.png
✅ Product images migrated successfully!

🔺 Migrating STL files...
  ✅ 48x48: 48x48_grid.stl
  ✅ 75x75: 75x75_grid.stl
  ✅ 96x96: 96x96_grid.stl
✅ STL files migrated successfully!

📦 Migrating orders...
  ✅ Order abc-123-def-456
  ✅ Order ghi-789-jkl-012
✅ 2 orders migrated successfully!

============================================================
  MIGRATION COMPLETE!
============================================================
```

---

## Step 4: Verify Migration

### 4.1 Check Database Tables

Go to your Supabase dashboard → Table Editor and verify:

1. **Prices table**: Contains 5 rows (3 grid sizes + 2 add-ons)
2. **Content table**: Contains all your content entries (~30 rows)
3. **Product_images table**: Contains 2 rows (stand, mounting dots)
4. **STL_files table**: Contains 3 rows (48, 75, 96)
5. **Orders table**: Contains all your orders

### 4.2 Check Storage Buckets

Go to Supabase dashboard → Storage and verify:

1. **product-images**: Contains your product images
2. **stl-files**: Contains 3 STL files
3. **order-files**: Contains folders for each order

### 4.3 Test API Endpoints

```bash
# Test prices
curl http://localhost:5000/api/prices

# Test content
curl http://localhost:5000/api/content

# Test images
curl http://localhost:5000/api/images

# Test orders (admin)
curl http://localhost:5000/admin/orders/api
```

---

## Step 5: Rollback Plan (If Needed)

If something goes wrong, you can easily rollback:

### Option 1: Keep JSON Files Running in Parallel

1. Don't delete JSON files yet
2. Run old backend on port 5001
3. Test Supabase backend on port 5000
4. Switch when ready

### Option 2: Clear Supabase and Re-migrate

```python
# clear_supabase.py
from supabase import create_client
import os

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_KEY')
)

# Clear tables (keeps schema)
supabase.table('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()

# Clear storage
# ... (implement as needed)

print("Supabase cleared, ready for re-migration")
```

---

## Step 6: Cleanup (After Testing)

Once you've verified everything works:

```bash
# Archive old data
mkdir archive_json_backend
mv prices.json archive_json_backend/
mv content.json archive_json_backend/
mv images.json archive_json_backend/
mv orders.json archive_json_backend/
mv product_images/ archive_json_backend/
mv stl_files/ archive_json_backend/
mv orders/ archive_json_backend/

# Compress archive
tar -czf archive_json_backend_$(date +%Y%m%d).tar.gz archive_json_backend/

# Keep archive for 30 days, then delete
```

---

## Common Migration Issues

### Issue 1: "File already exists" errors

**Solution**: The migration script handles this gracefully. Files won't be re-uploaded if they already exist.

### Issue 2: Order files missing

**Solution**: Check that the `orders/` folder structure is correct:
```
orders/
├── order-id-1/
│   ├── model.obj
│   ├── model.mtl
│   ├── original.png
│   └── model.stl
└── order-id-2/
    └── ...
```

### Issue 3: Large file upload failures

**Solution**: Supabase has a 50MB limit per file. If you have larger files:
1. Split the migration into batches
2. Use Supabase's resumable upload for large files
3. Contact Supabase support for increased limits

### Issue 4: Storage bucket not found

**Solution**: Make sure you created the storage buckets:
- `product-images`
- `stl-files`
- `order-files`

### Issue 5: Permission errors

**Solution**: Check that you're using the `SUPABASE_SERVICE_KEY` (not the anon key) for migration, as it has admin permissions.

---

## Post-Migration Checklist

- [ ] All prices migrated correctly
- [ ] All content entries present
- [ ] Product images display correctly
- [ ] STL files download correctly
- [ ] All orders present with correct data
- [ ] Order files accessible
- [ ] Admin panel loads orders correctly
- [ ] Can create new orders
- [ ] Can update order status
- [ ] Can delete orders
- [ ] JSON files backed up
- [ ] Old data archived

---

## Benefits After Migration

✅ **No more file management**: All data in cloud database
✅ **Better performance**: Database queries are faster than file I/O
✅ **Scalability**: Can handle thousands of orders
✅ **Automatic backups**: Supabase handles backups
✅ **Real-time updates**: Can add real-time features
✅ **Better security**: Row Level Security policies
✅ **Admin dashboard**: Built-in data management
✅ **API auto-generation**: Supabase auto-generates REST API

---

## Next Steps

1. ✅ Run migration script
2. ✅ Verify all data migrated
3. ✅ Test application thoroughly
4. ✅ Monitor for issues
5. ✅ Archive JSON files after 30 days of stable operation


