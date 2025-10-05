import { useState } from 'react';
import FuturisticButton from './FuturisticButton';

/**
 * Reusable confirmation modal component
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">
            {title}
          </h3>
          <p className="text-white/80 text-sm">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <FuturisticButton
            variant="secondary"
            onClick={onClose}
            disabled={isConfirming || isLoading}
            className="flex-1"
          >
            {cancelText}
          </FuturisticButton>
          <FuturisticButton
            variant={variant}
            onClick={handleConfirm}
            disabled={isConfirming || isLoading}
            className="flex-1"
          >
            {isConfirming || isLoading ? "Processing..." : confirmText}
          </FuturisticButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
