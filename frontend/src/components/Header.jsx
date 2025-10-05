/**
 * Header Component
 * Displays the app title and wave button
 */
const Header = ({ title, onWaveClick }) => {
  return (
    <div className="flex justify-between items-center p-6">
      <h1 className="text-2xl font-bold font-['Orbitron']">{title}</h1>
      <button 
        onClick={onWaveClick}
        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors cursor-pointer"
      >
        <span className="text-[#1a3636] text-lg">🌊</span>
      </button>
    </div>
  );
};

export default Header;