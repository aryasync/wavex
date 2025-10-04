const Button = ({ children, onClick, variant = "primary", className = "", icon, ...props }) => {
  const baseClasses = "px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 flex items-center justify-center";
  
  const variants = {
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
