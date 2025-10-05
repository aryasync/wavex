import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AboutModal from "./AboutModal";
import CameraModal from "./CameraModal";
import { useItems } from "../hooks/useItems";

const DarkThemeLayout = ({ children, title, currentPage, onCameraClick, onImageCapture }) => {
  const navigate = useNavigate();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { items } = useItems();

  // Check for items expiring within 3 days
  const expiringSoon = items.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  });

  const hasNotifications = expiringSoon.length > 0;

  const handleCameraClick = () => {
    if (onCameraClick) {
      onCameraClick();
    } else {
      setIsCameraOpen(true);
    }
  };

  const handleImageCapture = (imageData) => {
    setIsCameraOpen(false);
    if (onImageCapture) {
      onImageCapture(imageData);
    } else {
      navigate('/image-confirmation', { state: { imageData } });
    }
  };

  const handleWaveClick = () => {
    setIsAboutOpen(true);
  };

  // Navigation items with active state
  const navItems = [
    { id: 'home', icon: '🏠', path: '/', label: 'Home' },
    { id: 'camera', icon: '📷', path: null, label: 'Camera', onClick: handleCameraClick },
    { id: 'calendar', icon: '📅', path: '/calendar', label: 'Calendar' },
    { id: 'notifications', icon: '🔔', path: '/notifications', label: 'Notifications', hasNotification: hasNotifications }
  ];

  return (
    <div className="min-h-screen bg-[#1a3636] text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold font-['Orbitron']">{title}</h1>
        <button 
          onClick={handleWaveClick}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors cursor-pointer"
        >
          <span className="text-[#1a3636] text-lg">🌊</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a3636] border-t border-white/20">
        <div className="flex py-3 px-2 max-w-md mx-auto">
          {navItems.map((item) => (
            <div key={item.id} className="flex-1 flex justify-center">
              <button 
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`p-2 relative transition-all duration-200 ${
                  currentPage === item.id 
                    ? 'bg-white/20 rounded-lg' 
                    : 'hover:bg-white/10 rounded-lg'
                }`}
                title={item.label}
              >
                <span className={`text-3xl ${
                  currentPage === item.id ? 'text-white' : 'text-white/70'
                }`}>
                  {item.icon}
                </span>
                {item.hasNotification && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />

      {/* Camera Modal */}
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleImageCapture}
      />
    </div>
  );
};

export default DarkThemeLayout;
