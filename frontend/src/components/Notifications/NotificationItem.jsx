/**
 * Individual notification item component
 */
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
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

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering the read action
    onDelete(notification.id);
  };

  return (
    <div
      className={`flex items-center justify-between text-white p-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/20 ${
        notification.isRead ? 'bg-white/10' : 'bg-yellow-500/20'
      }`}
      onClick={handleClick}
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
      
      <div className="flex space-x-2">
        <button
          className="text-white hover:text-red-300 transition-colors p-1"
          onClick={handleDelete}
          title="Delete notification"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
