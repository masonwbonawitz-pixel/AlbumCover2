# Supabase Quick Start Guide

**Get your Rize Albums app running with Supabase in 30 minutes!**

---

## Prerequisites

- [ ] Python 3.8+ installed
- [ ] pip package manager
- [ ] Your Supabase account ready
- [ ] Supabase credentials handy

---

## Your Supabase Credentials

```
Project URL: https://bfgbukjtxmxufgocqfjf.supabase.co
Publishable Key: sb_publishable_A2Zsk38UyW76hGWZR7cLCA_phEru3KA...
Secret Key: sb_secret_31piiN875_NqRQAOK_w5CQ_BoXb2QFV/...
```

---

## 🚀 Quick Setup (30 minutes)

### Step 1: Set Up Supabase Database (10 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (bfgbukjtxmxufgocqfjf)
3. Go to **SQL Editor**
4. Create a new query
5. Copy and paste the **Complete Database Setup Script** below
6. Click **Run**

#### Complete Database Setup Script

```sql
-- ============================================================================
-- COMPLETE SUPABASE SETUP FOR RIZE ALBUMS
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- 1. CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. CREATE PRICES TABLE
CREATE TABLE IF NOT EXISTS prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grid_size VARCHAR(10) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO prices (grid_size, price) VALUES
    ('48x48', 29.99),
    ('75x75', 48.99),
    ('96x96', 59.99),
    ('stand', 10.00),
    ('wall_mounting_dots', 5.99)
ON CONFLICT (grid_size) DO NOTHING;

CREATE TRIGGER update_prices_updated_at
    BEFORE UPDATE ON prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. CREATE CONTENT TABLE
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO content (key, value) VALUES
    ('title', '3D Album Cover Mosaic Builder'),
    ('price_subtitle', 'Create colorized 3D prints'),
    ('upload_image_text', 'Choose image file...'),
    ('upload_subtext', 'Will be resized to 75×75 pixels'),
    ('panel_title', 'Editor Panel'),
    ('canvas_label', 'Preview'),
    ('section_upload', '1. Upload Color Image'),
    ('section_grid', '2. Select Grid Size'),
    ('section_adjustments', '3. Adjust Image'),
    ('section_painting', '4. Paint Colors'),
    ('grid_btn_48', '48×48 (Normal)'),
    ('grid_btn_75', '75×75 (Pixelated)'),
    ('grid_btn_96', '96×96 (High Detail)'),
    ('slider_contrast_label', 'Contrast'),
    ('slider_brightness_label', 'Brightness'),
    ('slider_tones_label', 'Color Tones'),
    ('label_dimensions', 'Dimensions'),
    ('label_addons', 'Add-ons'),
    ('stand_name', 'Stand'),
    ('mounting_name', 'Wall Mounting Dots'),
    ('color_black_title', 'Black'),
    ('color_darkgray_title', 'Dark Gray'),
    ('color_lightgray_title', 'Light Gray'),
    ('color_white_title', 'White'),
    ('info_title', 'About This Product'),
    ('info_description', 'Create custom 3D printed album cover mosaics'),
    ('info_additional', 'High-quality colorized 3D prints'),
    ('howto_title', 'How It Works'),
    ('howto_content', '1. Upload your image\n2. Select grid size\n3. Adjust colors\n4. Download your 3D model')
ON CONFLICT (key) DO NOTHING;

CREATE TRIGGER update_content_updated_at
    BEFORE UPDATE ON content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. CREATE PRODUCT_IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO product_images (key, image_url) VALUES
    ('stand', '/product_images/stand_default.png'),
    ('wall_mounting_dots', '/product_images/mounting_dots_default.png')
ON CONFLICT (key) DO NOTHING;

CREATE TRIGGER update_product_images_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(100) NOT NULL UNIQUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    grid_size INTEGER NOT NULL,
    dimensions VARCHAR(20) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    stand_selected BOOLEAN DEFAULT FALSE,
    mounting_selected BOOLEAN DEFAULT FALSE,
    total_price DECIMAL(10, 2) NOT NULL,
    addons JSONB DEFAULT '[]'::jsonb,
    completed BOOLEAN DEFAULT FALSE,
    obj_file_path TEXT,
    mtl_file_path TEXT,
    png_file_path TEXT,
    stl_file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_orders_completed ON orders(completed);

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. CREATE STL_FILES TABLE
CREATE TABLE IF NOT EXISTS stl_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    size VARCHAR(10) NOT NULL UNIQUE,
    file_path TEXT,
    storage_path TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO stl_files (size) VALUES ('48'), ('75'), ('96')
ON CONFLICT (size) DO NOTHING;

CREATE TRIGGER update_stl_files_updated_at
    BEFORE UPDATE ON stl_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stl_files ENABLE ROW LEVEL SECURITY;

-- 8. CREATE RLS POLICIES

-- Prices policies
CREATE POLICY "Anyone can read prices" ON prices FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update prices" ON prices FOR UPDATE USING (auth.role() = 'authenticated');

-- Content policies
CREATE POLICY "Anyone can read content" ON content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update content" ON content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert content" ON content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Product images policies
CREATE POLICY "Anyone can read product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update product images" ON product_images FOR UPDATE USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- STL files policies
CREATE POLICY "Anyone can read STL files" ON stl_files FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update STL files" ON stl_files FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================================
-- SETUP COMPLETE!
-- Next: Create storage buckets in Supabase dashboard
-- ============================================================================
```

✅ You should see: **Success. No rows returned**

---

### Step 2: Create Storage Buckets (5 minutes)

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Create these 3 buckets:

#### Bucket 1: product-images
- Name: `product-images`
- Public bucket: ✅ **Yes**
- Click **Create bucket**

