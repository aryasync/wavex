import SectionCard from "../SectionCard";
import FuturisticButton from "../FuturisticButton";

/**
 * Error state component for AI analysis failures
 */
const ErrorState = ({ error, onGoBack }) => {
  return (
    <SectionCard title="Analysis Failed">
      <div className="text-center">
        <p className="text-red-400 mb-6">Error: {error}</p>
        <FuturisticButton variant="primary" onClick={onGoBack}>
          Go Back
        </FuturisticButton>
      </div>
    </SectionCard>
  );
};

export default ErrorState;
