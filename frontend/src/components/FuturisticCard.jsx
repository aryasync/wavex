const FuturisticCard = ({ children, className = "", gradient = "" }) => {
  return (
    <div className={`bg-gradient-to-b ${gradient} rounded-2xl p-6 mb-8 h-auto ${className}`}>
      {children}
    </div>
  );
};

export default FuturisticCard;
