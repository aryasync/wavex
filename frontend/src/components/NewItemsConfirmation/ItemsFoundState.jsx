import { useState } from 'react';
import SectionCard from "../SectionCard";
import FuturisticButton from "../FuturisticButton";
import AdvancedItemsTable from "../AdvancedItemsTable";

/**
 * Items found state component with selection functionality
 */
const ItemsFoundState = ({ 
  aiAnalysisResult, 
  pendingItems, 
  isProcessing, 
  onConfirmSelected, 
  onDiscardAll 
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleConfirm = async () => {
    const result = await onConfirmSelected(selectedItems);
    if (result.success) {
      setSelectedItems([]); // Clear selection after successful confirmation
    }
  };

  const handleDiscard = async () => {
    const result = await onDiscardAll();
    if (result.success) {
      setSelectedItems([]); // Clear selection after successful discard
    }
  };

  return (
    <div>
      {/* Summary Section */}
      <SectionCard title={`AI Found ${aiAnalysisResult.createdCount} Items`}>
        <div className="text-center mb-6">
          <p className="text-white/80">
            {aiAnalysisResult.message || "Select the rows you want to keep. Click on items to select them."}
          </p>
        </div>
      </SectionCard>

      {/* Selectable Items List */}
      <SectionCard title="Detected Items">
        <AdvancedItemsTable
          variant="selectable"
          headers={["Product", "Category", "Expiry Days"]}
          items={pendingItems}
          columns={[
            { key: "name" },
            { key: "category" },
            { key: "expiryPeriod" },
          ]}
          emptyMessage="No items found"
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
        />

        {/* Action Buttons */}
        <div className="space-y-4 mt-6">
          <FuturisticButton
            variant="success"
            className="w-full"
            onClick={handleConfirm}
            disabled={selectedItems.length === 0 || isProcessing}
          >
            {isProcessing ? "Processing..." : `✓ Confirm ${selectedItems.length} Selected Items`}
          </FuturisticButton>

          <FuturisticButton
            variant="secondary"
            className="w-full"
            onClick={handleDiscard}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "← Discard"}
          </FuturisticButton>
        </div>
      </SectionCard>
    </div>
  );
};

export default ItemsFoundState;
