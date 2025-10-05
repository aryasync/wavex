import { useState, useEffect } from "react";
import { fetchItems, createItem, updateItem, deleteItem } from "../utils/api.util";
import { transformBackendItem, transformFrontendItem } from "../utils/item.util";
import { ItemsContext } from "../contexts/ItemsContext";

/**
 * Items Provider Component
 * Manages items state and provides CRUD operations
 */
export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch items from backend API
   */
  const fetchItemsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchItems();
      
      // Transform backend data to frontend format
      const transformedItems = data.map(transformBackendItem);
      setItems(transformedItems);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError(err.message);
      // Set some default items for testing
      setItems([
        { id: 1, name: "Sample Milk", category: "Dairy", expiryDate: "2024-01-20", icon: "🥛", purchasedDate: "2024-01-15" },
        { id: 2, name: "Sample Bread", category: "Other", expiryDate: "2024-01-18", icon: "🍞", purchasedDate: "2024-01-14" },
        { id: 3, name: "Sample Apples", category: "Produce", expiryDate: "2024-01-25", icon: "🍎", purchasedDate: "2024-01-13" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add new item to backend and update state
   */
  const addItem = async (newItem) => {
    try {
      // Transform frontend data to backend format
      const backendItem = transformFrontendItem(newItem);

      const response = await createItem(backendItem);
      
      if (response.success) {
        // Transform the created item back to frontend format
        const createdItem = transformBackendItem(response.item);
        setItems(prev => [...prev, createdItem]);
      }
    } catch (err) {
      console.error("Error adding item:", err);
      setError(err.message);
    }
  };

  /**
   * Remove item from backend and update state
   */
  const removeItem = async (itemId) => {
    try {
      const response = await deleteItem(itemId);
      
      if (response.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.message);
    }
  };

  /**
   * Update item in backend and update state
   */
  const updateItemInState = async (itemId, updates) => {
    try {
      // Transform frontend updates to backend format
      const backendUpdates = {};
      if (updates.name) backendUpdates.name = updates.name;
      if (updates.category) backendUpdates.category = updates.category.toLowerCase();
      if (updates.purchasedDate) backendUpdates.purchasedDate = updates.purchasedDate;
      if (updates.expiryPeriod) backendUpdates.expiryPeriod = updates.expiryPeriod;
      if (updates.status) backendUpdates.status = updates.status;

      const response = await updateItem(itemId, backendUpdates);
      
      if (response.success) {
        // Transform the updated item back to frontend format
        const updatedItem = transformBackendItem(response.item);
        setItems(prev => prev.map(item => 
          item.id === itemId ? updatedItem : item
        ));
      }
    } catch (err) {
      console.error("Error updating item:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchItemsFromAPI();
  }, []);

  const value = {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateItem: updateItemInState,
    refetchItems: fetchItemsFromAPI
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}
