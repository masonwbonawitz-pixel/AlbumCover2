#!/bin/bash

# Script to copy FOR_HOSTING files to root for GitHub Pages deployment

SOURCE_DIR="5001/FOR_HOSTING"
TARGET_DIR="."

echo "🚀 Preparing files for GitHub Pages deployment..."
echo "Copying files from $SOURCE_DIR to repository root..."

# Copy HTML files
echo "📄 Copying HTML files..."
cp "$SOURCE_DIR/index.html" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ index.html"
cp "$SOURCE_DIR/desktop.html" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ desktop.html"
cp "$SOURCE_DIR/admin.html" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ admin.html"
cp "$SOURCE_DIR/test-cart.html" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ test-cart.html"

# Copy JSON files
echo "📋 Copying JSON files..."
cp "$SOURCE_DIR/content.json" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ content.json"
cp "$SOURCE_DIR/prices.json" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ prices.json"
cp "$SOURCE_DIR/orders.json" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ orders.json"

# Copy directories
echo "📁 Copying directories..."
if [ -d "$SOURCE_DIR/mobile" ]; then
    cp -r "$SOURCE_DIR/mobile" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ mobile/"
fi

if [ -d "$SOURCE_DIR/assets" ]; then
    cp -r "$SOURCE_DIR/assets" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ assets/"
fi

if [ -d "$SOURCE_DIR/stl_files" ]; then
    cp -r "$SOURCE_DIR/stl_files" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ stl_files/"
fi

if [ -d "$SOURCE_DIR/product_images" ]; then
    cp -r "$SOURCE_DIR/product_images" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ product_images/"
fi

# Copy .htaccess if it exists (GitHub Pages will ignore it but won't hurt)
if [ -f "$SOURCE_DIR/.htaccess" ]; then
    cp "$SOURCE_DIR/.htaccess" "$TARGET_DIR/" 2>/dev/null && echo "  ✓ .htaccess"
fi

echo ""
echo "✅ Files copied to repository root!"
echo ""
echo "📝 Next steps:"
echo "1. Review the copied files"
echo "2. Commit the changes: git add . && git commit -m 'Prepare for GitHub Pages deployment'"
echo "3. Push to GitHub: git push"
echo "4. Go to GitHub repository Settings > Pages"
echo "5. Set Source to 'Deploy from a branch' > 'main' (or your branch) > '/ (root)'"
echo "6. Your site will be available at: https://masonwbonawitz-pixel.github.io/AlbumCover2/"
echo ""



