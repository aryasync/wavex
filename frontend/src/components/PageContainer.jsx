const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-sm mx-auto h-screen p-5 bg-gray-100 flex flex-col box-border ${className}`}>
      <div className="bg-white rounded-2xl p-6 shadow-lg flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
