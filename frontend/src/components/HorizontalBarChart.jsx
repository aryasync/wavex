import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const HorizontalBarChart = ({ data = [], title = "Fridge Contents", onCategoryClick, selectedCategories = [] }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const navigate = useNavigate();

  // Default data with better color scheme and navigation routes
  const defaultData = [
    { label: 'Produce', value: 30, color: '#10B981', route: '/category/produce' },
    { label: 'Dairy', value: 20, color: '#F59E0B', route: '/category/dairy' },
    { label: 'Meat', value: 15, color: '#EF4444', route: '/category/meat' },
    { label: 'Pantry', value: 12, color: '#8B5CF6', route: '/category/pantry' },
    { label: 'Other', value: 10, color: '#6B7280', route: '/category/other' }
  ];

  // Memoize chart calculations for better performance
  const chartData = useMemo(() => {
    return data.length > 0 ? data : defaultData;
  }, [data]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Calculate segment data with percentages and widths
  const segments = useMemo(() => {
    return chartData.map((item, index) => {
      const percentage = (item.value / total) * 100;
      return {
        ...item,
        index,
        percentage,
        width: percentage
      };
    });
  }, [chartData, total]);

  const handleSegmentHover = useCallback((index) => {
    setHoveredSegment(index);
  }, []);

  const handleSegmentLeave = useCallback(() => {
    setHoveredSegment(null);
  }, []);

  const handleSegmentClick = useCallback((segment) => {
    if (onCategoryClick) {
      onCategoryClick(segment.label);
    }
  }, [onCategoryClick]);

  return (
    <div className="bg-transparent rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">
        {title}
      </h3>
      
      {/* Storage Summary */}
      <div className="mb-4 text-center">
        <span className="text-sm text-white/70">
          {total} items total
        </span>
        {selectedCategories.length > 0 && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-xs text-white/60">
              Filtering by: {selectedCategories.join(', ')} ({selectedCategories.length} selected)
            </span>
            <button
              onClick={() => onCategoryClick && onCategoryClick('CLEAR_ALL')}
              className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="mb-6">
        <div className="relative">
          {/* Tooltip */}
          {hoveredSegment !== null && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded pointer-events-none z-10">
              {segments[hoveredSegment].value} items
            </div>
          )}
          
          {/* Bar Container */}
          <div className="w-full h-8 bg-white/20 rounded-full overflow-hidden flex">
            {segments.map((segment) => {
              const isSelected = selectedCategories.includes(segment.label);
              const isHovered = hoveredSegment === segment.index;
              
              return (
                <div
                  key={segment.index}
                  className={`h-full transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'opacity-100 shadow-inner' 
                      : isHovered 
                        ? 'opacity-90' 
                        : 'opacity-100'
                  }`}
                  style={{ 
                    width: `${segment.width}%`,
                    backgroundColor: segment.color,
                    boxShadow: isSelected ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : 'none'
                  }}
                  onMouseEnter={() => handleSegmentHover(segment.index)}
                  onMouseLeave={handleSegmentLeave}
                  onClick={() => handleSegmentClick(segment)}
                  aria-label={`${segment.label}: ${segment.value} items (${segment.percentage.toFixed(1)}%) - Click to ${isSelected ? 'deselect' : 'select'}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2">
        {segments.map((segment) => {
          const isSelected = selectedCategories.includes(segment.label);
          const isHovered = hoveredSegment === segment.index;
          
          return (
            <div
              key={segment.index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer transform ${
                isSelected 
                  ? 'bg-white/40 ring-2 ring-white/80 shadow-lg scale-105' 
                  : isHovered 
                    ? 'bg-white/25 scale-102' 
                    : 'bg-white/10 hover:bg-white/15'
              }`}
              onMouseEnter={() => handleSegmentHover(segment.index)}
              onMouseLeave={handleSegmentLeave}
              onClick={() => handleSegmentClick(segment)}
              role="button"
              tabIndex={0}
              aria-label={`${segment.label}: ${segment.value} items - Click to ${isSelected ? 'deselect' : 'select'}`}
            >
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-white/60' : ''
                }`}
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isSelected ? 'text-white font-semibold' : 'text-white/90'
              }`}>
                {segment.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalBarChart;
