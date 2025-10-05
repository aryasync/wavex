import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkThemeLayout from './components/DarkThemeLayout';
import FuturisticCard from './components/FuturisticCard';
import FuturisticButton from './components/FuturisticButton';

const ManualInputPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    todaysDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    category: ''
  });

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Other'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    // TODO: Save the manually input item
    console.log("Manual item saved:", formData);
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <DarkThemeLayout title="MANUALLY INPUT ITEM">
      {/* Input Fields */}
      <div className="space-y-4 mb-8">
        {/* Name Input */}
        <FuturisticCard height="h-auto" gradient="from-blue-500 to-teal-500">
          <div className="p-4">
            <input
              type="text"
              placeholder="NAME"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-transparent text-white placeholder-white/60 font-['Orbitron'] text-lg font-semibold outline-none"
            />
          </div>
        </FuturisticCard>

        {/* Today's Date Input */}
        <FuturisticCard height="h-auto" gradient="from-blue-500 to-teal-500">
          <div className="p-4">
            <input
              type="date"
              value={formData.todaysDate}
              onChange={(e) => handleInputChange('todaysDate', e.target.value)}
              className="w-full bg-transparent text-white font-['Orbitron'] text-lg font-semibold outline-none"
            />
          </div>
        </FuturisticCard>

        {/* Expiration Date Input */}
        <FuturisticCard height="h-auto" gradient="from-blue-500 to-teal-500">
          <div className="p-4">
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleInputChange('expirationDate', e.target.value)}
              className="w-full bg-transparent text-white font-['Orbitron'] text-lg font-semibold outline-none"
            />
          </div>
        </FuturisticCard>

        {/* Category Input */}
        <FuturisticCard height="h-auto" gradient="from-blue-500 to-teal-500">
          <div className="p-4">
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full bg-transparent text-white font-['Orbitron'] text-lg font-semibold outline-none"
            >
              <option value="" className="bg-gray-800">CATEGORY</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </FuturisticCard>
      </div>

      {/* Confirm Button */}
      <div className="mb-6">
        <FuturisticButton 
          variant="primary" 
          className="w-full py-4 text-lg font-semibold"
          onClick={handleConfirm}
          disabled={!formData.name || !formData.expirationDate || !formData.category}
        >
          CONFIRM
        </FuturisticButton>
      </div>

      {/* Cancel Button */}
      <div className="flex justify-center">
        <FuturisticButton 
          variant="secondary" 
          className="px-6 py-2 text-sm"
          onClick={handleCancel}
        >
          CANCEL
        </FuturisticButton>
      </div>
    </DarkThemeLayout>
  );
};

export default ManualInputPage;
