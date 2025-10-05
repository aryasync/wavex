import { useState } from "react";
import SectionCard from "./components/SectionCard";
import FuturisticButton from "./components/FuturisticButton";
import ItemsTable from "./components/ItemsTable";
import ConfirmationModal from "./components/ConfirmationModal";
import { useItems } from "./hooks/useItems";

function CalendarPage() {
  const { items, removeItem } = useItems();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const getNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // const goToToday = () => {
  //   const today = new Date();
  //   setCurrentDate(today);
  //   setSelectedDate(today);
  // };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
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

  // Get background color based on days to expire (matching ItemsTable)
  const getExpiryBackgroundColor = (days) => {
    if (days < 0) return "bg-red-400/30"; // Expired
    if (days <= 3) return "bg-orange-400/30"; // Expiring soon
    if (days <= 7) return "bg-yellow-400/30"; // Expiring this week
    return "bg-green-400/30"; // Good
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
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayDateString = dayDate.toISOString().split("T")[0];
      const itemsForDay = items.filter(
        (item) => item.expiryDate === dayDateString
      );
      const hasItems = itemsForDay.length > 0;

      // Calculate the most urgent expiry status for this day
      let mostUrgentDays = null;
      if (hasItems) {
        const today = new Date();
        const dayDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        const timeDiff = dayDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        mostUrgentDays = daysDiff;
      }

      const backgroundColor = hasItems
        ? getExpiryBackgroundColor(mostUrgentDays)
        : "";

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium relative
            transition-colors hover:bg-white/20
            ${isCurrentDay ? "bg-white text-black font-bold" : ""}
            ${isSelectedDay && !isCurrentDay ? "bg-white/30 text-white" : ""}
            ${
              !isCurrentDay && !isSelectedDay
                ? "text-white/80 hover:text-white"
                : ""
            }
            ${hasItems ? `${backgroundColor} text-white` : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const getFoodForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return items.filter((item) => item.expiryDate === dateString);
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      await removeItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      {/* Calendar Box */}
      <SectionCard title="Calendar">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <FuturisticButton
            variant="secondary"
            size="icon"
            onClick={getPreviousMonth}
          >
            ‹
          </FuturisticButton>

          <h2 className="text-xl font-semibold text-white ">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <FuturisticButton
            variant="secondary"
            size="icon"
            onClick={getNextMonth}
          >
            ›
          </FuturisticButton>
        </div>

        {/* Calendar Grid */}
        <div className="mb-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {dayNames.map((day) => (
              <div
                key={day}
                className="h-6 flex items-center justify-center text-xs font-medium text-white/80"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

          {/* Legend */}
          <div className="flex justify-center items-center mt-4 space-x-4 text-xs text-white/60">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Expired</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Expiring soon</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>This week</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Good</span>
            </div>
            {/* <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Today</span>
            </div> */}
          </div>
        </div>

        {/* Today Button */}
        {/* <FuturisticButton variant="secondary" onClick={goToToday}>
          Today
        </FuturisticButton> */}
      </SectionCard>

      {/* Items for Selected Date */}
      {selectedDate && (
        <SectionCard
          title={`Expiring on ${selectedDate.toLocaleDateString()}`}
        >
          <ItemsTable
            headers={["Product", "Days to Expire"]}
            items={getFoodForDate(selectedDate)}
            columns={[{ key: "product" }, { key: "daysToExpire" }]}
            emptyMessage="No items expiring on this date"
            onDeleteItem={handleDeleteItem}
          />
        </SectionCard>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.product || itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

export default CalendarPage;
