import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AboutModal from "./AboutModal";
import { useItems } from "../hooks/useItems";

const DarkThemeLayout = ({ children, title, showWaveIcon = true, onCameraClick }) => {
  const navigate = useNavigate();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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
      navigate("/");
    }
  };

  const handleWaveClick = () => {
    setIsAboutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#1a3636] text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold font-['Orbitron']">{title}</h1>
        {showWaveIcon && (
          <button 
            onClick={handleWaveClick}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors cursor-pointer"
          >
            <span className="text-[#1a3636] text-lg">🌊</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="px-6 pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a3636] border-t border-white/20">
        <div className="flex py-3 px-2 max-w-md mx-auto">
          <div className="flex-1 flex justify-center">
            <button onClick={() => navigate("/")} className="p-2">
              <span className="text-white text-3xl">🏠</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={handleCameraClick} className="p-2">
              <span className="text-white text-3xl">📷</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={() => navigate("/calendar")} className="p-2">
              <span className="text-white text-3xl">📅</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={() => navigate("/notifications")} className="p-2 relative">
              <span className="text-white text-3xl">🔔</span>
              {hasNotifications && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </div>
  );
};

export default DarkThemeLayout;
