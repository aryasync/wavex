import SectionCard from "../SectionCard";
import FuturisticButton from "../FuturisticButton";

/**
 * No items detected state component
 */
const NoItemsState = ({ onTryAgain }) => {
  return (
    <SectionCard title="No Items Detected">
      <div className="text-center">
        <p className="text-white/80 mb-6">
          No food items were detected in your image.
        </p>
        <FuturisticButton variant="primary" onClick={onTryAgain}>
          Try Again
        </FuturisticButton>
      </div>
    </SectionCard>
  );
};

export default NoItemsState;
