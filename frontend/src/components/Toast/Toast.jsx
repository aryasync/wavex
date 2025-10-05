import { useEffect, useState } from 'react';

/**
 * Individual toast notification component
 */
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 text-white';
      case 'error':
        return 'bg-red-500/90 text-white';
      case 'warning':
        return 'bg-yellow-500/90 text-black';
      case 'info':
        return 'bg-blue-500/90 text-white';
      default:
        return 'bg-gray-500/90 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-2 left-2 sm:right-4 sm:left-auto sm:max-w-sm z-50 w-auto
        ${getTypeStyles()}
        rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg font-bold">{getIcon()}</span>
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/70 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