#### Bucket 2: stl-files
- Name: `stl-files`
- Public bucket: ✅ **Yes**
- Click **Create bucket**

#### Bucket 3: order-files
- Name: `order-files`
- Public bucket: ❌ **No** (keep private)
- Click **Create bucket**

---

### Step 3: Set Up Storage Policies (5 minutes)

Go back to **SQL Editor** and run this script:

```sql
-- Storage policies for product-images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Storage policies for stl-files
CREATE POLICY "Public read access for STL files"
ON storage.objects FOR SELECT
USING (bucket_id = 'stl-files');

CREATE POLICY "Authenticated users can upload STL files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'stl-files' AND auth.role() = 'authenticated');

-- Storage policies for order-files
CREATE POLICY "Authenticated users can read order files"
ON storage.objects FOR SELECT
USING (bucket_id = 'order-files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload order files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'order-files' AND auth.role() = 'authenticated');
```

---

### Step 4: Set Up Backend Code (10 minutes)

1. **Create backend directory structure:**

```bash
mkdir -p backend/services
cd backend
```

2. **Create `.env` file:**

```bash
cat > .env << 'EOF'
# Supabase Configuration
SUPABASE_URL=https://bfgbukjtxmxufgocqfjf.supabase.co
SUPABASE_ANON_KEY=sb_publishable_A2Zsk38UyW76hGWZR7cLCA_phEru3KA...
SUPABASE_SERVICE_KEY=sb_secret_31piiN875_NqRQAOK_w5CQ_BoXb2QFV/...

# Storage Buckets
SUPABASE_PRODUCT_IMAGES_BUCKET=product-images
SUPABASE_STL_FILES_BUCKET=stl-files
SUPABASE_ORDER_FILES_BUCKET=order-files
EOF
```

3. **Create `requirements.txt`:**

```bash
cat > requirements.txt << 'EOF'
Flask==3.0.0
Flask-CORS==4.0.0
Pillow==10.0.0
numpy==1.24.0
trimesh==4.0.0
supabase==2.3.0
python-dotenv==1.0.0
EOF
```

4. **Install dependencies:**

```bash
pip install -r requirements.txt
```

5. **Copy backend code files:**

Copy these files from the documentation:
- `config.py` from `SUPABASE_BACKEND_CODE.md`
- `supabase_client.py` from `SUPABASE_BACKEND_CODE.md`
- `server.py` from `SUPABASE_FLASK_ROUTES.md`
- Service files in `services/` directory from `SUPABASE_BACKEND_CODE.md`

---

### Step 5: Test Backend (5 minutes)

1. **Start the Flask server:**

```bash
python server.py
```

You should see:
```
🚀 Starting Flask server with Supabase backend...
📦 Database: https://bfgbukjtxmxufgocqfjf.supabase.co
✅ Supabase configuration validated
✅ Supabase client initialized
 * Running on http://0.0.0.0:5000
```

2. **Test API endpoints:**

```bash
# In a new terminal:

# Test prices
curl http://localhost:5000/api/prices

# Test content
curl http://localhost:5000/api/content

# Test health check
curl http://localhost:5000/health
```

✅ If you see JSON responses, your backend is working!

---

## 🎯 What You've Accomplished

✅ Database tables created
✅ Storage buckets created
✅ Security policies configured
✅ Backend code installed
✅ API endpoints working

---

## 📝 Next Steps

### Option 1: Start Fresh (New Project)
Your app is ready to use! Just:
1. Connect your frontend to the backend
2. Upload your first STL files via admin panel
3. Upload product images via admin panel
4. Start creating orders!

### Option 2: Migrate Existing Data
If you have existing JSON data:
1. See `SUPABASE_MIGRATION_GUIDE.md`
2. Run the migration script
3. Verify data migrated correctly

---

## 🧪 Quick Test Checklist

Test your setup:

- [ ] Backend starts without errors
- [ ] `/api/prices` returns prices
- [ ] `/api/content` returns content
- [ ] `/api/images` returns image URLs
- [ ] Can access Supabase dashboard
- [ ] Tables show in Table Editor
- [ ] Storage buckets visible
- [ ] Can manually add test data in Supabase UI

---

## 🆘 Troubleshooting

### Backend won't start

**Error**: `Missing required config`

**Solution**: Check your `.env` file has all values set correctly

---

### Database connection fails

**Error**: `Could not connect to Supabase`

**Solution**: 
1. Check SUPABASE_URL is correct
2. Check SUPABASE_SERVICE_KEY is correct
3. Make sure your IP isn't blocked in Supabase settings

---

### API returns empty data

**Issue**: `/api/prices` returns `{}`

**Solution**: 
1. Go to Supabase dashboard → Table Editor
2. Check that `prices` table has data
3. Re-run the database setup SQL script

---

### Storage upload fails

**Error**: `Permission denied`

**Solution**:
1. Check storage buckets exist
2. Re-run storage policies SQL script
3. Make sure you're using SUPABASE_SERVICE_KEY in backend

---

## 📚 Reference Documents

- **SUPABASE_SETUP.md** - Detailed setup instructions
- **SUPABASE_BACKEND_CODE.md** - Complete backend code
- **SUPABASE_FLASK_ROUTES.md** - Flask routes reference
- **SUPABASE_FRONTEND_CODE.md** - Frontend integration
- **SUPABASE_MIGRATION_GUIDE.md** - Migrate existing data

---

## 🎉 You're Done!

Your Supabase backend is now ready to use!

**Test it out:**
1. Open your admin panel
2. Try updating prices
3. Try uploading a product image
4. Create a test order

**Need help?** Check the detailed documentation files listed above.

