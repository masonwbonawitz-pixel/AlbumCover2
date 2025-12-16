# Backend Templates

This folder contains ready-to-use template files for your Supabase backend.

## Quick Setup

### 1. Copy all files to your backend directory

```bash
# From your project root
mkdir -p backend/services
cp DOCUMENTATION/BACKEND_TEMPLATES/*.py backend/
cp DOCUMENTATION/BACKEND_TEMPLATES/requirements.txt backend/
```

### 2. Create .env file

```bash
cd backend
cat > .env << 'EOF'
SUPABASE_URL=https://bfgbukjtxmxufgocqfjf.supabase.co
SUPABASE_ANON_KEY=sb_publishable_A2Zsk38UyW76hGWZR7cLCA_phEru3KA...
SUPABASE_SERVICE_KEY=sb_secret_31piiN875_NqRQAOK_w5CQ_BoXb2QFV/...
SUPABASE_PRODUCT_IMAGES_BUCKET=product-images
SUPABASE_STL_FILES_BUCKET=stl-files
SUPABASE_ORDER_FILES_BUCKET=order-files
EOF
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Copy service files

You need to copy the service files from `SUPABASE_BACKEND_CODE.md`:

- `services/__init__.py`
- `services/prices_service.py`
- `services/content_service.py`
- `services/images_service.py`
- `services/orders_service.py`
- `services/stl_service.py`

### 5. Copy server.py

Copy `server.py` from `SUPABASE_FLASK_ROUTES.md`

### 6. Run

```bash
python server.py
```

## Files in This Folder

- **config.py** - Configuration management
- **supabase_client.py** - Supabase client wrapper
- **requirements.txt** - Python dependencies
- **README.md** - This file

## Next Steps

1. See `SUPABASE_QUICK_START.md` for complete setup guide
2. See `SUPABASE_BACKEND_CODE.md` for service implementations
3. See `SUPABASE_FLASK_ROUTES.md` for Flask routes

## Important Notes

- Never commit your `.env` file
- Use `SUPABASE_SERVICE_KEY` in backend (has admin access)
- Use `SUPABASE_ANON_KEY` in frontend (limited access)

