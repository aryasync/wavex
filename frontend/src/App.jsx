import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ImageConfirmationPage from "./ImageConfirmationPage";
import CalendarPage from "./CalendarPage";
import NotificationsPage from "./NotificationsPage";
import ManualInputPage from "./ManualInputPage";
import PageContainer from "./components/PageContainer";
import Header from "./components/Header";
import Button from "./components/Button";
import ItemList from "./components/ItemList";
import HorizontalBarChart from "./components/HorizontalBarChart";
import CameraModal from "./components/CameraModal";
import DarkThemeLayout from "./components/DarkThemeLayout";
import FuturisticCard from "./components/FuturisticCard";
import FuturisticButton from "./components/FuturisticButton";
import FuturisticTable from "./components/FuturisticTable";
import { ItemsContext, useItems } from "./hooks/useItems";

// Items Provider Component
function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:3001/api/items");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError(err.message);
      // Set some default items for testing
      setItems([
        { id: 1, name: "Sample Milk", category: "Dairy", expiryDate: "2024-01-20", icon: "🥛", dateBought: "2024-01-15" },
        { id: 2, name: "Sample Bread", category: "Other", expiryDate: "2024-01-18", icon: "🍞", dateBought: "2024-01-14" },
        { id: 3, name: "Sample Apples", category: "Fruits", expiryDate: "2024-01-25", icon: "🍎", dateBought: "2024-01-13" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (newItem) => {
    const item = {
      id: Date.now(), // Simple ID generation
      ...newItem,
      dateBought: newItem.dateBought || new Date().toISOString().split('T')[0]
    };
    setItems(prev => [...prev, item]);
  };

  const removeItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId, updates) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const value = {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateItem,
    refetchItems: fetchItems
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

function FridgePage() {
  const { items, loading, error, refetchItems } = useItems();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  const handleImageCapture = (imageData) => {
    setIsCameraOpen(false);
    navigate('/image-confirmation', { state: { imageData } });
  };

  // Calculate category counts from actual items data
  const categoryData = useMemo(() => {
    const categoryCounts = {};
    
    // Count items by category
    items.forEach(item => {
      const category = item.category.toLowerCase();
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Convert to chart data format with colors
    const colors = {
      'fruits': '#3B82F6',
      'vegetables': '#10B981', 
      'dairy': '#F59E0B',
      'meat': '#EF4444',
      'other': '#8B5CF6'
    };
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
      value: count,
      color: colors[category] || '#8B5CF6'
    }));
  }, [items]);

  // Filter items based on selected categories
  const filteredItems = selectedCategories.length > 0 
    ? items.filter(item => 
        selectedCategories.some(category => 
          item.category.toLowerCase() === category.toLowerCase()
        )
      )
    : items;

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

function App() {
  return (
    <ItemsProvider>
      <Routes>
        <Route path="/" element={<FridgePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/manual-input" element={<ManualInputPage />} />
        <Route path="/image-confirmation" element={<ImageConfirmationPage />} />
      </Routes>
    </ItemsProvider>
  );
}

export default App;