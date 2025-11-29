import React, { createContext, useContext, useState, ReactNode } from 'react';

export type GridSize = 48 | 75 | 96;
export type Tool = 'crop' | 'adjust' | 'paint' | null;

export interface Color {
  r: number;
  g: number;
  b: number;
  name: string;
}

export const COLOR_PALETTE: Color[] = [
  { r: 0, g: 0, b: 0, name: 'Black' },
  { r: 85, g: 85, b: 85, name: 'Dark Gray' },
  { r: 170, g: 170, b: 170, name: 'Light Gray' },
  { r: 255, g: 255, b: 255, name: 'White' }
];

interface ImageContextType {
  originalImage: HTMLImageElement | null;
  setOriginalImage: (img: HTMLImageElement | null) => void;
  imageData: ImageData | null;
  setImageData: (data: ImageData | null) => void;
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  selectedColor: Color;
  setSelectedColor: (color: Color) => void;
  standSelected: boolean;
  setStandSelected: (selected: boolean) => void;
  mountingSelected: boolean;
  setMountingSelected: (selected: boolean) => void;
  contrast: number;
  setContrast: (value: number) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  tones: number;
  setTones: (value: number) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [gridSize, setGridSize] = useState<GridSize>(75);
  const [selectedTool, setSelectedTool] = useState<Tool>(null);
  const [selectedColor, setSelectedColor] = useState<Color>(COLOR_PALETTE[0]);
  const [standSelected, setStandSelected] = useState(false);
  const [mountingSelected, setMountingSelected] = useState(false);
  const [contrast, setContrast] = useState(1.2);
  const [brightness, setBrightness] = useState(1.0);
  const [tones, setTones] = useState(4);

  const value: ImageContextType = {
    originalImage,
    setOriginalImage,
    imageData,
    setImageData,
    gridSize,
    setGridSize,
    selectedTool,
    setSelectedTool,
    selectedColor,
    setSelectedColor,
    standSelected,
    setStandSelected,
    mountingSelected,
    setMountingSelected,
    contrast,
    setContrast,
    brightness,
    setBrightness,
    tones,
    setTones
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

