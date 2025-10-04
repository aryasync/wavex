import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const PieChart = ({ data = [], size = 200, title = "Fridge Contents" }) => {
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

  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  // Memoize path creation function
  const createPath = useCallback((percentage, startAngle) => {
    const angle = (percentage / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    return [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
  }, [centerX, centerY, radius]);

  // Calculate segment data with proper angles and label positions
  const segments = useMemo(() => {
    let cumulativeAngle = 0;
    return chartData.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const startAngle = cumulativeAngle;
      const pathData = createPath(percentage, startAngle);
      
      // Calculate label position (middle of the segment)
      const midAngle = startAngle + (percentage / 100) * Math.PI;
      const labelRadius = radius * 0.7; // Position labels 70% from center
      const labelX = centerX + labelRadius * Math.cos(midAngle);
      const labelY = centerY + labelRadius * Math.sin(midAngle);
      
      cumulativeAngle += (percentage / 100) * 2 * Math.PI;
      
      return {
        ...item,
        index,
        percentage,
        pathData,
        startAngle,
        labelX,
        labelY,
        midAngle
      };
    });
  }, [chartData, total, createPath, radius, centerX, centerY]);

  const handleSegmentHover = useCallback((index) => {
    setHoveredSegment(index);
  }, []);

  const handleSegmentLeave = useCallback(() => {
    setHoveredSegment(null);
  }, []);

  const handleSegmentClick = useCallback((segment) => {
    if (segment.route) {
      navigate(segment.route);
    }
  }, [navigate]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {title}
      </h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg 
            width={size} 
            height={size} 
            className="transform -rotate-90"
            role="img"
            aria-label={`Pie chart showing ${title}`}
          >
            {/* Pie segments */}
            {segments.map((segment) => (
              <path
                key={segment.index}
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredSegment === segment.index ? 'opacity-80' : 'opacity-100'
                }`}
                onMouseEnter={() => handleSegmentHover(segment.index)}
                onMouseLeave={handleSegmentLeave}
                onClick={() => handleSegmentClick(segment)}
                aria-label={`${segment.label}: ${segment.value} items (${segment.percentage.toFixed(1)}%) - Click to view items`}
              />
            ))}
            
            {/* Labels on pie segments */}
            {segments.map((segment) => {
              // Show labels for segments larger than 3% to include more segments
              if (segment.percentage < 3) return null;
              
              return (
                <g key={`label-${segment.index}`} className="transform rotate-90">
                  {/* Background circle for better text visibility */}
                  <circle
                    cx={segment.labelX}
                    cy={segment.labelY - 2}
                    r="20"
                    fill="rgba(255, 255, 255, 0.9)"
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth="1"
                    className="pointer-events-none"
                  />
                  
                  {/* Category name */}
                  <text
                    x={segment.labelX}
                    y={segment.labelY - 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-gray-800 pointer-events-none"
                    style={{ fontSize: '10px' }}
                  >
                    {segment.label}
                  </text>
                  
                  {/* Percentage */}
                  <text
                    x={segment.labelX}
                    y={segment.labelY + 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-semibold fill-gray-600 pointer-events-none"
                    style={{ fontSize: '9px' }}
                  >
                    {segment.percentage.toFixed(1)}%
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{total}</div>
              <div className="text-xs text-gray-500">Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {segments.map((segment) => (
          <div
            key={segment.index}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
              hoveredSegment === segment.index ? 'bg-gray-100' : 'bg-gray-50'
            }`}
            onMouseEnter={() => handleSegmentHover(segment.index)}
            onMouseLeave={handleSegmentLeave}
            onClick={() => handleSegmentClick(segment)}
            role="button"
            tabIndex={0}
            aria-label={`${segment.label}: ${segment.value} items - Click to view items`}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-gray-700">
              {segment.label} ({segment.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
