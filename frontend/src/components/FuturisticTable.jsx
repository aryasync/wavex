const FuturisticTable = ({ 
  headers = [], 
  data = [], 
  emptyMessage = "No data available",
  className = "" 
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Table Headers */}
      <div className="grid grid-cols-3 gap-4 mb-3 text-sm font-medium text-white/80">
        {headers.map((header, index) => (
          <div key={index}>{header}</div>
        ))}
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {data.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 py-3 text-sm">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className={cell.className || ""}>
                {cell.content}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuturisticTable;
