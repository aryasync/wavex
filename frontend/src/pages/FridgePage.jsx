import { useState, useMemo } from "react";
import FuturisticButton from "../components/FuturisticButton";
import FuturisticTable from "../components/FuturisticTable";
import RingPieChart from "../components/RingPieChart";
import SectionCard from "../components/SectionCard";
import { useItems } from "../contexts/ItemsContext";
import { useCategories } from "../hooks/useCategories";

/**
 * FridgePage Component
 * Main page displaying inventory overview and items list
 */
function FridgePage() {
  const { items, loading, error, refetchItems } = useItems();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    getCategoryColor,
  } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState([]);

  /**
   * Calculate category counts from actual items data, sorted by count
   */
  const categoryData = useMemo(() => {
    const categoryCounts = {};

    // Count items by category
    items.forEach((item) => {
      const category = item.category.toLowerCase();
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Only include categories that exist in the backend config
    const categoryEntries = Object.entries(categoryCounts).filter(
      ([category]) => categories.includes(category)
    );

    // Sort by count (highest first) and assign colors based on ranking
    const sortedEntries = categoryEntries.sort(([, a], [, b]) => b - a);

    return sortedEntries.map(([category, count], index) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
      value: count,
      color: getCategoryColor(category, index), // Darkest color for highest count
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
          <FuturisticTable
            headers={["Product", "Category", "Expiration"]}
            data={filteredItems.map((item) => [
              {
                content: (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon || "📦"}</span>
                    <span>{item.name}</span>
                  </div>
                ),
              },
              { content: item.category, className: "text-white/70" },
              { content: item.expiryDate, className: "text-red-400" },
            ])}
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

export default FridgePage;
