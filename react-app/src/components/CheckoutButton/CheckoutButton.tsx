import React, { useState } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { apiService } from '../../services/api';
import { canvasToBlob } from '../../utils/imageProcessing';
import './CheckoutButton.css';

import { Prices } from '../../services/api';

interface CheckoutButtonProps {
  onView3D: () => void;
  prices: Prices;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ onView3D, prices }) => {
  const { imageData, gridSize, standSelected, mountingSelected } = useImageContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotalPrice = () => {
    let basePrice = prices[`${gridSize}x${gridSize}`] || 0;
    if (standSelected) basePrice += prices.stand || 0;
    if (mountingSelected) basePrice += prices.wall_mounting_dots || 0;
    return basePrice;
  };

  const handleProceedToCheckout = async () => {
    if (!imageData) {
      alert('Please upload and process an image first');
      return;
    }

    setIsProcessing(true);
    try {
      // Get canvas from image data
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.putImageData(imageData, 0, 0);

      // Convert to PNG
      const pngBlob = await canvasToBlob(canvas, 'image/png');
      const pngFile = new File([pngBlob], 'image.png', { type: 'image/png' });

      // Get STL file
      const stlUrl = await apiService.getSTL(gridSize);
      const stlResponse = await fetch(stlUrl);
      const stlBlob = await stlResponse.blob();
      const stlFile = new File([stlBlob], 'model.stl', { type: 'application/octet-stream' });

      // Upload for checkout
      const result = await apiService.uploadForCheckout({
        stlFile,
        pngFile,
        gridSize,
        standSelected,
        mountingSelected,
        totalPrice: calculateTotalPrice()
      });

      // Redirect to checkout (or show success)
      alert(`Order created! Order ID: ${result.order_id}\nTotal: $${result.price.toFixed(2)}`);
      // In production, redirect to Shopify checkout here
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error processing checkout: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-section">
      <button
        className="view-3d-btn"
        onClick={onView3D}
        disabled={!imageData || isProcessing}
      >
        View in 3D
      </button>
      <button
        className="checkout-btn"
        onClick={handleProceedToCheckout}
        disabled={!imageData || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
      </button>
    </div>
  );
};

export default CheckoutButton;

