import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from './components/PageContainer';
import Header from './components/Header';
import Button from './components/Button';

const CategoryPage = ({ categoryName, categoryColor, categoryIcon }) => {
  const [items] = useState([]); // Empty for now, will be populated by backend

  return (
    <PageContainer>
      <Header title={`${categoryIcon} ${categoryName}`} />
      
      {/* Category info */}
      <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${categoryColor}20` }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-2" style={{ color: categoryColor }}>
            {categoryName}
          </div>
          <div className="text-gray-600">
            {items.length} items in this category
          </div>
        </div>
      </div>

      {/* Items list - empty for now */}
      <div className="flex-1 overflow-y-auto mb-6 pb-20">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">{categoryIcon}</div>
            <p className="text-lg">No {categoryName.toLowerCase()} items yet</p>
            <p className="text-sm mt-2">Items will appear here when added</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.expiryDate}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Extending border that grows with content */}
        <div className="border-t border-gray-200 h-20"></div>
      </div>

      {/* Bottom navigation bar with divider */}
      <div className="border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-10">
        <div className="flex py-3 px-2 max-w-md mx-auto">
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <Button variant="icon" className="rounded-xl w-12 h-12 flex items-center justify-center" icon="🏠">
              </Button>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <Button variant="icon" className="rounded-xl w-12 h-12 flex items-center justify-center" icon="📷">
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <Button variant="icon" className="rounded-xl w-12 h-12 flex items-center justify-center" icon="📅">
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <Button variant="icon" className="rounded-xl w-12 h-12 flex items-center justify-center" icon="🔔">
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default CategoryPage;
