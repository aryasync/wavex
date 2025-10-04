const Input = ({ placeholder, value, onChange, className = "", ...props }) => {
  return (
    <input
      className={`w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors duration-200 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default Input;
