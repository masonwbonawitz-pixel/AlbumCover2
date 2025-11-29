# 🖥️ Run Locally at localhost:5000

## Step 1: Start the Flask Server

Open Terminal and run:

```bash
cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/render-backend"
python3 server.py
```

You should see:
```
🚀 Starting Album Cover 3D Color Mapper server...
📂 Open http://localhost:5000 in your browser
```

## Step 2: Open in Browser

Open your browser and go to:

**For Desktop:**
```
http://localhost:5000/desktop
```

**For Mobile:**
```
http://localhost:5000/mobile
```

**For Admin:**
```
http://localhost:5000/admin/prices
```

## Notes:

- The root `http://localhost:5000/` just shows API info (JSON)
- The frontend files in `/netlify` folder will auto-detect localhost and use `http://localhost:5000` for API calls
- Keep the Terminal window open while testing!



