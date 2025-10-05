import { useState } from 'react';
import { Link } from 'react-router-dom';
import DarkThemeLayout from './components/DarkThemeLayout';
import FuturisticCard from './components/FuturisticCard';
import FuturisticButton from './components/FuturisticButton';

const CategoryPage = ({ categoryName, categoryColor, categoryIcon }) => {
  const [items] = useState([]); // Empty for now, will be populated by backend

  return (
    <DarkThemeLayout title={`${categoryIcon} ${categoryName.toUpperCase()}`}>
      {/* Category info */}
      <FuturisticCard height="h-auto" gradient={`from-${categoryColor.replace('#', '')} to-${categoryColor.replace('#', '')}80`}>
        <div className="text-center">
          <div className="text-3xl font-bold text-white font-['Orbitron'] mb-2">
            {categoryName}
          </div>
          <div className="text-white/80">
            {items.length} items in this category
          </div>
        </div>
      </FuturisticCard>

      {/* Items list */}
      <div>
        <h3 className="text-xl font-bold font-['Orbitron'] mb-4">Items</h3>
        
        {items.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <div className="text-6xl mb-4">{categoryIcon}</div>
            <p className="text-lg">No {categoryName.toLowerCase()} items yet</p>
            <p className="text-sm mt-2">Items will appear here when added</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="font-medium text-white">{item.name}</div>
                <div className="text-sm text-white/70">{item.expiryDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DarkThemeLayout>
  );
};

export default CategoryPage;
