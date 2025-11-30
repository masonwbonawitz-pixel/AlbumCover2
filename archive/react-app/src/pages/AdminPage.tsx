import React, { useState, useEffect, useCallback } from 'react';

import { apiService, Prices, Content, Images } from '../services/api';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const [prices, setPrices] = useState<Prices>({} as Prices);
  const [content, setContent] = useState<Content>({} as Content);
  const [images, setImages] = useState<Images>({} as Images);
  const [activeTab, setActiveTab] = useState<'edit' | 'orders'>('edit');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const showStatus = useCallback((type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [pricesData, contentData, imagesData] = await Promise.all([
        apiService.getAdminPrices(),
        apiService.getAdminContent(),
        apiService.getAdminImages()
      ]);
      setPrices(pricesData);
      setContent(contentData);
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      showStatus('error', 'Failed to load data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [showStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveAll = async () => {
    try {
      // Save prices
      await apiService.saveAdminPrices(prices);
      
      // Save content
      await apiService.saveAdminContent(content);
      
      showStatus('success', 'All changes saved successfully!');
    } catch (error) {
      showStatus('error', 'Error saving: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleImageUpload = async (key: 'stand' | 'wall_mounting_dots', file: File) => {
    try {
      const result = await apiService.uploadAdminImage(key, file);
      setImages(prev => ({ ...prev, [key]: result.imageUrl }));
      showStatus('success', 'Image uploaded successfully!');
    } catch (error) {
      showStatus('error', 'Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-tabs">
          <button
            className={activeTab === 'edit' ? 'active' : ''}
            onClick={() => setActiveTab('edit')}
          >
            Edit
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`status-message ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="admin-content">
          <div className="admin-section">
            <h2>Title & Subtitle</h2>
            <label>
              Title:
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              />
            </label>
            <label>
              Subtitle:
              <input
                type="text"
                value={content.price_subtitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, price_subtitle: e.target.value }))}
              />
            </label>
          </div>

          <div className="admin-section">
            <h2>Prices</h2>
            <label>
              48×48 Price:
              <input
                type="number"
                step="0.01"
                value={prices['48x48'] || 0}
                onChange={(e) => setPrices(prev => ({ ...prev, '48x48': parseFloat(e.target.value) || 0 }))}
              />
            </label>
            <label>
              75×75 Price:
              <input
                type="number"
                step="0.01"
                value={prices['75x75'] || 0}
                onChange={(e) => setPrices(prev => ({ ...prev, '75x75': parseFloat(e.target.value) || 0 }))}
              />
            </label>
            <label>
              96×96 Price:
              <input
                type="number"
                step="0.01"
                value={prices['96x96'] || 0}
                onChange={(e) => setPrices(prev => ({ ...prev, '96x96': parseFloat(e.target.value) || 0 }))}
              />
            </label>
            <label>
              Stand Price:
              <input
                type="number"
                step="0.01"
                value={prices.stand || 0}
                onChange={(e) => setPrices(prev => ({ ...prev, stand: parseFloat(e.target.value) || 0 }))}
              />
            </label>
            <label>
              Mounting Dots Price:
              <input
                type="number"
                step="0.01"
                value={prices.wall_mounting_dots || 0}
                onChange={(e) => setPrices(prev => ({ ...prev, wall_mounting_dots: parseFloat(e.target.value) || 0 }))}
              />
            </label>
          </div>

          <div className="admin-section">
            <h2>Product Images</h2>
            <div className="image-upload">
              <label>
                Stand Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('stand', file);
                  }}
                />
                {images.stand && <img src={images.stand} alt="Stand" className="preview-image" />}
              </label>
            </div>
            <div className="image-upload">
              <label>
                Mounting Dots Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('wall_mounting_dots', file);
                  }}
                />
                {images.wall_mounting_dots && <img src={images.wall_mounting_dots} alt="Mounting Dots" className="preview-image" />}
              </label>
            </div>
          </div>

          <button className="save-all-button" onClick={handleSaveAll}>
            Save All
          </button>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-content">
          <h2>Orders</h2>
          <p>Order management will be implemented here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

