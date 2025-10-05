import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.js';

/**
 * Custom hook for managing categories from backend config
 * Fetches categories from the backend API and provides them to components
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color palette for categories
  const colors = [
    '#059669', // Dark green
    '#10b981', // Emerald green
    '#34d399', // Light green
    '#6ee7b7', // Lighter green
    '#a7f3d0'  // Lightest green
  ];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/items/categories`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      // Fallback to default categories if API fails
      setCategories(['dairy', 'meat', 'produce', 'pantry', 'other']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Get color for a specific category
  const getCategoryColor = (category, index = 0) => {
    return colors[index % colors.length];
  };

  // Get all categories with their colors
  const getCategoriesWithColors = () => {
    return categories.map((category, index) => ({
      name: category,
      color: getCategoryColor(category, index)
    }));
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    getCategoryColor,
    getCategoriesWithColors,
    colors
  };
};
