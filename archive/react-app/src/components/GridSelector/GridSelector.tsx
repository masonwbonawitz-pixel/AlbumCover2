import React from 'react';
import { useImageContext } from '../../context/ImageContext';
import { resizeImageToGrid } from '../../utils/imageProcessing';
import './GridSelector.css';

interface GridSelectorProps {
  content: {
    section_grid?: string;
    grid_btn_48?: string;
    grid_btn_75?: string;
    grid_btn_96?: string;
  };
}

const GridSelector: React.FC<GridSelectorProps> = ({ content }) => {
  const { gridSize, setGridSize, originalImage, setImageData } = useImageContext();

  const handleGridSelect = (size: 48 | 75 | 96) => {
    setGridSize(size);
    
    // Resize image if already loaded
    if (originalImage) {
      const resizedCanvas = resizeImageToGrid(originalImage, size);
      const ctx = resizedCanvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, size, size);
        setImageData(imageData);
      }
    }
  };

  return (
    <div className="grid-section">
      <div className="section-label">{content.section_grid || '2. Select Grid Size'}</div>
      <div className="grid-options">
        <button
          className={`grid-btn ${gridSize === 48 ? 'active' : ''}`}
          onClick={() => handleGridSelect(48)}
        >
          {content.grid_btn_48 || '48 × 48'}
        </button>
        <button
          className={`grid-btn ${gridSize === 75 ? 'active' : ''}`}
          onClick={() => handleGridSelect(75)}
        >
          {content.grid_btn_75 || '75 × 75'}
        </button>
        <button
          className={`grid-btn ${gridSize === 96 ? 'active' : ''}`}
          onClick={() => handleGridSelect(96)}
        >
          {content.grid_btn_96 || '96 × 96'}
        </button>
      </div>
    </div>
  );
};

export default GridSelector;

