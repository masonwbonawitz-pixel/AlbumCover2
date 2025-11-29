import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface Prices {
  '48x48': number;
  '75x75': number;
  '96x96': number;
  stand: number;
  wall_mounting_dots: number;
  [key: string]: number; // Index signature for compatibility
}

export interface Images {
  stand: string;
  wall_mounting_dots: string;
}

export interface Content {
  title: string;
  price_subtitle: string;
  upload_image_text: string;
  upload_subtext: string;
  section_upload: string;
  section_grid: string;
  section_adjustments: string;
  section_painting: string;
  grid_btn_48: string;
  grid_btn_75: string;
  grid_btn_96: string;
  slider_contrast_label: string;
  slider_brightness_label: string;
  slider_tones_label: string;
  label_dimensions: string;
  label_addons: string;
  stand_name: string;
  mounting_name: string;
  color_black_title: string;
  color_darkgray_title: string;
  color_lightgray_title: string;
  color_white_title: string;
  panel_title: string;
  canvas_label: string;
  [key: string]: string;
}

export interface OrderResponse {
  order_id: string;
  price: number;
  grid_size: number;
  message: string;
}

export const apiService = {
  // Public endpoints (main app)
  getPrices: async (): Promise<Prices> => {
    const response = await axios.get(`${API_BASE_URL}/api/prices`);
    return response.data;
  },

  getImages: async (): Promise<Images> => {
    const response = await axios.get(`${API_BASE_URL}/api/images`);
    return response.data;
  },

  getContent: async (): Promise<Content> => {
    const response = await axios.get(`${API_BASE_URL}/api/content`);
    return response.data;
  },

  getSTL: async (size: number): Promise<string> => {
    const response = await axios.get(`${API_BASE_URL}/get-stl/${size}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  },

  generateOBJ: async (stlFile: File, pngFile: File, gridSize: number): Promise<Blob> => {
    const formData = new FormData();
    formData.append('stl', stlFile);
    formData.append('png', pngFile);
    formData.append('grid_size', gridSize.toString());

    const response = await axios.post(
      `${API_BASE_URL}/generate-obj`,
      formData,
      { responseType: 'blob' }
    );
    return response.data;
  },

  uploadForCheckout: async (orderData: {
    stlFile: File;
    pngFile: File;
    gridSize: number;
    standSelected: boolean;
    mountingSelected: boolean;
    totalPrice: number;
  }): Promise<OrderResponse> => {
    const formData = new FormData();
    formData.append('stl', orderData.stlFile);
    formData.append('png', orderData.pngFile);
    formData.append('grid_size', orderData.gridSize.toString());
    formData.append('stand_selected', orderData.standSelected.toString());
    formData.append('mounting_selected', orderData.mountingSelected.toString());
    formData.append('total_price', orderData.totalPrice.toString());

    const response = await axios.post(
      `${API_BASE_URL}/upload-for-checkout`,
      formData
    );
    return response.data;
  },

  // Admin endpoints
  getAdminPrices: async (): Promise<Prices> => {
    const response = await axios.get(`${API_BASE_URL}/admin/prices/api`);
    return response.data;
  },

  saveAdminPrices: async (prices: Prices): Promise<{ success: boolean; prices: Prices }> => {
    const response = await axios.post(`${API_BASE_URL}/admin/prices/api`, prices);
    return response.data;
  },

  getAdminImages: async (): Promise<Images> => {
    const response = await axios.get(`${API_BASE_URL}/admin/images/api`);
    return response.data;
  },

  uploadAdminImage: async (key: 'stand' | 'wall_mounting_dots', file: File): Promise<{ success: boolean; imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', key);
    const response = await axios.post(`${API_BASE_URL}/admin/images/api`, formData);
    return response.data;
  },

  getAdminContent: async (): Promise<Content> => {
    const response = await axios.get(`${API_BASE_URL}/admin/content/api`);
    return response.data;
  },

  saveAdminContent: async (content: Content): Promise<{ success: boolean; content: Content }> => {
    const response = await axios.post(`${API_BASE_URL}/admin/content/api`, content);
    return response.data;
  },

  getSTLStatus: async (): Promise<{ '48x48': boolean; '75x75': boolean; '96x96': boolean }> => {
    const response = await axios.get(`${API_BASE_URL}/admin/stl/api`);
    return response.data;
  },

  uploadSTL: async (size: number, file: File): Promise<{ success: boolean; filename: string }> => {
    const formData = new FormData();
    formData.append('stl', file);
    formData.append('size', size.toString());
    const response = await axios.post(`${API_BASE_URL}/admin/stl/api`, formData);
    return response.data;
  },

  getOrders: async (): Promise<any[]> => {
    const response = await axios.get(`${API_BASE_URL}/admin/orders/api`);
    return response.data;
  },

  updateOrder: async (orderId: string, completed: boolean): Promise<{ success: boolean }> => {
    const response = await axios.post(`${API_BASE_URL}/admin/orders/api`, {
      order_id: orderId,
      completed
    });
    return response.data;
  },

  deleteOrder: async (orderId: string): Promise<{ success: boolean }> => {
    const response = await axios.delete(`${API_BASE_URL}/admin/orders/api?order_id=${orderId}`);
    return response.data;
  },

  downloadOrderFile: (orderId: string, filename: string): string => {
    return `${API_BASE_URL}/admin/orders/download/${orderId}/${filename}`;
  }
};

