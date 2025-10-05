/**
 * Scheduler status display component
 */
const SchedulerStatus = ({ schedulerStatus }) => {
  if (!schedulerStatus) {
    return (
      <div className="bg-white/10 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Scheduler Status</h3>
        <div className="text-white/60">Loading scheduler status...</div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white/10 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-2">Scheduler Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-white/70">Status:</span>
          <span
            className={`ml-2 px-2 py-1 rounded text-xs ${
              schedulerStatus.isRunning
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}
          >
            {schedulerStatus.isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
        <div>
          <span className="text-white/70">Schedule:</span>
          <span className="ml-2 text-white">Daily 9:00 AM</span>
        </div>
        <div>
          <span className="text-white/70">Last Check:</span>
          <span className="ml-2 text-white">{formatDate(schedulerStatus.lastCheck)}</span>
        </div>
        <div>
          <span className="text-white/70">Next Check:</span>
          <span className="ml-2 text-white">{formatDate(schedulerStatus.nextCheck)}</span>
        </div>
      </div>
    </div>
  );
};

export default SchedulerStatus;
