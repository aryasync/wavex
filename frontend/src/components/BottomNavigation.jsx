/**
 * BottomNavigation Component
 * Displays the bottom navigation bar with active states
 */
const BottomNavigation = ({ currentPage, hasNotifications, onNavigate, onCameraClick }) => {
  // Navigation items with active state
  const navItems = [
    { id: 'home', icon: '🏠', path: '/', label: 'Home' },
    { id: 'camera', icon: '📷', path: null, label: 'Camera', onClick: onCameraClick },
    { id: 'calendar', icon: '📅', path: '/calendar', label: 'Calendar' },
    { id: 'notifications', icon: '🔔', path: '/notifications', label: 'Notifications', hasNotification: hasNotifications }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a3636] border-t border-white/20">
      <div className="flex py-3 px-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <div key={item.id} className="flex-1 flex justify-center">
            <button 
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  onNavigate(item.path);
                }
              }}
              className={`p-2 relative transition-all duration-200 ${
                currentPage === item.id 
                  ? 'bg-white/20 rounded-lg' 
                  : 'hover:bg-white/10 rounded-lg'
              }`}
              title={item.label}
            >
              <span className={`text-3xl ${
                currentPage === item.id ? 'text-white' : 'text-white/70'
              }`}>
                {item.icon}
              </span>
              {item.hasNotification && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
