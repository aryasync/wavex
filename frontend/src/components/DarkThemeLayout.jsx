import { useNavigate } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import AboutModal from "./AboutModal";
import CameraModal from "./CameraModal";
import { useModalManager } from "../hooks/useModalManager";
import { useNotifications } from "../hooks/useNotifications";

const DarkThemeLayout = ({ children, title, currentPage, onCameraClick, onImageCapture }) => {
  const navigate = useNavigate();
  const { hasNotifications } = useNotifications();
  
  // Modal management
  const modalManager = useModalManager(onImageCapture);
  
  const handleCameraClick = () => {
    if (onCameraClick) {
      onCameraClick();
    } else {
      modalManager.handleCameraClick();
    }
  };

  return (
    <div className="min-h-screen bg-[#1a3636] text-white">
      {/* Header */}
      <Header 
        title={title} 
        onWaveClick={modalManager.handleWaveClick} 
      />

      {/* Main Content */}
      <div className="px-6 pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentPage={currentPage}
        hasNotifications={hasNotifications}
        onNavigate={navigate}
        onCameraClick={handleCameraClick}
      />

      {/* Modals */}
      <AboutModal 
        isOpen={modalManager.isAboutOpen} 
        onClose={modalManager.closeAbout} 
      />
      <CameraModal 
        isOpen={modalManager.isCameraOpen} 
        onClose={modalManager.closeCamera}
        onCapture={modalManager.handleImageCapture}
      />
    </div>
  );
};

export default DarkThemeLayout;
