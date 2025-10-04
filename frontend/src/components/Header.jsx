const Header = ({ title, className = "" }) => {
  return (
    <h1 className={`text-3xl font-semibold text-blue-600 mb-8 text-center ${className}`}>
      {title}
    </h1>
  );
};

export default Header;
