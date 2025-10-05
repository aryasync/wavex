import { useState } from 'react';
import SectionCard from "../SectionCard";
import FuturisticButton from "../FuturisticButton";
import AdvancedItemsTable from "../AdvancedItemsTable";
import ConfirmationModal from "../ConfirmationModal";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleConfirm = async () => {
    const result = await onConfirmSelected(selectedItems);
    if (result.success) {
      setSelectedItems([]); // Clear selection after successful confirmation
      setShowConfirmModal(false);
    }
  };

  const handleDiscard = async () => {
    const result = await onDiscardAll();
    if (result.success) {
      setSelectedItems([]); // Clear selection after successful discard
      setShowDiscardModal(false);
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
            onClick={() => setShowConfirmModal(true)}
            disabled={selectedItems.length === 0 || isProcessing}
          >
            {isProcessing ? "Processing..." : `Confirm ${selectedItems.length} Selected Items`}
          </FuturisticButton>

          <FuturisticButton
            variant="secondary"
            className="w-full"
            onClick={() => setShowDiscardModal(true)}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Discard"}
          </FuturisticButton>
        </div>
      </SectionCard>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title="Confirm Selected Items"
        message={`Are you sure you want to confirm ${selectedItems.length} selected items? The unselected items will be discarded.`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="success"
        isLoading={isProcessing}
      />

      {/* Discard Modal */}
      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleDiscard}
        title="Discard All Items"
        message="Are you sure you want to discard all detected items? This action cannot be undone."
        confirmText="Discard"
        cancelText="Cancel"
        variant="secondary"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default ItemsFoundState;
