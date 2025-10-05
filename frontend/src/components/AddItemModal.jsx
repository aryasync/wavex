import { useState, useEffect } from 'react';

const AddItemModal = ({ isOpen, onClose, onAddItem, initialExpirationDate }) => {
  const [name, setName] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [category, setCategory] = useState('');

  console.log("AddItemModal render - isOpen:", isOpen, "initialExpirationDate:", initialExpirationDate);

  useEffect(() => {
    if (isOpen) {
      // Set today's date to current date
      const now = new Date();
      setTodayDate(now.toISOString().split('T')[0]); // YYYY-MM-DD format

      // Set expiration date if provided from calendar
      if (initialExpirationDate) {
        setExpirationDate(initialExpirationDate.toISOString().split('T')[0]);
      } else {
        setExpirationDate('');
      }
      setName('');
      setCategory('');
    }
  }, [isOpen, initialExpirationDate]);

  const handleConfirm = () => {
    if (name && todayDate && expirationDate && category) {
      onAddItem({ name, todayDate, expirationDate, category });
      onClose();
    } else {
      alert('Please fill in all fields.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-[#1a3636] rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
        >
          ✕
        </button>

        <h2 className="text-white text-2xl font-bold text-center mb-8 font-['Orbitron']">
          MANUALLY INPUT ITEM
        </h2>

        <div className="space-y-4 mb-8">
          {/* Name Input */}
          <input
            type="text"
            placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-300 font-['Orbitron']"
          />

          {/* Today's Date Input */}
          <input
            type="date"
            placeholder="TODAY'S DATE"
            value={todayDate}
            onChange={(e) => setTodayDate(e.target.value)}
            className="w-full p-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-300 font-['Orbitron']"
          />

          {/* Expiration Date Input */}
          <input
            type="date"
            placeholder="EXPIRATION DATE"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full p-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-300 font-['Orbitron']"
          />

          {/* Category Input */}
          <input
            type="text"
            placeholder="CATEGORY"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-300 font-['Orbitron']"
          />
        </div>

        {/* Confirm Button */}
        <button
          className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xl font-bold font-['Orbitron'] hover:from-blue-700 hover:to-teal-700 transition-all"
          onClick={handleConfirm}
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};

export default AddItemModal;
