import { useState, useEffect } from 'react';

/**
 * Custom hook for managing notifications
 * Checks for unread notifications from backend
 */
export const useNotifications = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/notifications?isRead=false');
      if (response.ok) {
        const data = await response.json();
        setHasNotifications(data.count > 0);
        setError(null);
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error checking notifications:', err);
      setError(err.message);
      setHasNotifications(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkNotifications();
  }, []);

  return {
    hasNotifications,
    loading,
    error,
    refetch: checkNotifications
  };
};
