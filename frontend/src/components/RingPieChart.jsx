import { useState, useMemo, useCallback } from 'react';

const RingPieChart = ({ data = [], onCategoryClick, selectedCategories = [] }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Memoize chart calculations for better performance
  const chartData = useMemo(() => {
    return data.length > 0 ? data : [];
  }, [data]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Calculate total for selected categories only
  const selectedTotal = useMemo(() => {
    if (selectedCategories.length === 0) {
      return total; // Show all items if no categories selected
    }
    
    return chartData
      .filter(item => selectedCategories.includes(item.label))
      .reduce((sum, item) => sum + item.value, 0);
  }, [chartData, selectedCategories, total]);

  // Calculate segment data with percentages and angles
  const segments = useMemo(() => {
    if (total === 0) {
      // If no items, show all categories as equal segments
      const anglePerSegment = 360 / chartData.length;
      return chartData.map((item, index) => {
        const startAngle = index * anglePerSegment;
        const endAngle = (index + 1) * anglePerSegment;
        
        return {
          ...item,
          index,
          percentage: 100 / chartData.length,
          angle: anglePerSegment,
          startAngle,
          endAngle
        };
      });
    }
    
    let currentAngle = 0;
    return chartData.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      currentAngle += angle;
      
      return {
        ...item,
        index,
        percentage,
        angle,
        startAngle,
        endAngle
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

  // SVG path generator for ring segments
  const createArcPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const centerX = 100;
  const centerY = 100;
  const innerRadius = 70;  // Larger inner radius for slimmer ring
  const outerRadius = 90;   // Slightly larger outer radius

  return (
    <div>
      {/* Ring Pie Chart with Legend */}
      <div className="flex items-center justify-center">
        {/* Chart */}
        <div className="relative">
          <svg width="240" height="240" viewBox="0 0 200 200" className="transform -rotate-90">
            {segments.length > 0 ? segments.map((segment) => {
              const isSelected = selectedCategories.includes(segment.label);
              const isHovered = hoveredSegment === segment.index;
              const hasItems = segment.value > 0;
              
              // Only highlight if this specific segment is selected
              const shouldHighlight = isSelected;
              
              return (
                <path
                  key={segment.index}
                  d={createArcPath(segment.startAngle, segment.endAngle, innerRadius, outerRadius)}
                  fill={hasItems ? segment.color : 'rgba(255,255,255,0.1)'}
                  stroke={hasItems ? 'none' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={hasItems ? '0' : '1'}
                  strokeDasharray={hasItems ? 'none' : '3,3'}
                  className={`transition-all duration-200 cursor-pointer ${
                    shouldHighlight 
                      ? 'opacity-100' 
                      : isHovered 
                        ? 'opacity-80' 
                        : hasItems
                          ? 'opacity-60'
                          : 'opacity-30'
                  }`}
                  onMouseEnter={() => handleSegmentHover(segment.index)}
                  onMouseLeave={handleSegmentLeave}
                  onClick={() => handleSegmentClick(segment)}
                  style={{
                    filter: shouldHighlight ? 'brightness(1.2) saturate(1.2)' : isHovered ? 'brightness(1.1)' : hasItems ? 'brightness(0.8)' : 'brightness(0.6)',
                  }}
                />
              );
            }) : (
              // Show empty state circle
              <circle
                cx={centerX}
                cy={centerY}
                r={outerRadius}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>
          
          {/* Center total */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {selectedTotal}
              </div>
              <div className="text-sm text-white/70">
                {selectedCategories.length > 0 ? 'selected' : 'total items'}
              </div>
            </div>
          </div>
        </div>

        {/* Legend - Vertical */}
        <div className="flex flex-col gap-3">
          {segments.map((segment) => {
            const isSelected = selectedCategories.includes(segment.label);
            const isHovered = hoveredSegment === segment.index;
            const hasItems = segment.value > 0;
            
            return (
              <div
                key={segment.index}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer transform ${
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
                  className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-white/60' : ''
                  } ${!hasItems ? 'border border-white/30' : ''}`}
                  style={{ 
                    backgroundColor: hasItems ? segment.color : 'rgba(255,255,255,0.1)',
                    backgroundImage: !hasItems ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' : 'none'
                  }}
                  aria-hidden="true"
                />
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isSelected ? 'text-white font-semibold' : hasItems ? 'text-white/90' : 'text-white/60'
                }`}>
                  {segment.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RingPieChart;
