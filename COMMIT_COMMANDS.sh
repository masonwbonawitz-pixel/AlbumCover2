#!/bin/bash
# Commit and push fixes for mobile upload and admin export

cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums"

# Add the modified files
git add 5001/mobile/index.html

# Commit with descriptive message
git commit -m "Fix mobile upload processing and admin export colors

- Fix mobile file picker to directly process files (bypasses DataTransfer API)
- Create reusable processUploadedFile() function for consistent file handling
- Fix export to always use processedImageData with user edits
- Add processImage() call before export if needed
- Add comprehensive error handling and logging for file processing
- Ensure processed image (with all edits) is used for checkout uploads"

# Push to remote
git push

echo ""
echo "✅ Changes committed and pushed!"
echo ""
echo "Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Find your service (rizepics)"
echo "3. Click 'Manual Deploy' → 'Deploy latest commit'"
echo "4. Wait 2-5 minutes for deployment"
echo "5. Test on mobile and admin panel"
echo ""

