import { useState } from 'react';

/**
 * Individual notification item component
 */
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const getIcon = (type) => {
    switch (type) {
      case 'item_expiry_warning':
        return '⚠️';
      case 'item_expired':
        return '🚨';
      case 'added_items':
        return '📢';
      default:
        return '📢';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation(); // Prevent triggering the delete hover
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering the read action
    setIsDeleting(true);
    
    // Wait for fade-out animation to complete before actually deleting
    setTimeout(() => {
      onDelete(notification.id);
    }, 300); // Wait for 300ms fade-out animation
  };

  return (
    <div
      className={`relative group flex items-center justify-between text-white p-4 rounded-lg transition-all duration-300 hover:bg-white/20 ${
        notification.isRead ? 'bg-white/10' : 'bg-yellow-500/20'
      } ${
        isDeleting ? 'opacity-0 scale-95 transform -translate-y-2 transition-all duration-300 ease-out' : 'opacity-100 scale-100 transform translate-y-0 transition-all duration-300 ease-out'
      }`}
      tabIndex={0}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getIcon(notification.type)}</span>
          <span className="font-semibold">{notification.message}</span>
          {/* {!notification.isRead && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
              NEW
            </span>
          )} */}
        </div>
        <div className="text-sm text-white/70 mt-1">
          {formatDate(notification.createdAt)}
        </div>
      </div>
      
      {/* Read icon - only show if notification is unread */}
      {!notification.isRead && (
        <button
          onClick={handleMarkAsRead}
          className="text-white/70 hover:text-green-300 transition-colors p-1"
          title="Mark as read"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </button>
      )}

      {/* Delete button - only show on hover/focus */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none">
        <button
          onClick={handleDelete}
          className="bg-red-500/80 hover:bg-red-500 text-white rounded-full px-3 py-2 transition-colors duration-200 shadow-lg pointer-events-auto flex items-center space-x-1"
          disabled={isDeleting}
          title="Delete notification"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
