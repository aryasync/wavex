import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkThemeLayout from "./components/DarkThemeLayout";
import FuturisticCard from "./components/FuturisticCard";
import FuturisticButton from "./components/FuturisticButton";
import FuturisticTable from "./components/FuturisticTable";
import CameraModal from "./components/CameraModal";

function CalendarPage() {
  const navigate = useNavigate();
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
      { name: "Bananas", category: "Fruits", icon: "🍌" },
      { name: "Bread", category: "Other", icon: "🍞" }
    ],
    "2025-01-16": [
      { name: "Yogurt", category: "Dairy", icon: "🥛" },
      { name: "Strawberries", category: "Fruits", icon: "🍓" }
    ],
    "2025-10-04": [
      { name: "Chicken Breast", category: "Meat", icon: "🥩" },
      { name: "Spinach", category: "Vegetables", icon: "🥬" },
      { name: "Cheese", category: "Dairy", icon: "🧀" }
    ],
    "2025-10-05": [
      { name: "Ground Beef", category: "Meat", icon: "🥩" },
      { name: "Carrots", category: "Vegetables", icon: "🥕" }
    ],
    "2025-01-03": [
      { name: "Salmon", category: "Meat", icon: "🐟" },
      { name: "Apples", category: "Fruits", icon: "🍎" },
      { name: "Eggs", category: "Dairy", icon: "🥚" }
    ],
    "2025-01-02": [
      { name: "Pork Chops", category: "Meat", icon: "🥩" },
      { name: "Broccoli", category: "Vegetables", icon: "🥦" },
      { name: "Butter", category: "Dairy", icon: "🧈" }
    ],
    "2025-01-05": [
      { name: "Turkey", category: "Meat", icon: "🦃" },
      { name: "Oranges", category: "Fruits", icon: "🍊" }
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
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium
            transition-colors hover:bg-white/20
            ${isCurrentDay ? 'bg-white text-blue-600 font-bold' : ''}
            ${isSelectedDay && !isCurrentDay ? 'bg-white/30 text-white' : ''}
            ${!isCurrentDay && !isSelectedDay ? 'text-white/80 hover:text-white' : ''}
          `}
        >
          {day}
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
    return foodExpirationData[dateString] || [];
  };

  return (
    <DarkThemeLayout title="CALENDAR" onCameraClick={() => setIsCameraOpen(true)}>
      {/* Calendar Box */}
      <FuturisticCard height="h-80">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <FuturisticButton variant="secondary" size="icon" onClick={getPreviousMonth}>
            ‹
          </FuturisticButton>
          
          <h2 className="text-xl font-semibold text-white font-['Orbitron']">
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
        </div>

        {/* Today Button */}
        <div className="flex justify-center">
          <FuturisticButton variant="secondary" onClick={goToToday}>
            Today
          </FuturisticButton>
        </div>
      </FuturisticCard>

      {/* Items Section */}
      <div>
        <h3 className="text-xl font-bold font-['Orbitron'] mb-4">Items</h3>
        
        <FuturisticTable
          headers={["Product", "Date Bought", "Expiration Date"]}
          data={selectedDate ? getFoodForDate(selectedDate).map((food, index) => [
            { content: (
              <div className="flex items-center space-x-2">
                <span className="text-lg">{food.icon}</span>
                <span>{food.name}</span>
              </div>
            )},
            { content: new Date().toLocaleDateString(), className: "text-white/70" },
            { content: selectedDate.toLocaleDateString(), className: "text-red-400" }
          ]) : []}
          emptyMessage={selectedDate ? "No items expiring on this date" : "Select a date to see expiring items"}
        />
      </div>

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