import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const navigate = useNavigate();
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Request back camera specifically
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        // Stop camera when image is selected
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const captureImage = () => {
    if (selectedImage) {
      // If we have a selected image, use that
      onCapture(selectedImage);
    } else if (videoRef.current && isStreaming) {
      // If we're using the camera, capture from video
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      onCapture(imageData);
    }
  };

  // Auto-start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(null); // Reset selected image when modal opens
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Hidden file input for image selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />
      
      {/* Camera viewfinder */}
      <div className="relative w-full h-full">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected from camera roll"
            className="w-full h-full object-cover"
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        )}
        
        {/* Top overlay with close button */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <div className="text-white text-lg font-semibold">
              {selectedImage ? 'Selected Image' : 'Camera'}
            </div>
            <div className="flex items-center space-x-4">
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    startCamera();
                  }}
                  className="text-white text-lg hover:text-gray-300"
                  title="Switch back to camera"
                >
                  📷
                </button>
              )}
              <button
                onClick={() => {
                  stopCamera();
                  navigate('/manual-input');
                }}
                className="text-white text-lg hover:text-gray-300"
                title="Manual input"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="text-white text-2xl hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Bottom overlay with controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-start items-center space-x-12 pl-16">
            {/* Gallery button */}
            <button 
              onClick={openImagePicker}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-lg">📁</span>
            </button>
            
            {/* Capture button */}
            <button 
              onClick={captureImage}
              className="w-16 h-16 bg-white rounded-full border-4 border-white/30 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Scan Instructions */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-white/40 text-lg font-medium">
            Please scan your receipt or groceries please
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
