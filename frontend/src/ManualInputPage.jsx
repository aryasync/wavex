import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FuturisticCard from './components/FuturisticCard';
import FuturisticButton from './components/FuturisticButton';
import { useItems } from './hooks/useItems';

const ManualInputPage = () => {
  const navigate = useNavigate();
  const { addItem } = useItems();
  const [formData, setFormData] = useState({
    name: '',
    todaysDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    category: ''
  });

  const categories = ['Produce', 'Dairy', 'Meat', 'Pantry', 'Other'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    // Add the manually input item
    const newItem = {
      name: formData.name,
      category: formData.category,
      expiryDate: formData.expirationDate,
      purchasedDate: formData.todaysDate,
      icon: getCategoryIcon(formData.category)
    };
    addItem(newItem);
    
    // Navigate back to home page
    navigate("/");
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Produce': '🥬',
      'Dairy': '🥛',
      'Meat': '🥩',
      'Pantry': '🥫',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white font-['Kodchasan'] mb-2">
          Add New Item
        </h2>
        <p className="text-white/70 text-sm">
          Enter the details for your new fridge item
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-6 mb-8">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="block text-white font-['Orbitron'] text-sm font-semibold uppercase tracking-wider">
            Item Name
          </label>
          <FuturisticCard height="h-auto" gradient="from-blue-500 to-teal-500">
            <div className="p-4">
              <input
                type="text"
                placeholder="Enter item name (e.g., Milk, Apples, Bread)"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/60 font-['Orbitron'] text-lg font-semibold outline-none focus:placeholder-white/40 transition-all"
                autoFocus
              />
            </div>
          </FuturisticCard>
        </div>

        {/* Category Input */}
        <div className="space-y-2">
          <label className="block text-white font-['Orbitron'] text-sm font-semibold uppercase tracking-wider">
            Category
          </label>
          <FuturisticCard height="h-auto" gradient="from-blue-500 to-teal-500">
            <div className="p-4">
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-transparent text-white font-['Orbitron'] text-lg font-semibold outline-none cursor-pointer"
              >
                <option value="" className="bg-gray-800 text-white/60">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800 text-white">
                    {getCategoryIcon(category)} {category}
                  </option>
                ))}
              </select>
            </div>
          </FuturisticCard>
        </div>

        {/* Purchase Date Input */}
        <div className="space-y-2">
          <label className="block text-white font-['Orbitron'] text-sm font-semibold uppercase tracking-wider">
            Date Purchased
          </label>
          <FuturisticCard height="h-auto" gradient="from-blue-500 to-teal-500">
            <div className="p-4">
              <input
                type="date"
                value={formData.todaysDate}
                onChange={(e) => handleInputChange('todaysDate', e.target.value)}
                className="w-full bg-transparent text-white font-['Orbitron'] text-lg font-semibold outline-none cursor-pointer"
              />
            </div>
          </FuturisticCard>
        </div>

        {/* Expiration Date Input */}
        <div className="space-y-2">
          <label className="block text-white font-['Orbitron'] text-sm font-semibold uppercase tracking-wider">
            Expiration Date
          </label>
          <FuturisticCard height="h-auto" gradient="from-red-500 to-orange-500">
            <div className="p-4">
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                className="w-full bg-transparent text-white font-['Orbitron'] text-lg font-semibold outline-none cursor-pointer"
              />
            </div>
          </FuturisticCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Confirm Button */}
        <FuturisticButton 
          variant="primary" 
          className="w-full py-4 text-lg font-semibold font-['Orbitron']"
          onClick={handleConfirm}
          disabled={!formData.name || !formData.expirationDate || !formData.category}
        >
          ✓ ADD ITEM
        </FuturisticButton>

        {/* Cancel Button */}
        <div className="flex justify-center">
          <FuturisticButton 
            variant="secondary" 
            className="px-8 py-3 text-sm font-['Orbitron']"
            onClick={handleCancel}
          >
            ✕ CANCEL
          </FuturisticButton>
        </div>
      </div>

      {/* Form Status */}
      {(!formData.name || !formData.expirationDate || !formData.category) && (
        <div className="mt-6 text-center">
          <p className="text-white/50 text-xs font-['Orbitron']">
            Please fill in all required fields to add the item
          </p>
        </div>
      )}
    </div>
  );
};

export default ManualInputPage;
