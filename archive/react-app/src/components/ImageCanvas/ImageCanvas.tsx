import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { applyAdjustments } from '../../utils/imageProcessing';
import './ImageCanvas.css';

interface ImageCanvasProps {
  content: {
    canvas_label?: string;
  };
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ content }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { imageData, setImageData, selectedTool, selectedColor, contrast, brightness, tones, originalImage, gridSize } = useImageContext();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [baseImageData, setBaseImageData] = useState<ImageData | null>(null);
  const isInitialLoadRef = useRef(true);

  // Define drawImageData function before useEffects that use it
  const drawImageData = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas ref is null');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context');
      return;
    }
    
    if (!imageData) {
      console.warn('No imageData to draw');
      return;
    }
    const imageDataToDraw = imageData;
    
    console.log('drawImageData called, imageData size:', imageDataToDraw.width, 'x', imageDataToDraw.height);
    
    // Calculate display size exactly as per original HTML processImage() function
    const editorPanel = document.getElementById('editor-panel');
    if (editorPanel) {
      // Exact calculation from original desktop.html processImage() function
      const containerWidth = Math.max(200, editorPanel.clientWidth - 88); // padding: 24px left + 40px right + margin
      const reservedHeight = 80;
      const availableHeight = window.innerHeight - reservedHeight;
      const maxSize = Math.max(containerWidth, availableHeight * 0.95);
      const side = Math.min(containerWidth * 0.98, availableHeight * 0.95, maxSize) + 100;
      
      // Set canvas INTERNAL resolution to large size (not grid size!)
      // This is the key - canvas.width/height should be large, not small
      canvas.width = side;
      canvas.height = side;
      
      // CRITICAL: Clear the canvas AFTER setting dimensions to prevent gray/blank display
      ctx.clearRect(0, 0, side, side);
      
      // Clear any inline width/height styles - let CSS control display
      canvas.style.width = '';
      canvas.style.height = '';
      canvas.style.maxWidth = '';
      
      // Create temp canvas at grid size with the processed image data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imageDataToDraw.width; // Grid size (e.g., 75)
      tempCanvas.height = imageDataToDraw.height; // Grid size (e.g., 75)
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        // Put the small image data on temp canvas
        tempCtx.putImageData(imageDataToDraw, 0, 0);
        
        // Disable smoothing for pixelated look (except for 48x48)
        ctx.imageSmoothingEnabled = (gridSize === 48);
        
        // Draw temp canvas (small) onto main canvas (large) - this scales it up
        ctx.drawImage(tempCanvas, 0, 0, side, side);
        console.log('Canvas drawn successfully (desktop), size:', side, 'x', side);
      } else {
        console.warn('Could not get temp canvas context (desktop)');
      }
    } else {
      // Fallback for mobile or when editor-panel not found
      const container = canvas.parentElement?.closest('.viewer-panel') || canvas.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        // For mobile, use container width minus padding
        const availableWidth = containerRect.width - 48; // 24px padding on each side
        const availableHeight = window.innerHeight * 0.6;
        const side = Math.min(availableWidth, availableHeight);
        
        canvas.width = side;
        canvas.height = side;
        
        // CRITICAL: Clear the canvas AFTER setting dimensions
        ctx.clearRect(0, 0, side, side);
        
        canvas.style.width = '';
        canvas.style.height = '';
        canvas.style.maxWidth = '';
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageDataToDraw.width;
        tempCanvas.height = imageDataToDraw.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.putImageData(imageDataToDraw, 0, 0);
          // Disable smoothing for pixelated look (except for 48x48)
          ctx.imageSmoothingEnabled = (gridSize === 48);
          ctx.drawImage(tempCanvas, 0, 0, side, side);
          console.log('Canvas drawn (mobile fallback), size:', side, 'x', side);
        } else {
          console.warn('Could not get temp canvas context (mobile)');
        }
      } else {
        // Ultimate fallback - use a reasonable default size
        const fallbackSize = 400;
        canvas.width = fallbackSize;
        canvas.height = fallbackSize;
        
        // CRITICAL: Clear the canvas AFTER setting dimensions
        ctx.clearRect(0, 0, fallbackSize, fallbackSize);
        
        canvas.style.width = '';
        canvas.style.height = '';
        canvas.style.maxWidth = '';
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageDataToDraw.width;
        tempCanvas.height = imageDataToDraw.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.putImageData(imageDataToDraw, 0, 0);
          ctx.imageSmoothingEnabled = (gridSize === 48);
          ctx.drawImage(tempCanvas, 0, 0, fallbackSize, fallbackSize);
          console.log('Canvas drawn (ultimate fallback), size:', fallbackSize, 'x', fallbackSize);
        } else {
          console.warn('Could not get temp canvas context (fallback)');
        }
      }
    }
  }, [imageData, gridSize]);

  // Store base image data when imageData first loads (store a copy to prevent double processing)
  useEffect(() => {
    if (imageData && !baseImageData) {
      // Store a deep copy of the image data as the base (raw processed image)
      const rawCopy = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
      );
      setBaseImageData(rawCopy);
      setIsImageLoaded(true);
      isInitialLoadRef.current = true; // Mark as initial load
      console.log('Base image data stored, isImageLoaded set to true');
    }
  }, [imageData, baseImageData]);

  // Apply adjustments when sliders change (only if baseImageData exists and image is loaded)
  // Skip this on initial load - ImageUpload already applies initial adjustments
  useEffect(() => {
    // Only apply adjustments if baseImageData exists AND we've already loaded an image
    // Skip on initial load to prevent double-processing
    if (baseImageData && canvasRef.current && isImageLoaded && !isInitialLoadRef.current) {
      // Apply adjustments to the base (raw) image data
      const adjusted = applyAdjustments(baseImageData, { contrast, brightness, tones });
      setImageData(adjusted);
      console.log('Adjustments applied to base image data');
    } else if (isInitialLoadRef.current && baseImageData && isImageLoaded) {
      // Mark initial load as complete after first render
      isInitialLoadRef.current = false;
    }
  }, [contrast, brightness, tones, baseImageData, isImageLoaded, setImageData]);

  // Draw when imageData changes
  useEffect(() => {
    if (imageData && canvasRef.current && isImageLoaded) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        // Use a small delay to ensure DOM measurements are accurate
        setTimeout(() => {
          console.log('Drawing imageData to canvas, size:', imageData.width, 'x', imageData.height);
          drawImageData();
        }, 100);
      });
    }
  }, [imageData, drawImageData, isImageLoaded]);

  // Handle window resize to recalculate canvas display size
  useEffect(() => {
    if (!imageData) return;
    
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (imageData && canvasRef.current) {
          drawImageData();
        }
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [imageData, drawImageData]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== 'paint' || !canvasRef.current || !imageData) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to canvas coordinates
    const pixelX = Math.floor(x * (canvas.width / rect.width));
    const pixelY = Math.floor(y * (canvas.height / rect.height));
    
    // Paint pixel
    paintPixel(pixelX, pixelY);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== 'paint' || !e.buttons || !canvasRef.current || !imageData) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pixelX = Math.floor(x * (canvas.width / rect.width));
    const pixelY = Math.floor(y * (canvas.height / rect.height));
    
    paintPixel(pixelX, pixelY);
  };

  const paintPixel = (x: number, y: number) => {
    if (!imageData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const data = new Uint8ClampedArray(imageData.data);
    const index = (y * imageData.width + x) * 4;
    
    if (index >= 0 && index < data.length - 3) {
      data[index] = selectedColor.r;
      data[index + 1] = selectedColor.g;
      data[index + 2] = selectedColor.b;
      // data[index + 3] = 255; // Alpha
    }
    
    const newImageData = new ImageData(data, imageData.width, imageData.height);
    setImageData(newImageData);
  };

  if (!isImageLoaded) {
    return (
      <div className="canvas-placeholder">
        <div className="placeholder-icon">📷</div>
        <p>Upload an image to begin</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      id="processed-canvas"
      className="editor-canvas"
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      style={{ 
        maxWidth: '100%', 
        maxHeight: 'calc(100vh - 100px)', 
        width: 'auto', 
        aspectRatio: '1/1', 
        cursor: 'crosshair',
        backgroundColor: '#ffffff',
        display: 'block'
      }}
    />
  );
};

export default ImageCanvas;

