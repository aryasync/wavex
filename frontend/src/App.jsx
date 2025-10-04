import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AboutPage from "./AboutPage";
import CategoryPage from "./CategoryPage";
import PageContainer from "./components/PageContainer";
import Header from "./components/Header";
import Button from "./components/Button";
import ItemList from "./components/ItemList";
import PieChart from "./components/PieChart";

function FridgePage() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/items");
    const data = await res.json();
    setItems(data);
  };

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
        <ItemList items={items} />
      </div>

      {/* Bottom navigation bar with divider */}
      <div className="border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-10">
        <div className="flex py-3 px-2 max-w-md mx-auto">
          <div className="flex-1 flex justify-center">
            <Button variant="icon" className="rounded-xl w-12 h-12 flex items-center justify-center" icon="🏠">
            </Button>
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
