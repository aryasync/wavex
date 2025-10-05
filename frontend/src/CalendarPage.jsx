import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DarkThemeLayout from "./components/DarkThemeLayout";
import FuturisticCard from "./components/FuturisticCard";
import FuturisticButton from "./components/FuturisticButton";
import FuturisticTable from "./components/FuturisticTable";
import CameraModal from "./components/CameraModal";
import { useItems } from "./hooks/useItems";

function CalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageData, fromConfirmation } = location.state || {};
  const { items, addItem } = useItems();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleImageCapture = (imageData) => {
    setIsCameraOpen(false);
    navigate('/image-confirmation', { state: { imageData } });
  };

  // Sample food expiration data
  const foodExpirationData = {
    "2025-01-15": [
      { name: "Milk", category: "Dairy", icon: "🥛" },
      { name: "Bananas", category: "Produce", icon: "🍌" },
      { name: "Bread", category: "Other", icon: "🍞" }
    ],
    "2025-01-16": [
      { name: "Yogurt", category: "Dairy", icon: "🥛" },
      { name: "Strawberries", category: "Produce", icon: "🍓" }
    ],
    "2025-10-04": [
      { name: "Chicken Breast", category: "Meat", icon: "🥩" },
      { name: "Spinach", category: "Produce", icon: "🥬" },
      { name: "Cheese", category: "Dairy", icon: "🧀" }
    ],
    "2025-10-05": [
      { name: "Ground Beef", category: "Meat", icon: "🥩" },
      { name: "Carrots", category: "Produce", icon: "🥕" }
    ],
    "2025-01-03": [
      { name: "Salmon", category: "Meat", icon: "🐟" },
      { name: "Apples", category: "Produce", icon: "🍎" },
      { name: "Eggs", category: "Dairy", icon: "🥚" }
    ],
    "2025-01-02": [
      { name: "Pork Chops", category: "Meat", icon: "🥩" },
      { name: "Broccoli", category: "Produce", icon: "🥦" },
      { name: "Butter", category: "Dairy", icon: "🧈" }
    ],
    "2025-01-05": [
      { name: "Turkey", category: "Meat", icon: "🦃" },
      { name: "Oranges", category: "Produce", icon: "🍊" }
    ]
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const handleConfirmExpiration = () => {
    if (selectedDate && fromConfirmation) {
      // Add the item with the selected expiration date
      const newItem = {
        name: "Scanned Item", // This would come from image processing
        category: "Other", // This would be determined from image analysis
        expiryDate: selectedDate.toISOString().split('T')[0],
        icon: "📦",
        purchasedDate: new Date().toISOString().split('T')[0]
      };
      addItem(newItem);
      
      // Navigate back to home page
      navigate("/");
    } else if (selectedDate) {
      // Regular calendar usage
      console.log("Selected date:", selectedDate);
    }
  };

  const handleCancelExpiration = () => {
    if (fromConfirmation) {
      // Navigate back to image confirmation
      navigate("/image-confirmation", { state: { imageData } });
    } else {
      // Navigate to home
      navigate("/");
    }
  };

  const handleDenyAndManual = () => {
    // Navigate to manual input page
    navigate("/manual-input");
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isSelectedDay = isSelected(day);
      
      // Check if there are items expiring on this day
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayDateString = dayDate.toISOString().split('T')[0];
      const itemsForDay = items.filter(item => item.expiryDate === dayDateString);
      const hasItems = itemsForDay.length > 0;
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium relative
            transition-colors hover:bg-white/20
            ${isCurrentDay ? 'bg-white text-blue-600 font-bold' : ''}
            ${isSelectedDay && !isCurrentDay ? 'bg-white/30 text-white' : ''}
            ${!isCurrentDay && !isSelectedDay ? 'text-white/80 hover:text-white' : ''}
            ${hasItems ? 'ring-1 ring-green-400' : ''}
          `}
        >
          {day}
          {hasItems && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "No date selected";
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFoodForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return items.filter(item => item.expiryDate === dateString);
  };

  // Calculate dynamic margin based on calendar height
  const getDynamicMargin = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const weeksInMonth = Math.ceil((firstDay + daysInMonth) / 7);
    
    // Base margin + additional margin based on number of weeks
    const baseMargin = 64; // mt-16 equivalent
    const additionalMargin = (weeksInMonth - 4) * 24; // 24px per extra week
    
    return baseMargin + additionalMargin;
  };

  return (  
    <DarkThemeLayout title="PICK EXPIRATION DATE" onCameraClick={() => setIsCameraOpen(true)}>
      {/* Calendar Box */}
      <FuturisticCard height="h-80">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <FuturisticButton variant="secondary" size="icon" onClick={getPreviousMonth}>
            ‹
          </FuturisticButton>
          
          <h2 className="text-xl font-semibold text-white ">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <FuturisticButton variant="secondary" size="icon" onClick={getNextMonth}>
            ›
          </FuturisticButton>
        </div>

        {/* Calendar Grid */}
        <div className="mb-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {dayNames.map((day) => (
              <div key={day} className="h-6 flex items-center justify-center text-xs font-medium text-white/80">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center items-center mt-4 space-x-4 text-xs text-white/60">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Items expiring</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Today Button */}
        <div className="flex justify-center">
          <FuturisticButton variant="secondary" onClick={goToToday}>
            Today
          </FuturisticButton>
        </div>
      </FuturisticCard>

      {/* Confirm and Deny Buttons (only show when coming from confirmation) */}
      {fromConfirmation && (
        <div className="flex justify-center mt-16">
          <FuturisticButton 
            variant="primary" 
            className="px-8 py-3 text-lg font-semibold -mr-1"
            onClick={handleConfirmExpiration}
            disabled={!selectedDate}
          >
            CONFIRM
          </FuturisticButton>
          
          <FuturisticButton 
            variant="danger" 
            className="px-8 py-3 text-lg font-semibold -ml-4"
            onClick={handleDenyAndManual}
          >
            DENY
          </FuturisticButton>
        </div>
      )}

      {/* Cancel Button (only show when coming from confirmation) */}
      {fromConfirmation && (
        <div className="flex justify-center mt-2">
          <FuturisticButton 
            variant="secondary" 
            className="px-6 py-2 text-sm"
            onClick={handleCancelExpiration}
          >
            CANCEL
          </FuturisticButton>
        </div>
      )}

      {/* Prompt Message */}
      {fromConfirmation && (
        <div className="text-center mt-2">
          <p className="text-white/60 text-sm">
            {selectedDate 
              ? `Selected expiration date: ${selectedDate.toLocaleDateString()}`
              : "Please select an expiration date for your item"
            }
          </p>
        </div>
      )}

      {/* Items for Selected Date (only show when not from confirmation) */}
      {!fromConfirmation && selectedDate && (
        <div style={{ marginTop: `${getDynamicMargin()}px` }}>
          <h3 className="text-xl font-bold  mb-4 text-center text-white">
            Items Expiring on {selectedDate.toLocaleDateString()}
          </h3>
          
          <FuturisticTable
            headers={["Product", "Category", "Date Bought"]}
            data={getFoodForDate(selectedDate).map((item) => [
              { content: (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              )},
              { content: item.category, className: "text-white/70" },
              { content: item.purchasedDate, className: "text-white/70" }
            ])}
            emptyMessage="No items expiring on this date"
          />
        </div>
      )}

      {/* Camera Modal */}
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleImageCapture}
      />
    </DarkThemeLayout>
  );
}

export default CalendarPage;