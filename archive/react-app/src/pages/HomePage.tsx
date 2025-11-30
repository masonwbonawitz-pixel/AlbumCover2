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
import './HomePage.css';

const HomePageContent: React.FC = () => {
  const { imageData, gridSize } = useImageContext();
  
  const [content, setContent] = useState<Content>({} as Content);
  const [prices, setPrices] = useState<Prices>({} as Prices);
  const [images, setImages] = useState<Images>({} as Images);
  const [show3DView, setShow3DView] = useState(false);
  const [stlUrl, setStlUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (show3DView && gridSize) {
      loadSTL();
    }
  }, [show3DView, gridSize, loadSTL]);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }


  return (
    <div className="home-page">
      <div className="main-container">
        <div className="viewer-panel">
          {!show3DView ? (
            <div id="editor-panel">
              <div className="panel-header">
                <h2 className="panel-title">{content.panel_title || 'Edit Your Photo'}</h2>
                <button className="viewer-btn" onClick={handleView3D}>
                  View in 3D
                </button>
              </div>
              <div className="editor-grid">
                <div className="canvas-wrapper">
                  <div className="canvas-label" id="desktop-canvas-label" style={{ display: imageData ? 'block' : 'none' }}>
                    Processed (Posterized)
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <ImageCanvas content={content} />
                    <div id="processed-controls">
                      <button title="Zoom In">+</button>
                      <button title="Zoom Out">−</button>
                      <button title="Reset View">□</button>
                      <button title="Pan">⤡</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div id="canvas-container" className="active">
              <div className="viewer-controls">
                <button className="viewer-btn" onClick={() => setShow3DView(false)}>
                  Edit Photo
                </button>
                <button className="viewer-btn icon-only" onClick={() => {/* resetCamera */}}>
                  ↺
                </button>
                <button className="viewer-btn icon-only" onClick={() => {/* toggleWireframe */}}>
                  □
                </button>
              </div>
              {stlUrl ? (
                <ThreeViewer
                  stlUrl={stlUrl}
                  onBack={() => setShow3DView(false)}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '80px', opacity: 0.3, marginBottom: '20px' }}>□</div>
                    <div>Loading 3D model...</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="control-panel">
          <h1 className="title">{content.title || '3D Album Cover Mosaic Builder'}</h1>
          <div className="price-subtitle">{content.price_subtitle || 'Create colorized 3D prints'}</div>

          <div className="section">
            <div className="section-label">{content.section_upload || '1. Upload Color Image'}</div>
            <ImageUpload content={content} />
          </div>

          <div className="section">
            <div className="section-label">{content.section_grid || '2. Select Grid Size'}</div>
            <GridSelector content={content} />
          </div>

          <div className="section">
            <div className="section-label">{content.section_adjustments || 'Image Adjustments'}</div>
            <AdjustTools content={content} />
          </div>

          <div className="section">
            <div className="section-label">{content.section_painting || 'Painting'}</div>
            <PaintTools content={content} />
          </div>

          <div className="section">
            <Pricing prices={prices} content={content} />
          </div>

          <div className="section">
            <CheckoutButton onView3D={handleView3D} prices={prices} />
          </div>

          <div className="section">
            <AddOns prices={prices} images={images} content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <ImageProvider>
      <HomePageContent />
    </ImageProvider>
  );
};

export default HomePage;

