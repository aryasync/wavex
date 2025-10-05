const FuturisticButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "", 
  icon, 
  size = "md",
  ...props 
}) => {
  const baseClasses = "font-medium transition-colors duration-200 flex items-center justify-center ";
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-3 text-base rounded-lg",
    lg: "px-6 py-4 text-lg rounded-xl",
    icon: "p-2 rounded-full"
  };
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700",
    secondary: "bg-white/20 text-white hover:bg-white/30 rounded-full",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700",
    danger: "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700",
    outline: "border-2 border-white/30 text-white hover:bg-white/10",
    ghost: "text-white/80 hover:text-white hover:bg-white/10"
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="text-lg mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default FuturisticButton;
