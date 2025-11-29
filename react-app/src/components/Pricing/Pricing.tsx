import React, { useMemo } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { Prices } from '../../services/api';
import './Pricing.css';

interface PricingProps {
  prices: Prices;
  content: {
    label_dimensions?: string;
    label_addons?: string;
  };
}

const Pricing: React.FC<PricingProps> = ({ prices, content }) => {
  const { gridSize, standSelected, mountingSelected } = useImageContext();

  const totalPrice = useMemo(() => {
    let basePrice = prices[`${gridSize}x${gridSize}` as keyof Prices] as number;
    if (standSelected) basePrice += prices.stand;
    if (mountingSelected) basePrice += prices.wall_mounting_dots;
    return basePrice;
  }, [gridSize, standSelected, mountingSelected, prices]);

  const addonsList = useMemo(() => {
    const addons: string[] = [];
    if (standSelected) addons.push('Stand');
    if (mountingSelected) addons.push('Wall Mounting Dots');
    return addons.length > 0 ? addons.join(', ') : 'None';
  }, [standSelected, mountingSelected]);

  return (
    <div className="price-display-section">
      <div className="price-details">
        <div className="price-detail-row">
          <span className="price-detail-label">{content.label_dimensions || 'Dimensions:'}</span>
          <span className="price-detail-value">{gridSize} × {gridSize}</span>
        </div>
        <div className="price-detail-row">
          <span className="price-detail-label">{content.label_addons || 'Addons:'}</span>
          <span className="price-detail-value">{addonsList}</span>
        </div>
      </div>
      <div className="total-price">
        <span className="total-price-label">Total:</span>
        <span className="total-price-value">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Pricing;

