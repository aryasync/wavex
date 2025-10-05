import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ModalManager Hook
 * Manages all modals (About, Camera) and their state
 */
export const useModalManager = (onImageCapture) => {
  const navigate = useNavigate();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleWaveClick = () => {
    setIsAboutOpen(true);
  };

  const handleCameraClick = () => {
    setIsCameraOpen(true);
  };

  const handleImageCapture = (imageData) => {
    setIsCameraOpen(false);
    if (onImageCapture) {
      onImageCapture(imageData);
    } else {
      navigate('/image-confirmation', { state: { imageData } });
    }
  };

  return {
    // Modal states
    isAboutOpen,
    isCameraOpen,
    
    // Modal actions
    handleWaveClick,
    handleCameraClick,
    handleImageCapture,
    
    // Modal close handlers
    closeAbout: () => setIsAboutOpen(false),
    closeCamera: () => setIsCameraOpen(false)
  };
};
