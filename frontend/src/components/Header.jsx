const Header = ({ title, className = "", dark = false, showWaveIcon = false }) => {
  if (dark) {
    return (
      <div className={`flex justify-between items-center p-6 ${className}`}>
        <h1 className="text-2xl font-bold font-['Orbitron']">{title}</h1>
        {showWaveIcon && (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1a3636] text-lg">🌊</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <h1 className={`text-3xl font-semibold text-blue-600 mb-8 text-center ${className}`}>
      {title}
    </h1>
  );
};

export default Header;
