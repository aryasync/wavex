import { useState, useMemo } from "react";
import FuturisticButton from "./components/FuturisticButton";
import ItemsTable from "./components/ItemsTable";
import RingPieChart from "./components/RingPieChart";
import SectionCard from "./components/SectionCard";
import { useItems } from "./contexts/ItemsContext";
import { useCategories } from "./hooks/useCategories";

/**
 * Home Component
 * Main page displaying inventory overview and items list
 */
function Home() {
  const { items, loading, error, refetchItems } = useItems();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    getCategoryColor,
  } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState([]);

  /**
   * Calculate category data showing all categories, even those with 0 items
   */
  const categoryData = useMemo(() => {
    const categoryCounts = {};

    // Count items by category
    items.forEach((item) => {
      const category = item.category.toLowerCase();
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Show ALL categories from backend config, including those with 0 items
    return categories.map((category, index) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
      value: categoryCounts[category.toLowerCase()] || 0, // Use 0 if no items
      color: getCategoryColor(category, index),
    }));
  }, [items, categories, getCategoryColor]);

  /**
   * Filter items based on selected categories
   */
  const filteredItems =
    selectedCategories.length > 0
      ? items.filter((item) =>
          selectedCategories.some(
            (category) => item.category.toLowerCase() === category.toLowerCase()
          )
        )
      : items;

  /**
   * Handle category click for filtering
   */
  const handleCategoryClick = (category) => {
    if (category === "CLEAR_ALL") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Remove category if already selected
        return prev.filter((cat) => cat !== category);
      } else {
        // Add category if not selected
        return [...prev, category];
      }
    });
  };

  return (
    <div>
      {/* Ring Pie Chart Section */}
      <SectionCard title="Fridge Contents">
        <RingPieChart
          data={categoryData}
          onCategoryClick={handleCategoryClick}
          selectedCategories={selectedCategories}
        />
      </SectionCard>

      {/* Items Section */}
      <SectionCard title="Items">
        {(loading || categoriesLoading) && (
          <p className="text-white/60">Loading items and categories...</p>
        )}

        {(error || categoriesError) && (
          <div>
            <p className="text-red-400 mb-4">
              Error: {error || categoriesError}
            </p>
            <FuturisticButton variant="primary" onClick={refetchItems}>
              Retry
            </FuturisticButton>
          </div>
        )}

        {!loading && !error && !categoriesLoading && !categoriesError && (
          <ItemsTable
            headers={["Product", "Days to Expire"]}
            items={filteredItems}
            columns={[
              { key: 'product' },
              { key: 'daysToExpire' }
            ]}
            emptyMessage={
              selectedCategories.length > 0
                ? `No items found in selected categories: ${selectedCategories
                    .join(", ")
                    .toLowerCase()}`
                : "No items in your fridge yet"
            }
          />
        )}
      </SectionCard>
    </div>
  );
}

export default Home;
