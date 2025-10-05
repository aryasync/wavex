import Toast from './Toast';

/**
 * Container component for managing multiple toast notifications
 */
const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-2 left-2 sm:right-4 sm:left-auto z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
