#!/bin/bash

# Script to update FOR_HOSTING folder with latest changes

echo "🔄 Updating FOR_HOSTING folder..."

# Navigate to 5001 directory
cd "$(dirname "$0")"

# Copy HTML files
echo "📄 Copying HTML files..."
cp index.html FOR_HOSTING/ 2>/dev/null && echo "  ✓ index.html" || echo "  ✗ index.html not found"
cp desktop.html FOR_HOSTING/ 2>/dev/null && echo "  ✓ desktop.html" || echo "  ✗ desktop.html not found"
cp admin.html FOR_HOSTING/ 2>/dev/null && echo "  ✓ admin.html" || echo "  ✗ admin.html not found"

# Copy mobile files
if [ -f "mobile/index.html" ]; then
    cp mobile/index.html FOR_HOSTING/mobile/ 2>/dev/null && echo "  ✓ mobile/index.html" || echo "  ✗ mobile/index.html failed"
else
    echo "  ⚠ mobile/index.html not found"
fi

# Copy JavaScript files
if [ -d "js" ]; then
    mkdir -p FOR_HOSTING/assets/js
    cp js/*.js FOR_HOSTING/assets/js/ 2>/dev/null && echo "  ✓ JavaScript files" || echo "  ⚠ No JS files to copy"
fi

# Copy product images
if [ -d "product_images" ]; then
    mkdir -p FOR_HOSTING/assets/images
    cp -r product_images/* FOR_HOSTING/assets/images/ 2>/dev/null && echo "  ✓ Product images" || echo "  ⚠ No images to copy"
fi

# Update paths in HTML files (if needed)
echo "🔧 Updating file paths..."
cd FOR_HOSTING

# Fix shopifyCart.js paths
if [ -f "desktop.html" ]; then
    sed -i '' 's|/js/shopifyCart.js|/assets/js/shopifyCart.js|g' desktop.html 2>/dev/null
fi

if [ -f "mobile/index.html" ]; then
    sed -i '' 's|/js/shopifyCart.js|/assets/js/shopifyCart.js|g' mobile/index.html 2>/dev/null
fi

echo ""
echo "✅ FOR_HOSTING folder updated!"
echo ""
echo "📤 Ready to upload to Hostinger:"
echo "   Location: $(pwd)"
echo ""
echo "Next steps:"
echo "1. Upload all files from FOR_HOSTING to public_html"
echo "2. Make sure .htaccess is uploaded"
echo "3. Set file permissions (644 for files, 755 for folders)"
echo "4. Clear browser cache and test"



