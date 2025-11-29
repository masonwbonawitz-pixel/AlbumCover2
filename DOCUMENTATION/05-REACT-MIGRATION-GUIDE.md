# React Migration Guide

This guide provides complete instructions and code examples for converting the HTML/JS application to a React application suitable for Shopify integration.

---

## Project Setup

### 1. Create React App

```bash
npx create-react-app rize-albums-react
cd rize-albums-react
```

### 2. Install Dependencies

```bash
npm install react-router-dom axios three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

### 3. Project Structure

```
rize-albums-react/
├── src/
│   ├── components/
│   │   ├── ImageUpload/
│   │   ├── GridSelector/
│   │   ├── ImageCanvas/
│   │   ├── AdjustTools/
│   │   ├── PaintTools/
│   │   ├── ThreeViewer/
│   │   ├── AddOns/
│   │   ├── Pricing/
│   │   └── Checkout/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── DesktopPage.jsx
│   │   ├── MobilePage.jsx
│   │   └── AdminPage.jsx
│   ├── hooks/
│   │   ├── useImageProcessing.js
│   │   ├── useThreeViewer.js
│   │   └── useApi.js
│   ├── utils/
│   │   ├── imageProcessing.js
│   │   ├── colorMapping.js
│   │   └── fileUtils.js
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   ├── ImageContext.js
│   │   └── OrderContext.js
│   └── App.js
├── public/
└── package.json
```

---

## Component 1: ImageUpload Component

### File: `src/components/ImageUpload/ImageUpload.jsx`

```jsx
import React, { useRef, useState } from 'react';
import { useImageContext } from '../../context/ImageContext';
import heic2any from 'heic2any';
import './ImageUpload.css';

const ImageUpload = ({ content }) => {
  const fileInputRef = useRef(null);
  const { setImage, setImageData, setOriginalImage } = useImageContext();
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileSelect = async (file) => {
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
        await processImageFile(convertedFile);
      } catch (error) {
        console.error('HEIC conversion error:', error);
        alert('Error converting HEIC file');
      }
    } else {
      await processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setUploadedFileName(file.name);
          resolve(img);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="upload-section">
      <div className="section-label">{content.section_upload}</div>
      <div 
        className="upload-area"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-icon">🖼️</div>
        <div className="upload-text">
          {uploadedFileName || content.upload_image_text}
        </div>
        <div className="upload-subtext">{content.upload_subtext}</div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />
    </div>
  );
};

export default ImageUpload;
```

### CSS: `src/components/ImageUpload/ImageUpload.css`

```css
.upload-section {
  margin-bottom: 30px;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
  margin-bottom: 15px;
}

.upload-area:hover {
  border-color: #999;
  background: #f5f5f5;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.upload-text {
  font-size: 14px;
  color: #333333;
  margin-bottom: 5px;
}

.upload-subtext {
  font-size: 12px;
  color: #666;
}
```

---

## Component 2: ImageCanvas Component

### File: `src/components/ImageCanvas/ImageCanvas.jsx`

```jsx
import React, { useRef, useEffect, useState } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { resizeImageToGrid, applyAdjustments } from '../../utils/imageProcessing';
import './ImageCanvas.css';

