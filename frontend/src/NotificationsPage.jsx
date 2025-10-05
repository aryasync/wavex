import FuturisticCard from './components/FuturisticCard';
import { useItems } from './hooks/useItems';

const NotificationsPage = () => {
  const { items, removeItem } = useItems();
  
  // Filter items that are expiring soon (within 3 days)
  const expiringSoon = items.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  });

  const handleRemoveNotification = (itemId) => {
    removeItem(itemId);
  };

  return (
    <div>
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
              {expiringSoon.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex-1 text-center">
                    {item.purchasedDate}
                  </div>
                  <div className="flex-1 text-center text-red-300">
                    {item.expiryDate}
                  </div>
                  <div className="w-8 flex justify-end">
                    <button 
                      className="text-white hover:text-red-300 transition-colors"
                      onClick={() => handleRemoveNotification(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {expiringSoon.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-lg">No notifications yet</p>
                <p className="text-sm mt-2">Expiration alerts will appear here</p>
              </div>
            )}
          </div>
        </div>
      </FuturisticCard>
    </div>
  );
};

export default NotificationsPage;
