import React, { useState, useEffect, useCallback } from 'react';
import { ImageProvider, useImageContext } from '../context/ImageContext';
import { apiService, Content, Prices, Images } from '../services/api';
import ImageUpload from '../components/ImageUpload/ImageUpload';
import GridSelector from '../components/GridSelector/GridSelector';
import ImageCanvas from '../components/ImageCanvas/ImageCanvas';
import AdjustTools from '../components/AdjustTools/AdjustTools';
import PaintTools from '../components/PaintTools/PaintTools';
import AddOns from '../components/AddOns/AddOns';
import Pricing from '../components/Pricing/Pricing';
import CheckoutButton from '../components/CheckoutButton/CheckoutButton';
import ThreeViewer from '../components/ThreeViewer/ThreeViewer';
import './MobilePage.css';

const MobilePageContent: React.FC = () => {
  const { imageData, gridSize } = useImageContext();
  
  const [content, setContent] = useState<Content>({} as Content);
  const [prices, setPrices] = useState<Prices>({} as Prices);
  const [images, setImages] = useState<Images>({} as Images);
  const [show3DView, setShow3DView] = useState(false);
  const [stlUrl, setStlUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<string>('size');
  
  const imageUploaded = !!imageData;

  const loadData = useCallback(async () => {
    try {
      const [contentData, pricesData, imagesData] = await Promise.all([
        apiService.getContent(),
        apiService.getPrices(),
        apiService.getImages()
      ]);
      setContent(contentData);
      setPrices(pricesData);
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSTL = useCallback(async () => {
    if (!gridSize) return;
    try {
      const url = await apiService.getSTL(gridSize);
      setStlUrl(url);
    } catch (error) {
      console.error('Error loading STL:', error);
      alert('Error loading STL file. Please ensure the STL file is uploaded in the admin panel.');
    }
  }, [gridSize]);

  const handleView3D = useCallback(() => {
    if (!imageData) {
      alert('Please upload and process an image first');
      return;
    }
    // Load STL if not already loaded
    if (!stlUrl && gridSize) {
      loadSTL();
    }
    setShow3DView(true);
  }, [imageData, stlUrl, gridSize, loadSTL]);

  const togglePanel = (panel: string) => {
    setActivePanel(panel);
  };

  // All hooks must be at the top, before any conditional returns
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (show3DView && gridSize) {
      loadSTL();
    }
  }, [show3DView, gridSize, loadSTL]);

  useEffect(() => {
    if (imageData && activePanel === '') {
      setActivePanel('size');
    }
  }, [imageData, activePanel]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (show3DView && stlUrl) {
    return (
      <div className="mobile-page">
        <div className="main-container">
          <div className="viewer-panel">
            <div id="canvas-container" className="active">
              <div className="viewer-controls">
                <button className="viewer-btn" onClick={() => setShow3DView(false)}>
                  Edit Photo
                </button>
                <button className="viewer-btn icon-only" onClick={() => {/* resetCamera */}}>
                  ↺
                </button>
              </div>
              <ThreeViewer
                stlUrl={stlUrl}
                onBack={() => setShow3DView(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-page">
      <div className="main-container">
        <div className="viewer-panel">
          <div id="editor-panel" className={imageUploaded ? 'active' : ''}>
            <div className="panel-header">
              <h2 className="panel-title">{content.panel_title || 'Edit Your Photo'}</h2>
              <button className="viewer-btn" onClick={handleView3D}>
                View in 3D
              </button>
            </div>
            <div className="canvas-wrapper">
              <div className="canvas-label" id="mobile-canvas-label" style={{ display: imageData ? 'block' : 'none' }}>
                Processed (Posterized)
              </div>
              <ImageCanvas content={content} />
            </div>
            <div id="processed-controls">
              <button title="Zoom In">+</button>
              <button title="Zoom Out">−</button>
              <button title="Reset View">□</button>
              <button className="viewer-btn" onClick={handleView3D}>
                View in 3D
              </button>
            </div>
          </div>
        </div>

        <div className="control-panel">
          {!imageUploaded ? (
            <>
              <div 
                id="initial-upload-box"
                onClick={() => {
                  // Trigger the ImageUpload component's file input
                  const fileInput = document.getElementById('png-input') as HTMLInputElement;
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
              >
                <div className="upload-icon">↑</div>
                <div className="upload-text">Upload an image to convert to brick art</div>
                <div className="upload-subtext">Will be initially set to 75x75</div>
              </div>
            </>
          ) : (
            <>
              <div className="top-action-buttons">
                <label 
                  htmlFor="png-input" 
                  className={activePanel === 'upload' ? 'active' : ''}
                  onClick={() => togglePanel('upload')}
                >
                  <span className="icon">↑</span>
                  <span>Upload</span>
                </label>
                <button
                  className={activePanel === 'size' ? 'active' : ''}
                  onClick={() => togglePanel('size')}
                >
                  <span className="icon">□</span>
                  <span>Size</span>
                </button>
                <button
                  className={activePanel === 'adjust' ? 'active' : ''}
                  onClick={() => togglePanel('adjust')}
                >
                  <span className="icon">☰</span>
                  <span>Adjust</span>
                </button>
                <button
                  className={activePanel === 'paint' ? 'active' : ''}
                  onClick={() => togglePanel('paint')}
                >
                  <span className="icon">✎</span>
                  <span>Paint</span>
                </button>
              </div>
            </>
          )}

          <h1 className="title">{content.title || '3D Album Cover Mosaic Builder'}</h1>
          <div className="price-subtitle">{content.price_subtitle || 'Create colorized 3D prints'}</div>

          {/* Always render ImageUpload - hidden when image uploaded and not on upload panel */}
          <div style={{ display: (imageUploaded && activePanel !== 'upload') ? 'none' : 'block' }}>
            <ImageUpload content={content} />
          </div>

          {imageUploaded && (
            <>
              <div className={`section collapsible-section ${activePanel === 'size' ? 'active' : ''}`} id="size-panel">
                <div className="section-label">{content.section_grid || '2. Select Grid Size'}</div>
                <GridSelector content={content} />
              </div>

              <div className={`section collapsible-section ${activePanel === 'adjust' ? 'active' : ''}`} id="adjust-panel">
                <div className="section-label">{content.section_adjustments || 'Image Adjustments'}</div>
                <AdjustTools content={content} />
              </div>

              <div className={`section collapsible-section ${activePanel === 'paint' ? 'active' : ''}`} id="paint-panel">
                <div className="section-label">{content.section_painting || 'Painting'}</div>
                <PaintTools content={content} />
              </div>

              <div className="section" id="price-display-section">
                <Pricing prices={prices} content={content} />
              </div>

              <div className="section">
                <CheckoutButton onView3D={handleView3D} prices={prices} />
              </div>

              <div className="section">
                <AddOns prices={prices} images={images} content={content} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MobilePage: React.FC = () => {
  return (
    <ImageProvider>
      <MobilePageContent />
    </ImageProvider>
  );
};

export default MobilePage;