const ImageCanvas = ({ gridSize, content }) => {
  const canvasRef = useRef(null);
  const { originalImage, imageData, setImageData, selectedTool } = useImageContext();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      resizeAndDrawImage();
    }
  }, [originalImage, gridSize]);

  useEffect(() => {
    if (imageData && canvasRef.current) {
      drawImageData();
    }
  }, [imageData]);

  const resizeAndDrawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = gridSize;
    canvas.height = gridSize;
    
    // Resize and draw image
    const resized = resizeImageToGrid(originalImage, gridSize);
    ctx.drawImage(resized, 0, 0, gridSize, gridSize);
    
    // Store image data
    const newImageData = ctx.getImageData(0, 0, gridSize, gridSize);
    setImageData(newImageData);
    setIsImageLoaded(true);
  };

  const drawImageData = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
  };

  const handleCanvasClick = (e) => {
    if (selectedTool !== 'paint') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to canvas coordinates
    const pixelX = Math.floor(x * (canvas.width / rect.width));
    const pixelY = Math.floor(y * (canvas.height / rect.height));
    
    // Paint pixel (handled by parent component)
    // onPaintPixel(pixelX, pixelY);
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
    <div className="canvas-container">
      <div className="canvas-label">{content.canvas_label}</div>
      <canvas
        ref={canvasRef}
        className="editor-canvas"
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default ImageCanvas;
```

---

## Component 3: GridSelector Component

### File: `src/components/GridSelector/GridSelector.jsx`

```jsx
import React from 'react';
import { useImageContext } from '../../context/ImageContext';
import './GridSelector.css';

const GridSelector = ({ content, onGridChange }) => {
  const { gridSize, setGridSize } = useImageContext();

  const handleGridSelect = (size) => {
    setGridSize(size);
    if (onGridChange) onGridChange(size);
  };

  return (
    <div className="grid-section">
      <div className="section-label">{content.section_grid}</div>
      <div className="grid-options">
        <button
          className={`grid-btn ${gridSize === 48 ? 'active' : ''}`}
          onClick={() => handleGridSelect(48)}
        >
          {content.grid_btn_48}
        </button>
        <button
          className={`grid-btn ${gridSize === 75 ? 'active' : ''}`}
          onClick={() => handleGridSelect(75)}
        >
          {content.grid_btn_75}
        </button>
        <button
          className={`grid-btn ${gridSize === 96 ? 'active' : ''}`}
          onClick={() => handleGridSelect(96)}
        >
          {content.grid_btn_96}
        </button>
      </div>
    </div>
  );
};

export default GridSelector;
```

---

## Component 4: AdjustTools Component

### File: `src/components/AdjustTools/AdjustTools.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { applyAdjustments } from '../../utils/imageProcessing';
import './AdjustTools.css';

const AdjustTools = ({ content }) => {
  const { originalImage, gridSize, imageData, setImageData } = useImageContext();
  const [contrast, setContrast] = useState(1.2);
  const [brightness, setBrightness] = useState(1.0);
  const [tones, setTones] = useState(4);

  useEffect(() => {
    if (imageData && originalImage) {
      applyImageAdjustments();
    }
  }, [contrast, brightness, tones, imageData]);

  const applyImageAdjustments = () => {
    if (!imageData) return;
    
    const adjusted = applyAdjustments(imageData, {
      contrast,
      brightness,
      tones
    });
    
    setImageData(adjusted);
  };

  return (
    <div className="adjust-section">
      <div className="section-label">{content.section_adjustments}</div>
      
      <div className="slider-control">
        <div className="slider-label">
          <span>{content.slider_contrast_label}</span>
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
          <span>{content.slider_brightness_label}</span>
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
          <span>{content.slider_tones_label}</span>
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
```

---

## Component 5: ThreeViewer Component

### File: `src/components/ThreeViewer/ThreeViewer.jsx`

```jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useImageContext } from '../../context/ImageContext';
import { applyColorsToMesh } from '../../utils/colorMapping';
import './ThreeViewer.css';

const ThreeViewer = ({ stlUrl, onBack }) => {
  const containerRef = useRef(null);
  const { imageData, gridSize } = useImageContext();
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !stlUrl || !imageData) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.offsetWidth,
      containerRef.current.offsetHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load STL
    const loader = new STLLoader();
    loader.load(stlUrl, (geometry) => {
      // Apply colors from image
      const coloredGeometry = applyColorsToMesh(geometry, imageData, gridSize);
      
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true
      });

      const mesh = new THREE.Mesh(coloredGeometry, material);
      scene.add(mesh);

      // Center camera
      geometry.computeBoundingBox();
      const center = geometry.boundingBox.getCenter(new THREE.Vector3());
      camera.position.set(center.x, center.y, center.z + 100);
      controls.target.copy(center);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.offsetWidth,
        containerRef.current.offsetHeight
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [stlUrl, imageData, gridSize]);

  return (
    <div className="three-viewer-container" ref={containerRef}>
      <div className="viewer-controls">
        <button className="viewer-btn" onClick={onBack}>
          Back to Editor
        </button>
        <button 
          className="viewer-btn" 
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.reset();
            }
          }}
        >
          Reset Camera
        </button>
      </div>
    </div>
  );
};

export default ThreeViewer;
```

---

## Context: ImageContext

### File: `src/context/ImageContext.js`

```jsx
import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within ImageProvider');
  }
  return context;
};

