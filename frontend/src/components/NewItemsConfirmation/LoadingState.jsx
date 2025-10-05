import SectionCard from "../SectionCard";
import AdvancedItemsTable from "../AdvancedItemsTable";

/**
 * Loading state component for AI analysis
 */
const LoadingState = () => {
  return (
    <SectionCard title="Processing Image">
      <div className="text-center mb-6">
        <p className="text-white/80 mb-6">
          AI is analyzing your image and detecting food items.
        </p>
        <AdvancedItemsTable
          variant="skeleton"
          headers={["Product", "Category", "Expiry Days"]}
          rowCount={5}
        />
      </div>
    </SectionCard>
  );
};

export default LoadingState;
