import { useState } from 'react';
import DarkThemeLayout from './components/DarkThemeLayout';
import FuturisticCard from './components/FuturisticCard';

const NotificationsPage = () => {
  const [notifications] = useState([
    { id: 1, product: 'Milk', dateBought: '2024-01-15', expirationDate: '2024-01-20', icon: '🥛' },
    { id: 2, product: 'Bread', dateBought: '2024-01-14', expirationDate: '2024-01-18', icon: '🍞' },
    { id: 3, product: 'Apples', dateBought: '2024-01-13', expirationDate: '2024-01-25', icon: '🍎' }
  ]);

  return (
    <DarkThemeLayout title="NOTIFICATIONS">
      {/* Main Notifications Card */}
      <FuturisticCard height="h-auto" gradient="from-teal-600 to-blue-500">
        <div className="relative">
          {/* Background Pufferfish Illustration */}
          <div className="absolute top-[200%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15">
            <div className="text-9xl">🐡</div>
          </div>
          
          {/* Notifications Content */}
          <div className="relative z-10">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6 text-white font-semibold">
              <div className="flex-1 text-left">Product</div>
              <div className="flex-1 text-center">Date Bought</div>
              <div className="flex-1 text-center">Expiration Date</div>
              <div className="w-8"></div>
            </div>
            
            {/* Notification Items */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg">{notification.icon}</span>
                    <span>{notification.product}</span>
                  </div>
                  <div className="flex-1 text-center">
                    {notification.dateBought}
                  </div>
                  <div className="flex-1 text-center text-red-300">
                    {notification.expirationDate}
                  </div>
                  <div className="w-8 flex justify-end">
                    <button className="text-white hover:text-red-300 transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {notifications.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-lg">No notifications yet</p>
                <p className="text-sm mt-2">Expiration alerts will appear here</p>
              </div>
            )}
          </div>
        </div>
      </FuturisticCard>
    </DarkThemeLayout>
  );
};

export default NotificationsPage;
