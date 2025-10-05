import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AboutPage from "./AboutPage";
import CategoryPage from "./CategoryPage";
import PageContainer from "./components/PageContainer";
import Header from "./components/Header";
import Button from "./components/Button";
import ItemList from "./components/ItemList";
import PieChart from "./components/PieChart";
import CameraModal from "./components/CameraModal";

function FridgePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  // Fetch items when component mounts
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <PageContainer>
      <Header title="🧊 Tsunami Fridge Tracker" />
      
      {/* Pie Chart Section */}
      <div className="mb-6">
        <PieChart />
      </div>
      
      <div className="mb-6">
        <Link to="/about" className="block">
          <Button variant="success" className="w-full">
            About
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading items...</div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center py-8">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button variant="primary" onClick={fetchItems}>
              Retry
            </Button>
          </div>
        )}
        
        {!loading && !error && (
          <ItemList items={items} />
        )}
        
        {/* Extending border that grows with content - longer */}
        <div className="border-t border-gray-200 h-32"></div>
      </div>

      {/* Bottom navigation bar with divider */}
      <div className="border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-10">
        <div className="flex py-3 px-2 max-w-md mx-auto">
          <div className="flex-1 flex justify-center">
            <Button variant="icon" className="rounded-xl w-12 h-12 flex items-center justify-center" icon="🏠">
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={() => setIsCameraOpen(true)}>
              <Button variant="icon" className="rounded-xl w-12 h-12 flex items-center justify-center" icon="📷">
              </Button>
            </button>
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

      {/* Camera Modal */}
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
      />
    </PageContainer>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<FridgePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/category/fruits" element={<CategoryPage categoryName="Fruits" categoryColor="#3B82F6" categoryIcon="🍎" />} />
      <Route path="/category/vegetables" element={<CategoryPage categoryName="Vegetables" categoryColor="#10B981" categoryIcon="🥕" />} />
      <Route path="/category/dairy" element={<CategoryPage categoryName="Dairy" categoryColor="#F59E0B" categoryIcon="🥛" />} />
      <Route path="/category/meat" element={<CategoryPage categoryName="Meat" categoryColor="#EF4444" categoryIcon="🥩" />} />
      <Route path="/category/other" element={<CategoryPage categoryName="Other" categoryColor="#8B5CF6" categoryIcon="📦" />} />
    </Routes>
  );
}

export default App;