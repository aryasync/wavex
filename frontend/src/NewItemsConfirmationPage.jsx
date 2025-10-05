import { useNavigate } from "react-router-dom";
import { useItems } from "./contexts/ItemsContext";
import { useAIAnalysis } from "./hooks/useAIAnalysis";
import { usePendingItems } from "./hooks/usePendingItems";
import LoadingState from "./components/NewItemsConfirmation/LoadingState";
import ErrorState from "./components/NewItemsConfirmation/ErrorState";
import NoItemsState from "./components/NewItemsConfirmation/NoItemsState";
import ItemsFoundState from "./components/NewItemsConfirmation/ItemsFoundState";

function NewItemsConfirmationPage() {
  const navigate = useNavigate();
  const { items, refetchItems } = useItems();
  
  // Custom hooks
  const { aiAnalysisResult, isAnalyzing, analysisError } = useAIAnalysis();
  const { pendingItems, isProcessing, confirmSelectedItems, deleteAllPendingItems } = usePendingItems(aiAnalysisResult, items);

  // Navigation handlers
  const handleGoBack = async () => {
    await refetchItems();
    navigate("/");
  };

  const handleConfirmSelected = async (selectedItems) => {
    const result = await confirmSelectedItems(selectedItems);
    if (result.success) {
      await refetchItems();
      navigate("/");
    }
    return result;
  };

  const handleDiscardAll = async () => {
    const result = await deleteAllPendingItems();
    if (result.success) {
      await refetchItems();
      navigate("/");
    }
    return result;
  };


  // Render different states based on AI analysis
  if (isAnalyzing) {
    return <LoadingState />;
  }

  if (analysisError) {
    return <ErrorState error={analysisError} onGoBack={handleGoBack} />;
  }

  if (aiAnalysisResult && aiAnalysisResult.createdCount === 0) {
    return <NoItemsState onTryAgain={handleGoBack} />;
  }

  if (aiAnalysisResult && aiAnalysisResult.createdCount > 0) {
    return (
      <ItemsFoundState
        aiAnalysisResult={aiAnalysisResult}
        pendingItems={pendingItems}
        isProcessing={isProcessing}
        onConfirmSelected={handleConfirmSelected}
        onDiscardAll={handleDiscardAll}
      />
    );
  }

  // Fallback state (should not normally reach here)
  return <ErrorState error="Unknown state" onGoBack={handleGoBack} />;
}

export default NewItemsConfirmationPage;
