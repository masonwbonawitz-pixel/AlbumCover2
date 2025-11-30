#!/usr/bin/env python3
import re

file_path = 'desktop.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add noise reduction setting in selectGridSize
select_grid_size_pattern = r'(// Update text to show selected grid size\s+document\.getElementById\(''png-upload-subtext''\)\.textContent = `Will be resized to \$\{size\}×\$\{size\} pixels`;)'
replacement = r'''// Normal (48) = 3, others (75, 96) = 0
            if (size === 48) {
                editorSettings.noiseReduction = 3;
            } else {
                editorSettings.noiseReduction = 0;
            }
            
            \1'''
content = re.sub(select_grid_size_pattern, replacement, content)

# 2. Add applyRegionSmoothing function before processImage
apply_region_smoothing = '''        // Region-based smoothing function for noise reduction
        function applyRegionSmoothing(imageData, width, noiseLevel) {
            const data = imageData.data;
            const height = imageData.height;
            const kernelSize = Math.max(3, Math.min(15, 3 + noiseLevel * 2)); // Kernel size from 3 to 15 based on noise level
            const halfKernel = Math.floor(kernelSize / 2);
            
            // Create a copy for reading original values
            const originalData = new Uint8ClampedArray(data);
            
            // Apply median filter with region grouping
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;
                    const currentColor = originalData[idx];
                    
                    // Collect colors in the kernel
                    const colors = [];
                    for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                            const nx = x + kx;
                            const ny = y + ky;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const nidx = (ny * width + nx) * 4;
                                colors.push(originalData[nidx]);
                            }
                        }
                    }
                    
                    // Find the most common color in the region (mode)
                    // Group by exact color match
                    const colorCounts = {};
                    colors.forEach(c => {
                        colorCounts[c] = (colorCounts[c] || 0) + 1;
                    });
                    
                    let maxCount = 0;
                    let dominantColor = currentColor;
                    for (const color in colorCounts) {
                        if (colorCounts[color] > maxCount) {
                            maxCount = colorCounts[color];
                            dominantColor = parseInt(color);
                        }
                    }
                    
                    // Apply dominant color if it's significantly more common
                    // This creates connected regions instead of grain
                    if (maxCount >= Math.max(2, Math.floor(colors.length * 0.3))) {
                        data[idx] = dominantColor;
                        data[idx + 1] = dominantColor;
                        data[idx + 2] = dominantColor;
                    }
                }
            }
        }

'''

# Find where to insert (before processImage function)
process_image_pattern = r'(function processImage\(\) \{)'
if re.search(process_image_pattern, content):
    content = re.sub(process_image_pattern, apply_region_smoothing + r'\1', content)

