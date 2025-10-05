import { useState, useEffect } from 'react';
import { itemsApi } from '../utils/api.util';

/**
 * Custom hook for managing pending items operations
 */
export const usePendingItems = (aiAnalysisResult, items) => {
  const [pendingItems, setPendingItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending items from API when AI analysis is complete
  useEffect(() => {
    if (aiAnalysisResult && aiAnalysisResult.createdCount > 0) {
      const fetchPendingItems = async () => {
        try {
          const pendingItemsList = await itemsApi.getByStatus('pending');
          setPendingItems(pendingItemsList);
        } catch (error) {
          console.error('Error fetching pending items:', error);
          setPendingItems([]);
        }
      };
      
      fetchPendingItems();
    }
  }, [aiAnalysisResult]);

  // Fallback: filter pending items from context
  useEffect(() => {
    if (items && !aiAnalysisResult) {
      const pending = items.filter((item) => item.status === "pending");
      setPendingItems(pending);
    }
  }, [items, aiAnalysisResult]);

  /**
   * Confirm selected items and delete unselected ones
   */
  const confirmSelectedItems = async (selectedItems) => {
    if (selectedItems.length === 0) return;
    
    setIsProcessing(true);
    try {
      const itemsToConfirm = pendingItems.filter(item => 
        selectedItems.includes(item.id)
      );
      
      const itemsToDelete = pendingItems.filter(item => 
        !selectedItems.includes(item.id)
      );
      
      // Confirm selected items
      for (const item of itemsToConfirm) {
        try {
          await itemsApi.update(item.id, { status: 'confirmed' });
        } catch (error) {
          console.error(`Error confirming item ${item.name}:`, error);
        }
      }
      
      // Delete unselected items
      for (const item of itemsToDelete) {
        try {
          await itemsApi.delete(item.id);
        } catch (error) {
          console.error(`Error deleting item ${item.name}:`, error);
        }
      }
      
      console.log(`Successfully confirmed ${itemsToConfirm.length} items and deleted ${itemsToDelete.length} pending items`);
      
      // Create notification for added items
      if (itemsToConfirm.length > 0) {
        try {
          await itemsApi.createNotification({
            type: 'added_items',
            message: `Added ${itemsToConfirm.length} item${itemsToConfirm.length !== 1 ? 's' : ''} via AI scan`,
            itemId: null
          });
        } catch (error) {
          console.error('Error creating notification:', error);
          // Don't fail the whole operation if notification creation fails
        }
      }
      
      return { success: true, confirmed: itemsToConfirm.length, deleted: itemsToDelete.length };
    } catch (error) {
      console.error("Error confirming selected items:", error);
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Delete all pending items
   */
  const deleteAllPendingItems = async () => {
    setIsProcessing(true);
    try {
      for (const item of pendingItems) {
        try {
          await itemsApi.delete(item.id);
          console.log(`Deleted pending item: ${item.name}`);
        } catch (error) {
          console.error(`Error deleting item ${item.name}:`, error);
        }
      }
      return { success: true, deleted: pendingItems.length };
    } catch (error) {
      console.error("Error deleting all pending items:", error);
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    pendingItems,
    isProcessing,
    confirmSelectedItems,
    deleteAllPendingItems,
  };
};
