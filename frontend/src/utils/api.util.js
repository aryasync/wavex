/**
 * API utility functions for backend communication
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Generic API request handler
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get all items from backend
 */
export const fetchItems = async () => {
  return apiRequest('/items');
};

/**
 * Get item by ID from backend
 */
export const fetchItemById = async (id) => {
  return apiRequest(`/items/${id}`);
};

/**
 * Create new item in backend
 */
export const createItem = async (itemData) => {
  return apiRequest('/items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

/**
 * Update item in backend
 */
export const updateItem = async (id, updateData) => {
  return apiRequest(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

/**
 * Delete item from backend
 */
export const deleteItem = async (id) => {
  return apiRequest(`/items/${id}`, {
    method: 'DELETE',
  });
};