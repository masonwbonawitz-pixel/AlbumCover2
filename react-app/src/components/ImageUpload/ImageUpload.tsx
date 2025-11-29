import React, { useRef, useState, useEffect } from 'react';
import { useImageContext } from '../../context/ImageContext';
import heic2any from 'heic2any';
import { resizeImageToGrid, applyAdjustments } from '../../utils/imageProcessing';
import './ImageUpload.css';

interface ImageUploadProps {
  content: {
    section_upload?: string;
    upload_image_text?: string;
    upload_subtext?: string;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({ content }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setOriginalImage, setImageData, gridSize, contrast, brightness, tones } = useImageContext();
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    // Handle HEIC format
    if (file.name.toLowerCase().endsWith('.heic') || 
        file.name.toLowerCase().endsWith('.heif')) {
      try {
        const conversionResult = await heic2any({
          blob: file,
          toType: "image/png",
          quality: 1.0
        });
        const convertedFile = Array.isArray(conversionResult) 
          ? conversionResult[0] 
          : conversionResult;
        await processImageFile(convertedFile as File);
      } catch (error) {
        console.error('HEIC conversion error:', error);
        alert('Error converting HEIC file');
      }
    } else {
      await processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          console.log('Image loaded, dimensions:', img.width, 'x', img.height);
          console.log('Grid size:', gridSize);
          
          // Set original image first
          setOriginalImage(img);
          setUploadedFileName(file.name);
          
          // Resize to grid
          const resizedCanvas = resizeImageToGrid(img, gridSize);
          const ctx = resizedCanvas.getContext('2d');
          if (ctx) {
            // Get raw image data from resized canvas (BEFORE adjustments)
            let rawImageData = ctx.getImageData(0, 0, gridSize, gridSize);
            console.log('Raw ImageData created, size:', rawImageData.width, 'x', rawImageData.height);
            
            // Apply initial adjustments (contrast, brightness, tones) for initial display
            let processedImageData = applyAdjustments(rawImageData, { contrast, brightness, tones });
            console.log('Initial adjustments applied, processed size:', processedImageData.width, 'x', processedImageData.height);
            
            // Set the processed image data in context - this will trigger canvas rendering
            // The ImageCanvas component will store this as baseImageData and handle future adjustments
            setImageData(processedImageData);
            console.log('Processed ImageData set in context, should trigger canvas render');
          } else {
            console.error('Could not get canvas context');
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          resolve();
        };
        img.onerror = (error) => {
          console.error('Image load error:', error);
          reject(error);
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="upload-section">
      <div className="section-label">{content.section_upload || '1. Upload Color Image'}</div>
      <div 
        className={`upload-area ${uploadedFileName ? 'has-file' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-icon">🖼️</div>
        <div className="upload-text">
          {uploadedFileName || content.upload_image_text || 'Choose image file...'}
        </div>
        <div className="upload-subtext">
          {content.upload_subtext || `Will be resized to ${gridSize}×${gridSize} pixels`}
        </div>
      </div>
      <input
        ref={fileInputRef}
        id="png-input"
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.heic,.heif"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default ImageUpload;

