/**
 * API utility functions for backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic API request handler with improved error handling
 */
const makeApiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
};

/**
 * Items API endpoints
 */
export const itemsApi = {
  /**
   * Get all items from backend
   */
  getAll: async () => {
    return makeApiRequest('/items');
  },

  /**
   * Get items filtered by status
   */
  getByStatus: async (status) => {
    return makeApiRequest(`/items?status=${status}`);
  },

  /**
   * Get item by ID from backend
   */
  getById: async (id) => {
    return makeApiRequest(`/items/${id}`);
  },

  /**
   * Create new item in backend
   */
  create: async (itemData) => {
    return makeApiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  /**
   * Update item in backend
   */
  update: async (id, updateData) => {
    return makeApiRequest(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete item from backend
   */
  delete: async (id) => {
    return makeApiRequest(`/items/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Analyze image with AI and create pending items
   */
  analyzeImage: async (imageData) => {
    // Convert base64 data URL to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', blob, 'captured-image.jpg');
    
    // Make request to analyze endpoint
    const url = `${API_BASE_URL}/items/analyze-image`;
    const apiResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${apiResponse.status}`);
    }
    
    return apiResponse.json();
  },

  /**
   * Create a new notification
   */
  createNotification: async (notificationData) => {
    return makeApiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }
};

// Legacy exports for backward compatibility
export const fetchItems = itemsApi.getAll;
export const fetchItemById = itemsApi.getById;
export const createItem = itemsApi.create;
export const updateItem = itemsApi.update;
export const deleteItem = itemsApi.delete;