import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DarkThemeLayout from "../components/DarkThemeLayout";
import FuturisticCard from "../components/FuturisticCard";
import FuturisticButton from "../components/FuturisticButton";
import FuturisticTable from "../components/FuturisticTable";
import HorizontalBarChart from "../components/HorizontalBarChart";
import CameraModal from "../components/CameraModal";
import { useItems } from "../contexts/ItemsContext";

/**
 * FridgePage Component
 * Main page displaying inventory overview and items list
 */
function FridgePage() {
  const { items, loading, error, refetchItems } = useItems();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  /**
   * Handle image capture from camera
   */
  const handleImageCapture = (imageData) => {
    setIsCameraOpen(false);
    navigate('/image-confirmation', { state: { imageData } });
  };

  /**
   * Calculate category counts from actual items data
   */
  const categoryData = useMemo(() => {
    const categoryCounts = {};
    
    // Count items by category
    items.forEach(item => {
      const category = item.category.toLowerCase();
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Convert to chart data format with colors
    const colors = {
      'produce': '#10B981',
      'dairy': '#F59E0B',
      'meat': '#EF4444',
      'pantry': '#8B5CF6',
      'other': '#6B7280'
    };
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
      value: count,
      color: colors[category] || '#8B5CF6'
    }));
  }, [items]);

  /**
   * Filter items based on selected categories
   */
  const filteredItems = selectedCategories.length > 0 
    ? items.filter(item => 
        selectedCategories.some(category => 
          item.category.toLowerCase() === category.toLowerCase()
        )
      )
    : items;

  /**
   * Handle category click for filtering
   */
  const handleCategoryClick = (category) => {
    if (category === 'CLEAR_ALL') {
      setSelectedCategories([]);
      return;
    }
    
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Remove category if already selected
        return prev.filter(cat => cat !== category);
      } else {
        // Add category if not selected
        return [...prev, category];
      }
    });
  };

  return (
    <DarkThemeLayout title="WaveX" onCameraClick={() => setIsCameraOpen(true)}>
      {/* Pie Chart Section */}
      <FuturisticCard height="h-64">
        <div className="text-center mb-4 -mt-4">
          <h2 className="text-xl font-semibold text-white font-['Orbitron'] mb-4">Inventory Overview</h2>
          <HorizontalBarChart 
            data={categoryData}
            onCategoryClick={handleCategoryClick} 
            selectedCategories={selectedCategories} 
          />
        </div>
      </FuturisticCard>
      
      {/* Items Section */}
      <div className="mt-20">
        <h3 className="text-xl font-bold font-['Orbitron'] mb-6 text-center">Items</h3>
        
        {loading && (
          <div className="text-center py-8 text-white/60">
            <p>Loading items...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <FuturisticButton variant="primary" onClick={refetchItems}>
              Retry
            </FuturisticButton>
          </div>
        )}
        
        {!loading && !error && (
          <FuturisticTable
            headers={["Product", "Category", "Expiration"]}
            data={filteredItems.map(item => [
              { content: (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon || "📦"}</span>
                  <span>{item.name}</span>
                </div>
              )},
              { content: item.category, className: "text-white/70" },
              { content: item.expiryDate, className: "text-red-400" }
            ])}
            emptyMessage={selectedCategories.length > 0 ? `No items found in selected categories: ${selectedCategories.join(', ').toLowerCase()}` : "No items in your fridge yet"}
          />
        )}
      </div>

      {/* Camera Modal */}
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleImageCapture}
      />
    </DarkThemeLayout>
  );
}

export default FridgePage;
