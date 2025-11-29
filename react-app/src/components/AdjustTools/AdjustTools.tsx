import React from 'react';
import { useImageContext } from '../../context/ImageContext';
import './AdjustTools.css';

interface AdjustToolsProps {
  content: {
    section_adjustments?: string;
    slider_contrast_label?: string;
    slider_brightness_label?: string;
    slider_tones_label?: string;
  };
}

const AdjustTools: React.FC<AdjustToolsProps> = ({ content }) => {
  const { contrast, setContrast, brightness, setBrightness, tones, setTones } = useImageContext();

  return (
    <div className="adjust-section">
      <div className="section-label">{content.section_adjustments || 'Image Adjustments'}</div>
      
      <div className="slider-control">
        <div className="slider-label">
          <span>{content.slider_contrast_label || 'Contrast'}</span>
          <span>{contrast.toFixed(1)}</span>
        </div>
        <input
          type="range"
          className="slider"
          min="0.5"
          max="2.0"
          step="0.1"
          value={contrast}
          onChange={(e) => setContrast(parseFloat(e.target.value))}
        />
      </div>

      <div className="slider-control">
        <div className="slider-label">
          <span>{content.slider_brightness_label || 'Brightness'}</span>
          <span>{brightness.toFixed(1)}</span>
        </div>
        <input
          type="range"
          className="slider"
          min="0.5"
          max="1.5"
          step="0.1"
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
        />
      </div>

      <div className="slider-control">
        <div className="slider-label">
          <span>{content.slider_tones_label || 'Tones'}</span>
          <span>{tones}</span>
        </div>
        <input
          type="range"
          className="slider"
          min="2"
          max="8"
          step="1"
          value={tones}
          onChange={(e) => setTones(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default AdjustTools;

