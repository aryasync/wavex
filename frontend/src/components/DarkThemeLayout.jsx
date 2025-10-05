import { useNavigate } from "react-router-dom";

const DarkThemeLayout = ({ children, title, showWaveIcon = true, onCameraClick }) => {
  const navigate = useNavigate();

  const handleCameraClick = () => {
    if (onCameraClick) {
      onCameraClick();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a3636] text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold font-['Orbitron']">{title}</h1>
        {showWaveIcon && (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1a3636] text-lg">🌊</span>
          </div>
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
              <span className="text-white text-xl">🏠</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={handleCameraClick} className="p-2">
              <span className="text-white text-xl">📷</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={() => navigate("/calendar")} className="p-2">
              <span className="text-white text-xl">📅</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={() => navigate("/notifications")} className="p-2">
              <span className="text-white text-xl">🔔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkThemeLayout;
