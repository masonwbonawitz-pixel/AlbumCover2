import React from 'react';
import { useImageContext } from '../../context/ImageContext';
import { Images, Prices } from '../../services/api';
import './AddOns.css';

interface AddOnsProps {
  prices: Prices;
  images: Images;
  content: {
    stand_name?: string;
    mounting_name?: string;
  };
}

const AddOns: React.FC<AddOnsProps> = ({ prices, images, content }) => {
  const { standSelected, setStandSelected, mountingSelected, setMountingSelected } = useImageContext();

  return (
    <div className="addons-section">
      <div className="section-label">Add-ons</div>
      
      <div className="stand-item">
        <div className="item-left">
          {images.stand && (
            <img src={images.stand} alt="Stand" className="item-image" />
          )}
          <div className="item-info">
            <div className="item-name">{content.stand_name || 'Stand'}</div>
            <div className="item-price">${prices.stand.toFixed(2)}</div>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={standSelected}
            onChange={(e) => setStandSelected(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="stand-item">
        <div className="item-left">
          {images.wall_mounting_dots && (
            <img src={images.wall_mounting_dots} alt="Mounting Dots" className="item-image" />
          )}
          <div className="item-info">
            <div className="item-name">{content.mounting_name || 'Nano Wall Mounting Dots (Pack of 8)'}</div>
            <div className="item-price">${prices.wall_mounting_dots.toFixed(2)}</div>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={mountingSelected}
            onChange={(e) => setMountingSelected(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );
};

export default AddOns;

