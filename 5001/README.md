# 48x48 Version - Separate Copy

This is an exact copy of the main project, configured to run on **port 5001** instead of port 5000.

## Purpose

This copy allows you to:
- Edit and test changes without affecting the main version
- Run both versions simultaneously (main on port 5000, this on port 5001)
- Publish a simplified 48x48-only version

## How to Run

### Option 1: Use the start script
```bash
cd 48x48-version
./start-server.sh
```

### Option 2: Run directly
```bash
cd 48x48-version
python3 server.py
```

## Access URLs

- **Main app**: http://localhost:5001
- **Desktop view**: http://localhost:5001/desktop
- **Mobile view**: http://localhost:5001/mobile
- **Admin panel**: http://localhost:5001/admin
- **Admin prices**: http://localhost:5001/admin/prices

## What's Different

- All `localhost:5000` references changed to `localhost:5001`
- Server runs on port 5001
- Everything else is identical to the main version

## Notes

- The original version remains untouched in the parent directory
- Both versions can run at the same time on different ports
- All files, images, and configurations are copied exactly

