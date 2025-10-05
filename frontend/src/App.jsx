import { useState, useEffect } from "react";
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

function FridgePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleImageCapture = (imageData) => {
    setIsCameraOpen(false);
    navigate('/image-confirmation', { state: { imageData } });
  };

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
        { name: "Sample Milk", category: "Dairy", expiryDate: "2024-01-20", icon: "🥛" },
        { name: "Sample Bread", category: "Other", expiryDate: "2024-01-18", icon: "🍞" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch items when component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on selected category
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())
    : items;

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };
  return (
    <DarkThemeLayout title="WaveX" onCameraClick={() => setIsCameraOpen(true)}>
      {/* Pie Chart Section */}
      <FuturisticCard height="h-64">
        <div className="text-center mb-4 -mt-4">
          <h2 className="text-xl font-semibold text-white font-['Orbitron'] mb-4">Inventory Overview</h2>
          <HorizontalBarChart onCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />
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
            <FuturisticButton variant="primary" onClick={fetchItems}>
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
            emptyMessage={selectedCategory ? `No ${selectedCategory.toLowerCase()} items found` : "No items in your fridge yet"}
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
    <Routes>
      <Route path="/" element={<FridgePage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/manual-input" element={<ManualInputPage />} />
      <Route path="/image-confirmation" element={<ImageConfirmationPage />} />
    </Routes>
  );
}

export default App;