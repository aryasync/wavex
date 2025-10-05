import { calculateDaysUntilExpiry } from "../utils/item.util";
import { useState } from "react";

const ItemsTable = ({ 
  headers = [], 
  data = [], 
  items = [],
  columns = [],
  emptyMessage = "No data available",
  className = "",
  onDeleteItem = null
}) => {
  const [deletingItems, setDeletingItems] = useState(new Set());

  const handleDeleteItem = async (item) => {
    if (!onDeleteItem) return;
    
    // Add item to deleting set for fade-out animation
    setDeletingItems(prev => new Set([...prev, item.id]));
    
    // Wait for fade-out animation to complete before actually deleting
    setTimeout(async () => {
      try {
        await onDeleteItem(item);
        // Remove from deleting set after successful deletion
        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      } catch (error) {
        console.error("Error deleting item:", error);
        // Remove from deleting set on error
        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }
    }, 300); // Wait for 300ms fade-out animation
  };

  // Get background color based on days to expire
  const getExpiryBackgroundColor = (days) => {
    if (days < 0) return 'from-red-900/20 to-red-800/10'; // Expired
    if (days <= 3) return 'from-orange-900/20 to-orange-800/10'; // Expiring soon
    if (days <= 7) return 'from-yellow-900/20 to-yellow-800/10'; // Expiring this week
    return 'from-green-900/10 to-green-800/5'; // Good
  };

  // Get text color based on days to expire
  const getExpiryTextColor = (days) => {
    if (days < 0) return 'text-red-300'; // Expired
    if (days <= 3) return 'text-orange-300'; // Expiring soon
    if (days <= 7) return 'text-yellow-300'; // Expiring this week
    return 'text-green-300'; // Good
  };

  // Column renderers
  const columnRenderers = {
    product: (item) => (
      <span className="font-medium text-white">{item.name}</span>
    ),
    daysToExpire: (item) => {
      const days = calculateDaysUntilExpiry(item.expiryDate);
      return (
        <span className={`font-medium ${getExpiryTextColor(days)}`}>
          {days < 0 ? `Expired ${Math.abs(days)} days ago` : 
           days === 0 ? 'Expires today' : 
           `${days} days`}
        </span>
      );
    }
  };

  // Transform items to table data
  const transformedData = items.length > 0 ? items.map(item => 
    columns.map(column => ({
      content: columnRenderers[column.key]?.(item) || 
               (column.transform ? column.transform(item) : item[column.key]),
      className: column.className || ""
    }))
  ) : data;

  if (transformedData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-600/20 to-green-700/20 flex items-center justify-center">
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-green-300 text-lg font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Table Headers */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="px-4 py-3 text-sm font-semibold text-green-300">
          {headers[0]}
        </div>
        <div className="px-4 py-3 text-sm font-semibold text-green-300 text-right">
          {headers[1]}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent mb-4"></div>

      {/* Table Rows with expiry-based backgrounds */}
      <div className="space-y-1">
        {transformedData.map((row, index) => {
          const item = items[index];
          const days = calculateDaysUntilExpiry(item.expiryDate);
          const backgroundClass = getExpiryBackgroundColor(days);
          const isDeleting = deletingItems.has(item.id);
          
          return (
            <div 
              key={item.id || index} 
              className={`
                relative group grid grid-cols-2 gap-4 py-4 px-4 rounded-lg transition-all duration-300 
                bg-gradient-to-r ${backgroundClass} 
                hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20 hover:opacity-80
                focus:bg-gradient-to-r focus:from-red-900/30 focus:to-red-800/20 focus:opacity-80 focus:outline-none
                ${isDeleting ? 'opacity-0 scale-95 transform -translate-y-2 transition-all duration-300 ease-out' : 'opacity-100 scale-100 transform translate-y-0 transition-all duration-300 ease-out'}
              `}
              tabIndex={0}
            >
              <div className="flex items-center">
                {row[0].content}
              </div>
              <div className="flex items-center justify-end">
                {row[1].content}
              </div>
              
              {/* Delete button - only show on hover and if onDeleteItem is provided */}
              {onDeleteItem && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item);
                    }}
                    className="bg-red-500/80 hover:bg-red-500 text-white rounded-full px-3 py-2 transition-colors duration-200 shadow-lg pointer-events-auto flex items-center space-x-1"
                    disabled={isDeleting}
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemsTable;
