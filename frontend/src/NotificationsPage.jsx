import { useState } from 'react';
import SectionCard from './components/SectionCard';
import FuturisticButton from './components/FuturisticButton';
import { useNotifications } from './hooks/useNotifications';
import { useToast } from './hooks/useToast';
import SchedulerStatus from './components/Notifications/SchedulerStatus';
import NotificationControls from './components/Notifications/NotificationControls';
import NotificationItem from './components/Notifications/NotificationItem';
import ToastContainer from './components/Toast/ToastContainer';

const NotificationsPage = () => {
  const {
    notifications,
    loading,
    error,
    schedulerStatus,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    triggerScheduler,
    refreshNotifications,
  } = useNotifications();

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [isTriggering, setIsTriggering] = useState(false);

  // Handle scheduler trigger
  const handleTriggerScheduler = async () => {
    setIsTriggering(true);
    try {
      const result = await triggerScheduler();
      if (result.success) {
        showSuccess(`Scheduler triggered successfully! ${result.data.message}`);
      } else {
        showError(`Error triggering scheduler: ${result.error}`);
      }
    } catch (err) {
      showError(`Error triggering scheduler: ${err.message}`);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="space-y-6 mb-6">
        {/* Scheduler Status & Demo Controls */}
        <SectionCard title="Notification System">
        <div className="space-y-4">
          <SchedulerStatus schedulerStatus={schedulerStatus} />
          <NotificationControls
            onTriggerScheduler={handleTriggerScheduler}
            onRefresh={refreshNotifications}
            isTriggering={isTriggering}
            isLoading={loading}
          />
        </div>
      </SectionCard>

      {/* Main Notifications Card */}
      <SectionCard title="Notifications">
        {/* Mark All as Read Button */}
        {!loading && !error && notifications.some(n => !n.isRead) && (
          <div className="mb-4">
            <FuturisticButton
              variant="secondary"
              onClick={async () => {
                const result = await markAllAsRead();
                if (result.success) {
                  showSuccess(`Marked ${result.count} notifications as read`);
                } else {
                  showError(`Error: ${result.error}`);
                }
              }}
              className="w-full"
            >
              ✓ Mark All as Read
            </FuturisticButton>
          </div>
        )}

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
            <FuturisticButton
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </FuturisticButton>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && notifications.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-xl font-semibold mb-2">No notifications</p>
            <p className="text-sm">
              You're all caught up! No notifications to show.
            </p>
          </div>
        )}
      </SectionCard>
      </div>
    </>
  );
};

export default NotificationsPage;
