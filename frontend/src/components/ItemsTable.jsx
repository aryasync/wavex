const ItemsTable = ({ 
  headers = [], 
  data = [], 
  items = [],
  columns = [],
  emptyMessage = "No data available",
  className = "" 
}) => {
  // Calculate days to expire for an item
  const getDaysToExpire = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      const days = getDaysToExpire(item.expiryDate);
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
      <div className="w-full h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent mb-4"></div>

      {/* Table Rows with expiry-based backgrounds */}
      <div className="space-y-1">
        {transformedData.map((row, index) => {
          const item = items[index];
          const days = getDaysToExpire(item.expiryDate);
          const backgroundClass = getExpiryBackgroundColor(days);
          
          return (
            <div 
              key={index} 
              className={`grid grid-cols-2 gap-4 py-4 px-4 rounded-lg transition-all duration-200 bg-gradient-to-r ${backgroundClass} hover:opacity-80`}
            >
              <div className="flex items-center">
                {row[0].content}
              </div>
              <div className="flex items-center justify-end">
                {row[1].content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemsTable;
