const Button = ({ children, onClick, variant = "primary", className = "", icon, dark = false, ...props }) => {
  const baseClasses = "px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 flex items-center justify-center";
  
  const variants = dark ? {
    primary: "bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700",
    secondary: "bg-white/20 text-white hover:bg-white/30 rounded-full",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700",
    danger: "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700",
    outline: "border-2 border-white/30 text-white hover:bg-white/10",
    icon: "text-white hover:bg-white/10 p-2 rounded-full"
  } : {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-600", 
    success: "bg-green-600 text-white hover:bg-green-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    icon: "border-2 border-gray-300 text-gray-600 hover:bg-gray-50 p-2"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children && <span className={icon ? "ml-2" : ""}>{children}</span>}
    </button>
  );
};

export default Button;
