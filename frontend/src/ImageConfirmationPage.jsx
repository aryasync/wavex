import { useLocation, useNavigate } from "react-router-dom";
import DarkThemeLayout from "./components/DarkThemeLayout";
import FuturisticCard from "./components/FuturisticCard";
import FuturisticButton from "./components/FuturisticButton";

function ImageConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageData } = location.state || {};

  const handleConfirm = () => {
    // TODO: Process the confirmed image (save to backend, etc.)
    console.log("Image confirmed:", imageData);
    // Navigate to calendar to pick expiration date
    navigate("/calendar", { state: { imageData, fromConfirmation: true } });
  };

  const handleReject = () => {
    // Navigate back to home page
    navigate("/");
  };

  if (!imageData) {
    return (
      <DarkThemeLayout title="NO IMAGE">
        <FuturisticCard height="h-auto" gradient="from-red-600 to-pink-600">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white  mb-6">
              No Image Data Found
            </h2>
            <p className="text-white/80 mb-8">No image data was passed to this page.</p>
            <FuturisticButton variant="primary" onClick={handleReject}>
              Go Back
            </FuturisticButton>
          </div>
        </FuturisticCard>
      </DarkThemeLayout>
    );
  }

  return (
    <DarkThemeLayout title="CONFIRM IMAGE">
      {/* Image Preview */}
      <FuturisticCard height="h-auto" gradient="from-purple-600 to-blue-600">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white  mb-4">
            Image Confirmation
          </h2>
          <div className="bg-black/20 rounded-lg overflow-hidden">
            <img
              src={imageData}
              alt="Captured image"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <FuturisticButton 
            variant="success" 
            className="w-full"
            onClick={handleConfirm}
          >
            ✓ Confirm & Save
          </FuturisticButton>
          
          <FuturisticButton 
            variant="danger" 
            className="w-full"
            onClick={handleReject}
          >
            ✗ Cancel
          </FuturisticButton>
        </div>
      </FuturisticCard>
    </DarkThemeLayout>
  );
}

export default ImageConfirmationPage;
