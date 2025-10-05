const FuturisticCard = ({ children, className = "", gradient = "from-teal-600 to-blue-500", height = "h-80" }) => {
  return (
    <div className={`bg-gradient-to-b ${gradient} rounded-2xl p-6 mb-8 ${height} ${className}`}>
      {children}
    </div>
  );
};

export default FuturisticCard;
