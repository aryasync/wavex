import { useState, useEffect } from 'react';

/**
 * Custom hook for managing notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedulerStatus, setSchedulerStatus] = useState(null);

  // Fetch notifications and scheduler status
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch notifications
      const notificationsResponse = await fetch('http://localhost:3001/api/notifications');
      if (!notificationsResponse.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const notificationsData = await notificationsResponse.json();
      setNotifications(notificationsData.data || []);

      // Fetch scheduler status
      const schedulerResponse = await fetch('http://localhost:3001/api/notifications/scheduler/status');
      if (schedulerResponse.ok) {
        const schedulerData = await schedulerResponse.json();
        setSchedulerStatus(schedulerData.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [notificationId] }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.filter(notification => notification.id !== notificationId)
        );
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      if (unreadNotifications.length === 0) return { success: true, count: 0 };

      // Update all unread notifications
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
      
      return { success: true, count: unreadNotifications.length };
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return { success: false, error: err.message };
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      if (notifications.length === 0) return { success: true, count: 0 };

      const allIds = notifications.map(n => n.id);
      const response = await fetch('http://localhost:3001/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: allIds }),
      });

      if (response.ok) {
        setNotifications([]);
        return { success: true, count: notifications.length };
      } else {
        throw new Error('Failed to delete all notifications');
      }
    } catch (err) {
      console.error('Error deleting all notifications:', err);
      return { success: false, error: err.message };
    }
  };

  // Trigger scheduler
  const triggerScheduler = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh notifications after trigger
        await fetchData();
        return { success: true, data };
      } else {
        throw new Error('Failed to trigger scheduler');
      }
    } catch (err) {
      console.error('Error triggering scheduler:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    notifications,
    loading,
    error,
    schedulerStatus,
    hasNotifications: notifications.some(n => !n.isRead),
    markAsRead,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications,
    triggerScheduler,
    refreshNotifications: fetchData,
  };
};