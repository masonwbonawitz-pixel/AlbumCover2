# Commit and Test Instructions

## Files Changed

1. `5001/mobile/index.html` - Fixed mobile upload processing and export to use processed image

**Note**: `5001/admin.html` already has the correct BACKEND_URL (https://rizepics.onrender.com)

## Step 1: Commit Changes

**Option A: Use the script (easiest)**
```bash
cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums"
./COMMIT_COMMANDS.sh
```

**Option B: Manual commands**
```bash
cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums"
git add 5001/mobile/index.html
git commit -m "Fix mobile upload processing and admin export colors

- Fix mobile file picker to directly process files (bypasses DataTransfer API)
- Create reusable processUploadedFile() function for consistent file handling
- Fix export to always use processedImageData with user edits
- Add processImage() call before export if needed
- Add comprehensive error handling and logging for file processing"
git push
```

## Step 2: Redeploy on Render

1. Go to https://dashboard.render.com
2. Find your service (rizepics)
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment (2-5 minutes)

## Step 3: Test Mobile Upload

1. **On your phone**, visit: https://rizepics.onrender.com/
2. **Tap the "Upload" button** (↑ icon in toolbar)
3. **Select a photo** from your camera roll
4. **Expected result:**
   - ✅ File picker opens (camera/photos/files)
   - ✅ After selecting, image processes
   - ✅ Editor panel shows up
   - ✅ You can see the processed image
   - ✅ Action buttons (Size, Adjust, Paint) appear
   - ✅ Price section appears
   - ❌ Does NOT go back to start screen

## Step 4: Test Admin Panel

1. **Visit**: https://rizepics.onrender.com/admin
2. **Test saving content:**
   - Go to "Edit" tab
   - Change some text (e.g., title, description)
   - Click "Save All"
   - ✅ Should save without "Failed to fetch" error
3. **Test saving prices:**
   - Change a price
   - Click "Save All"
   - ✅ Should save successfully
4. **Test saving images:**
   - Upload a product image
   - Click "Save All"
   - ✅ Should save successfully

## Step 5: Test Export Colors

1. **Create a test order:**
   - On mobile or desktop, upload an image
   - Make some edits (adjust contrast, brightness, or paint)
   - Click "ADD TO CART" (test button)
2. **Check admin panel:**
   - Go to https://rizepics.onrender.com/admin
   - Click "Orders" tab
   - Find your test order
   - Click "Download OBJ"
3. **Expected result:**
   - ✅ OBJ file downloads
   - ✅ When opened in 3D viewer (Bambu Studio), it should show:
     - All 4 colors (black, dark gray, light gray, white)
     - Colors matching what you saw in the 3D viewer
     - NOT just a single color

## Troubleshooting

### Mobile upload still doesn't work
- Clear browser cache on your phone
- Try in incognito/private mode
- Check browser console (if possible) for error messages
- The console.log messages will help debug

### Admin still shows "Failed to fetch"
- Check that BACKEND_URL in admin.html is `https://rizepics.onrender.com`
- Verify your backend is running (visit https://rizepics.onrender.com/api/prices)
- Check browser console for specific error messages

### Export still shows single color
- Check browser console for "processedImageData" logs
- Make sure you edited the image before exporting (adjust sliders or paint)
- The processed image should be generated before export

## What Was Fixed

### Mobile Upload
- **Before**: File picker opened but image didn't process, page reset to start
- **After**: File directly processes, editor shows up, all controls appear

### Admin Export
- **Before**: Exported OBJ only showed single color (original image)
- **After**: Exported OBJ uses processed image with all user edits and colors

---

**After testing, let me know if everything works or if you encounter any issues!**

