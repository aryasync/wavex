import { useState, useEffect } from 'react';
import FuturisticCard from './components/FuturisticCard';
import FuturisticButton from './components/FuturisticButton';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.data || []);
        } else {
          throw new Error('Failed to fetch notifications');
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [notificationId] }),
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <div>
      {/* Main Notifications Card */}
      <FuturisticCard height="h-auto">
        <div className="relative">
          {/* Background Pufferfish Illustration */}
          <div className="absolute top-[200%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15">
            <div className="text-9xl">🐡</div>
          </div>
          
          {/* Notifications Content */}
          <div className="relative z-10">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 text-white/60">
                <p>Loading notifications...</p>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">Error: {error}</p>
                <FuturisticButton variant="primary" onClick={() => window.location.reload()}>
                  Retry
                </FuturisticButton>
              </div>
            )}
            
            {/* Notifications List */}
            {!loading && !error && (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-center justify-between text-white p-4 rounded-lg ${
                      notification.isRead ? 'bg-white/10' : 'bg-yellow-500/20'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {notification.type === 'item_expiry_warning' ? '⚠️' : 
                           notification.type === 'item_expired' ? '🚨' : '📢'}
                        </span>
                        <span className="font-semibold">{notification.message}</span>
                        {!notification.isRead && (
                          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/70 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.isRead && (
                        <button 
                          className="text-white hover:text-green-300 transition-colors"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        className="text-white hover:text-red-300 transition-colors"
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Delete notification"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {!loading && !error && notifications.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-xl font-semibold mb-2">No notifications</p>
                <p className="text-sm">You're all caught up! No notifications to show.</p>
              </div>
            )}
          </div>
        </div>
      </FuturisticCard>
    </div>
  );
};

export default NotificationsPage;