export const ImageProvider = ({ children }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [gridSize, setGridSize] = useState(75);
  const [selectedTool, setSelectedTool] = useState(null);
  const [standSelected, setStandSelected] = useState(false);
  const [mountingSelected, setMountingSelected] = useState(false);

  const value = {
    originalImage,
    setOriginalImage,
    imageData,
    setImageData,
    gridSize,
    setGridSize,
    selectedTool,
    setSelectedTool,
    standSelected,
    setStandSelected,
    mountingSelected,
    setMountingSelected
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};
```

---

## Service: API Service

### File: `src/services/api.js`

```jsx
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiService = {
  // Get prices
  getPrices: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/prices`);
    return response.data;
  },

  // Get images
  getImages: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/images`);
    return response.data;
  },

  // Get content
  getContent: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/content`);
    return response.data;
  },

  // Get STL file
  getSTL: async (size) => {
    const response = await axios.get(`${API_BASE_URL}/get-stl/${size}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  },

  // Generate OBJ
  generateOBJ: async (stlFile, pngFile, gridSize) => {
    const formData = new FormData();
    formData.append('stl', stlFile);
    formData.append('png', pngFile);
    formData.append('grid_size', gridSize);

    const response = await axios.post(
      `${API_BASE_URL}/generate-obj`,
      formData,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Upload for checkout
  uploadForCheckout: async (orderData) => {
    const formData = new FormData();
    formData.append('stl', orderData.stlFile);
    formData.append('png', orderData.pngFile);
    formData.append('grid_size', orderData.gridSize);
    formData.append('stand_selected', orderData.standSelected);
    formData.append('mounting_selected', orderData.mountingSelected);
    formData.append('total_price', orderData.totalPrice);

    const response = await axios.post(
      `${API_BASE_URL}/upload-for-checkout`,
      formData
    );
    return response.data;
  }
};
```

---

## Main Page Component

### File: `src/pages/HomePage.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { ImageProvider, useImageContext } from '../context/ImageContext';
import { apiService } from '../services/api';
import ImageUpload from '../components/ImageUpload/ImageUpload';
import GridSelector from '../components/GridSelector/GridSelector';
import ImageCanvas from '../components/ImageCanvas/ImageCanvas';
import AdjustTools from '../components/AdjustTools/AdjustTools';
import PaintTools from '../components/PaintTools/PaintTools';
import AddOns from '../components/AddOns/AddOns';
import Pricing from '../components/Pricing/Pricing';
import CheckoutButton from '../components/Checkout/CheckoutButton';
import ThreeViewer from '../components/ThreeViewer/ThreeViewer';
import './HomePage.css';

const HomePageContent = () => {
  const { 
    originalImage, 
    gridSize, 
    imageData,
    standSelected,
    mountingSelected 
  } = useImageContext();
  
  const [content, setContent] = useState({});
  const [prices, setPrices] = useState({});
  const [show3DView, setShow3DView] = useState(false);
  const [stlUrl, setStlUrl] = useState(null);

  useEffect(() => {
    loadContent();
    loadPrices();
  }, []);

  useEffect(() => {
    if (show3DView && gridSize) {
      loadSTL();
    }
  }, [show3DView, gridSize]);

  const loadContent = async () => {
    try {
      const data = await apiService.getContent();
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadPrices = async () => {
    try {
      const data = await apiService.getPrices();
      setPrices(data);
    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  const loadSTL = async () => {
    try {
      const url = await apiService.getSTL(gridSize);
      setStlUrl(url);
    } catch (error) {
      console.error('Error loading STL:', error);
    }
  };

  const handleView3D = () => {
    if (!imageData) {
      alert('Please upload and process an image first');
      return;
    }
    setShow3DView(true);
  };

  if (show3DView && stlUrl) {
    return (
      <ThreeViewer
        stlUrl={stlUrl}
        onBack={() => setShow3DView(false)}
      />
    );
  }

  return (
    <div className="home-page">
      <div className="main-container">
        <div className="viewer-panel">
          <h2 className="panel-title">{content.panel_title}</h2>
          <ImageCanvas gridSize={gridSize} content={content} />
        </div>

        <div className="control-panel">
          <h1 className="title">{content.title}</h1>
          <div className="price-subtitle">{content.price_subtitle}</div>

          <ImageUpload content={content} />
          <GridSelector content={content} />
          <AdjustTools content={content} />
          <PaintTools content={content} />
          <AddOns prices={prices} />
          <Pricing 
            prices={prices} 
            gridSize={gridSize}
            standSelected={standSelected}
            mountingSelected={mountingSelected}
          />
          <CheckoutButton onView3D={handleView3D} />
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <ImageProvider>
      <HomePageContent />
    </ImageProvider>
  );
};

export default HomePage;
```

---

## App.js Setup

### File: `src/App.js`

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

## Utility Functions

### File: `src/utils/imageProcessing.js`

```jsx
export const resizeImageToGrid = (image, gridSize) => {
  const canvas = document.createElement('canvas');
  canvas.width = gridSize;
  canvas.height = gridSize;
  const ctx = canvas.getContext('2d');
  
  // Maintain aspect ratio, center crop
  const scale = Math.max(gridSize / image.width, gridSize / image.height);
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;
  const x = (scaledWidth - gridSize) / 2;
  const y = (scaledHeight - gridSize) / 2;
  
  ctx.drawImage(
    image,
    -x / scale,
    -y / scale,
    image.width,
    image.height
  );
  
  return canvas;
};

export const applyAdjustments = (imageData, { contrast, brightness, tones }) => {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    // Get RGB
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    
    // Apply brightness
    r = Math.min(255, Math.max(0, r * brightness));
    g = Math.min(255, Math.max(0, g * brightness));
    b = Math.min(255, Math.max(0, b * brightness));
    
    // Apply contrast
    r = Math.min(255, Math.max(0, (r - 128) * contrast + 128));
    g = Math.min(255, Math.max(0, (g - 128) * contrast + 128));
    b = Math.min(255, Math.max(0, (b - 128) * contrast + 128));
    
    // Convert to grayscale
    const gray = (r + g + b) / 3;
    
    // Apply tone quantization
    const quantizedGray = Math.floor(gray / (255 / tones)) * (255 / tones);
    
    data[i] = quantizedGray;
    data[i + 1] = quantizedGray;
    data[i + 2] = quantizedGray;
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};
```

---

## Shopify Integration Points

### 1. Checkout Integration

Replace checkout button with Shopify checkout:

```jsx
import { useNavigate } from 'react-router-dom';

const CheckoutButton = ({ orderData }) => {
  const navigate = useNavigate();
  
  const handleCheckout = async () => {
    // Upload order files
    const result = await apiService.uploadForCheckout(orderData);
    
    // Redirect to Shopify checkout with order ID
    const shopifyCheckoutUrl = `https://your-store.myshopify.com/cart/add?items[]=${result.order_id}`;
    window.location.href = shopifyCheckoutUrl;
  };
  
  return (
    <button onClick={handleCheckout} className="checkout-btn">
      Proceed to Checkout
    </button>
  );
};
```

### 2. Shopify App Proxy

Set up Shopify App Proxy to handle API requests:

```javascript
// In your Shopify app
app.get('/api/*', async (req, res) => {
  // Proxy to your backend
  const backendUrl = process.env.BACKEND_URL;
  const response = await fetch(`${backendUrl}${req.path}`);
  const data = await response.json();
  res.json(data);
});
```

---

## Environment Variables

### File: `.env`

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SHOPIFY_STORE_URL=https://your-store.myshopify.com
```

---

## Key Migration Differences

1. **State Management**: Use React Context instead of global variables
2. **DOM Manipulation**: Use refs and state instead of direct DOM access
3. **Event Handlers**: Use React event handlers (onClick, onChange)
4. **Component Lifecycle**: Use useEffect hooks
5. **File Uploads**: Use FileReader and state management
6. **Canvas Operations**: Use refs to access canvas elements
7. **Three.js**: Use useEffect to initialize and cleanup

---

## Testing Checklist

- [ ] Image upload works
- [ ] Grid selection updates price
- [ ] Adjustments apply correctly
- [ ] Paint tool functions
- [ ] 3D viewer loads and displays
- [ ] Add-ons update price
- [ ] Checkout process works
- [ ] Admin panel functions
- [ ] API calls succeed
- [ ] Mobile responsive

