import { calculateDaysUntilExpiry } from "../utils/item.util";
import { useState } from "react";
import { itemsApi } from "../utils/api.util";

const AdvancedItemsTable = ({ 
  headers = [], 
  data = [], 
  items = [],
  columns = [],
  emptyMessage = "No data available",
  className = "",
  variant = "default", // "default", "skeleton", "interactive", "selectable"
  onDeleteItem = null,
  onItemAccept = null,
  onItemReject = null,
  onSelectionChange = null,
  selectedItems = [],
  rowCount = 3
}) => {
  const [deletingItems, setDeletingItems] = useState(new Set());
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Skeleton variant
  if (variant === "skeleton") {
    return (
      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
          {headers.map((header, index) => (
            <div key={index} className="text-white/60 font-semibold text-sm">
              {header}
            </div>
          ))}
        </div>

        {/* Skeleton Rows */}
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg animate-pulse">
            {headers.map((_, colIndex) => (
              <div key={colIndex} className="space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                {colIndex === 0 && (
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const handleDeleteItem = async (item) => {
    if (!onDeleteItem) return;
    
    setDeletingItems(prev => new Set([...prev, item.id]));
    
    try {
      await onDeleteItem(item);
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleAcceptItem = async (item) => {
    setUpdatingItems(prev => new Set([...prev, item.id]));
    
    try {
      // Update item status to confirmed
      const updatedItem = await itemsApi.update(item.id, { 
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
      });
      
      if (onItemAccept) {
        onItemAccept(updatedItem);
      }
      
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    } catch (error) {
      console.error("Error accepting item:", error);
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleRejectItem = async (item) => {
    setDeletingItems(prev => new Set([...prev, item.id]));
    
    try {
      // Delete the item
      await itemsApi.delete(item.id);
      
      if (onItemReject) {
        onItemReject(item);
      }
      
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    } catch (error) {
      console.error("Error rejecting item:", error);
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleRowSelection = (item) => {
    if (!onSelectionChange) return;
    
    const isSelected = selectedItems.includes(item.id);
    let newSelection;
    
    if (isSelected) {
      // Remove from selection
      newSelection = selectedItems.filter(id => id !== item.id);
    } else {
      // Add to selection
      newSelection = [...selectedItems, item.id];
    }
    
    onSelectionChange(newSelection);
  };

  // Get background color based on days to expire
  const getExpiryBackgroundColor = (days) => {
    if (days < 0) return 'from-red-900/20 to-red-800/10';
    if (days <= 3) return 'from-orange-900/20 to-orange-800/10';
    if (days <= 7) return 'from-yellow-900/20 to-yellow-800/10';
    return 'from-green-900/10 to-green-800/5';
  };

  // Get text color based on days to expire
  const getExpiryTextColor = (days) => {
    if (days < 0) return 'text-red-300';
    if (days <= 3) return 'text-orange-300';
    if (days <= 7) return 'text-yellow-300';
    return 'text-green-300';
  };

  // Column renderers
  const columnRenderers = {
    name: (item) => (
      <span className="font-medium text-white">{item.name}</span>
    ),
    category: (item) => (
      <span className="text-white/80 capitalize">{item.category}</span>
    ),
    expiryPeriod: (item) => (
      <span className="text-white/80">{item.expiryPeriod} days</span>
    ),
    source: (item) => (
      <span className="text-white/80 capitalize">{item.source}</span>
    ),
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

  // Interactive variant with accept/reject buttons
  if (variant === "interactive") {
    return (
      <div className={`relative ${className}`}>
        {/* Table Headers */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {headers.map((header, index) => (
            <div key={index} className="px-4 py-3 text-sm font-semibold text-green-300">
              {header}
            </div>
          ))}
          {/* <div className="px-4 py-3 text-sm font-semibold text-green-300 text-center">
            Actions
          </div> */}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent mb-4"></div>

        {/* Table Rows */}
        <div className="space-y-1">
          {transformedData.map((row, index) => {
            const item = items[index];
            const isDeleting = deletingItems.has(item.id);
            const isUpdating = updatingItems.has(item.id);
            
            return (
              <div 
                key={item.id || index} 
                className={`
                  relative group grid grid-cols-3 gap-4 py-4 px-4 rounded-lg transition-all duration-300 
                  bg-gradient-to-r from-white/5 to-white/10
                  hover:bg-gradient-to-r hover:from-white/10 hover:to-white/15
                  ${isDeleting || isUpdating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                `}
              >
                {/* Data columns */}
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className="flex items-center">
                    {cell.content}
                  </div>
                ))}
                
                {/* Action buttons */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Accept button */}
                  <button
                    onClick={() => handleAcceptItem(item)}
                    disabled={isUpdating || isDeleting}
                    className="bg-green-500/80 hover:bg-green-500 text-white rounded-full p-2 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Accept item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  {/* Reject button */}
                  <button
                    onClick={() => handleRejectItem(item)}
                    disabled={isUpdating || isDeleting}
                    className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Reject item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Selectable variant with row selection
  if (variant === "selectable") {
    return (
      <div className={`relative ${className}`}>
        {/* Table Headers */}
        <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 mb-4">
          <div></div>
          {headers.map((header, index) => (
            <div key={index} className="px-4 py-3 text-sm font-semibold text-green-300">
              {header}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent mb-4"></div>

        {/* Table Rows */}
        <div className="space-y-2">
          {transformedData.map((row, index) => {
            const item = items[index];
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <div 
                key={item.id || index} 
                className={`
                  relative group grid grid-cols-[auto_1fr_1fr_1fr] gap-4 py-4 px-4 rounded-lg transition-all duration-200 cursor-pointer transform
                  ${isSelected 
                    ? 'bg-transparent border-white/80 rounded-none' 
                    : 'bg-white/10 hover:bg-white/15'
                  }
                `}
                onClick={() => handleRowSelection(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowSelection(item);
                  }
                }}
              >
                {/* Checkbox indicator */}
                <div className="flex items-center justify-center">
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                    ${isSelected 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-white/40'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Data columns */}
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className="flex items-center">
                    {cell.content}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant (existing functionality)
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
                ${isDeleting ? 'opacity-0 scale-95 transform -translate-y-2' : 'opacity-100 scale-100 transform translate-y-0'}
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

export default AdvancedItemsTable;