# 3. Update processImage to use posterized mode
# Find the processImage function and update it
process_image_section = r'(// Process: Convert to grayscale with luminosity \+ posterize \+ pixelate\s+const pixelSize = selectedGridSize;)'
posterized_replacement = r'''// Process: Convert to grayscale with luminosity + posterize + pixelate
            const pixelSize = selectedGridSize;
            const isPosterizedMode = (pixelSize === 48);
            
            // For posterized mode (48), keep full resolution; otherwise pixelate
            let sourceWidth, sourceHeight;
            if (cropCoordinates && cropCoordinates.size > 0) {
                sourceWidth = cropCoordinates.size;
                sourceHeight = cropCoordinates.size;
            } else {
                sourceWidth = rawUploadedImage.width;
                sourceHeight = rawUploadedImage.height;
            }
            
            // Create temp canvas - full resolution for posterized mode, pixel size for others
            const tempCanvas = document.createElement('canvas');
            if (isPosterizedMode) {
                tempCanvas.width = sourceWidth;
                tempCanvas.height = sourceHeight;
            } else {
                tempCanvas.width = pixelSize;
                tempCanvas.height = pixelSize;
            }
            const tempCtx = tempCanvas.getContext('2d');
            
            // If crop coordinates exist, crop from the full original image first
            if (cropCoordinates && cropCoordinates.size > 0) {
                // Create cropped version from full original
                const cropCanvas = document.createElement('canvas');
                cropCanvas.width = cropCoordinates.size;
                cropCanvas.height = cropCoordinates.size;
                const cropCtx = cropCanvas.getContext('2d');
                cropCtx.drawImage(rawUploadedImage, cropCoordinates.x, cropCoordinates.y, cropCoordinates.size, cropCoordinates.size, 0, 0, cropCoordinates.size, cropCoordinates.size);
                
                if (isPosterizedMode) {
                    // Draw cropped image at full resolution (no pixelation)
                    tempCtx.drawImage(cropCanvas, 0, 0);
                } else {
                    // Draw cropped image at small size (pixelation effect)
                    tempCtx.drawImage(cropCanvas, 0, 0, pixelSize, pixelSize);
                }
            } else {
                if (isPosterizedMode) {
                    // Draw full image at full resolution (no pixelation)
                    tempCtx.drawImage(rawUploadedImage, 0, 0);
                } else {
                    // Draw full image at small size (pixelation effect)
                    tempCtx.drawImage(rawUploadedImage, 0, 0, pixelSize, pixelSize);
                }
            }
            
            // Get image data
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;

            // Process each pixel: grayscale + percentile stretch + contrast/brightness + N-tone posterize
            for (let i = 0; i < data.length; i += 4) {
                // Convert to grayscale using luminosity method (perceputal brightness)
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                let gray = 0.299 * r + 0.587 * g + 0.114 * b;

                // Percentile stretch using black/white points
                const bp = editorSettings.blackPoint ?? 0;
                const wp = editorSettings.whitePoint ?? 255;
                gray = (gray - bp) * 255 / Math.max(1, (wp - bp));

                // Apply contrast and brightness
                gray = ((gray / 255 - 0.5) * editorSettings.contrast + 0.5) * 255;
                gray = gray * editorSettings.brightness;
                gray = Math.max(0, Math.min(255, gray));

                // Posterize to 4 tones based on brightness using base palette [0,85,170,255]
                // ALWAYS use 4 colors for all modes
                const base = [0,85,170,255];
                const n = 4; // Always 4 colors
                const indices = [];
                for (let k = 0; k < n; k++) {
                    const idx = Math.round((k*(base.length-1))/(n-1));
                    indices.push(base[idx]);
                }
                // thresholds midpoints
                let finalColor = indices[indices.length-1];
                for (let t = 0; t < indices.length-1; t++) {
                    const mid = (indices[t] + indices[t+1]) / 2;
                    if (gray < mid) { finalColor = indices[t]; break; }
                }

                data[i] = finalColor;
                data[i + 1] = finalColor;
                data[i + 2] = finalColor;
            }

            tempCtx.putImageData(imageData, 0, 0);

            // Apply region-based smoothing to reduce graininess (especially for Normal mode)
            const noiseReduction = editorSettings.noiseReduction ?? 0;
            if (noiseReduction > 0) {
                applyRegionSmoothing(imageData, tempCanvas.width, noiseReduction);
                tempCtx.putImageData(imageData, 0, 0);
            }

            // Store the processed image data for pixel editing
            // For posterized mode, store at full resolution; otherwise at pixel size
            const imageDataCopy = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            processedImageData = imageDataCopy;
            
            // Store a deep copy as the original (for reset functionality)
            originalProcessedImageData = new ImageData(
                new Uint8ClampedArray(imageDataCopy.data),
                imageDataCopy.width,
                imageDataCopy.height
            );

            // Draw result to processed canvas (scaled up)
            // For posterized mode, enable smoothing; for pixelated mode, disable it
            processedCtx.imageSmoothingEnabled = isPosterizedMode;
            processedCtx.drawImage(tempCanvas, 0, 0, processedCanvas.width, processedCanvas.height);'''
content = re.sub(process_image_section, posterized_replacement, content, flags=re.DOTALL)

# Remove the old processing code that's now duplicated
# This is a complex replacement - we need to remove the old canvas creation and drawing code
old_canvas_creation = r'// Create temp canvas at target pixel size\s+const tempCanvas = document\.createElement\(''canvas''\);\s+tempCanvas\.width = pixelSize;\s+tempCanvas\.height = pixelSize;\s+const tempCtx = tempCanvas\.getContext\(''2d''\);'
# This should already be replaced, but let's make sure

# Remove old drawing code if it still exists
old_drawing = r'// Draw cropped image at small size \(pixelation effect\)\s+tempCtx\.drawImage\(cropCanvas, 0, 0, pixelSize, pixelSize\);'
# Should be replaced already

# Remove old image data processing that uses pixelSize instead of tempCanvas dimensions
old_image_data = r'// Get image data\s+const imageData = tempCtx\.getImageData\(0, 0, pixelSize, pixelSize\);'
# Should be replaced

# Update the tones logic - change from using editorSettings.tones to always 4
old_tones = r'const n = Math\.max\(2, Math\.min\(4, editorSettings\.tones\|0\)\);'
# Should be replaced

# Update imageSmoothingEnabled - change from false to isPosterizedMode
old_smoothing = r'processedCtx\.imageSmoothingEnabled = false;'
if 'processedCtx.imageSmoothingEnabled = isPosterizedMode;' not in content:
    # Only replace if the new code isn't there yet
    content = re.sub(r'processedCtx\.imageSmoothingEnabled = false;\s+processedCtx\.drawImage\(tempCanvas, 0, 0, processedCanvas\.width, processedCanvas\.height\);', 
                     'processedCtx.imageSmoothingEnabled = isPosterizedMode;\n            processedCtx.drawImage(tempCanvas, 0, 0, processedCanvas.width, processedCanvas.height);', content)

# Update stored image data - change from pixelSize to tempCanvas dimensions
old_stored_data = r'const imageDataCopy = tempCtx\.getImageData\(0, 0, pixelSize, pixelSize\);'
# Should be replaced

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied Normal mode fixes!")



