import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const HorizontalBarChart = ({ data = [], title = "Fridge Contents", onCategoryClick, selectedCategory }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const navigate = useNavigate();

  // Default data with better color scheme and navigation routes
  const defaultData = [
    { label: 'Fruits', value: 30, color: '#3B82F6', route: '/category/fruits' },
    { label: 'Vegetables', value: 25, color: '#10B981', route: '/category/vegetables' },
    { label: 'Dairy', value: 20, color: '#F59E0B', route: '/category/dairy' },
    { label: 'Meat', value: 15, color: '#EF4444', route: '/category/meat' },
    { label: 'Other', value: 10, color: '#8B5CF6', route: '/category/other' }
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
            {segments.map((segment) => (
              <div
                key={segment.index}
                className={`h-full transition-all duration-200 cursor-pointer ${
                  hoveredSegment === segment.index ? 'opacity-80' : 'opacity-100'
                }`}
                style={{ 
                  width: `${segment.width}%`,
                  backgroundColor: segment.color
                }}
                onMouseEnter={() => handleSegmentHover(segment.index)}
                onMouseLeave={handleSegmentLeave}
                onClick={() => handleSegmentClick(segment)}
                aria-label={`${segment.label}: ${segment.value} items (${segment.percentage.toFixed(1)}%) - Click to view items`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2">
        {segments.map((segment) => (
          <div
            key={segment.index}
            className={`flex items-center space-x-2 px-3 py-1 rounded transition-all duration-200 cursor-pointer ${
              hoveredSegment === segment.index ? 'bg-white/20' : 
              selectedCategory === segment.label ? 'bg-white/30' : 'bg-white/10'
            }`}
            onMouseEnter={() => handleSegmentHover(segment.index)}
            onMouseLeave={handleSegmentLeave}
            onClick={() => handleSegmentClick(segment)}
            role="button"
            tabIndex={0}
            aria-label={`${segment.label}: ${segment.value} items - Click to view items`}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-white">
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;
