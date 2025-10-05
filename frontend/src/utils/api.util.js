/**
 * API utility functions for backend communication
 */

const API_BASE_URL = 'http://localhost:3001/api';

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
  }
};

// Legacy exports for backward compatibility
export const fetchItems = itemsApi.getAll;
export const fetchItemById = itemsApi.getById;
export const createItem = itemsApi.create;
export const updateItem = itemsApi.update;
export const deleteItem = itemsApi.delete;