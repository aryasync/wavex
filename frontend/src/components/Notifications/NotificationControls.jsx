import FuturisticButton from '../FuturisticButton';

/**
 * Notification controls component
 */
const NotificationControls = ({ 
  onTriggerScheduler, 
  onRefresh, 
  isTriggering, 
  isLoading 
}) => {
  return (
    <div className="space-y-4">
      {/* Demo Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <FuturisticButton
          variant="primary"
          onClick={onTriggerScheduler}
          disabled={isTriggering}
          className="flex-1"
        >
          {isTriggering ? 'Triggering...' : 'Trigger Scheduler Demo'}
        </FuturisticButton>

        <FuturisticButton
          variant="secondary"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Notifications'}
        </FuturisticButton>
      </div>
    </div>
  );
};

export default NotificationControls;
