import React from 'react';
import { useImageContext, COLOR_PALETTE } from '../../context/ImageContext';
import './PaintTools.css';

interface PaintToolsProps {
  content: {
    section_painting?: string;
    color_black_title?: string;
    color_darkgray_title?: string;
    color_lightgray_title?: string;
    color_white_title?: string;
  };
}

const PaintTools: React.FC<PaintToolsProps> = ({ content }) => {
  const { selectedColor, setSelectedColor, setSelectedTool } = useImageContext();

  const colorLabels = [
    content.color_black_title || 'Black',
    content.color_darkgray_title || 'Dark Gray',
    content.color_lightgray_title || 'Light Gray',
    content.color_white_title || 'White'
  ];

  const handleColorSelect = (color: typeof COLOR_PALETTE[0], index: number) => {
    setSelectedColor(color);
    setSelectedTool('paint');
  };

  return (
    <div className="paint-section">
      <div className="section-label">{content.section_painting || 'Painting'}</div>
      <div className="color-palette">
        {COLOR_PALETTE.map((color, index) => (
          <div
            key={index}
            className={`color-swatch ${selectedColor.r === color.r && selectedColor.g === color.g && selectedColor.b === color.b ? 'selected' : ''}`}
            style={{ background: `rgb(${color.r}, ${color.g}, ${color.b})` }}
            onClick={() => handleColorSelect(color, index)}
          >
            <span>{colorLabels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaintTools;

