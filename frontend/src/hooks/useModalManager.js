import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsApi } from '../utils/api.util';

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

  const handleImageCapture = async (imageData) => {
    setIsCameraOpen(false);
    
    if (onImageCapture) {
      onImageCapture(imageData);
    } else {
      // New flow: Send image directly to AI analysis
      try {
        // Navigate to new items confirmation page with loading state
        navigate('/new-items-confirmation', { 
          state: { 
            isAnalyzing: true,
            imageData: imageData 
          } 
        });
        
        // Send image to AI analysis
        const result = await itemsApi.analyzeImage(imageData);
        console.log('AI analysis result:', result);
        
        // Navigate to the same page with the AI result
        navigate('/new-items-confirmation', { 
          state: { 
            aiAnalysisResult: result,
            isAnalyzing: false 
          } 
        });
        
      } catch (error) {
        console.error('Error analyzing image:', error);
        // Navigate to error state
        navigate('/new-items-confirmation', { 
          state: { 
            analysisError: error.message,
            isAnalyzing: false 
          } 
        });
      }
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
