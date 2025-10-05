import { useState, useRef, useEffect } from 'react';

const CameraModal = ({ isOpen, onClose }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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

  // Auto-start camera when modal opens
  useEffect(() => {
    if (isOpen) {
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
      {/* Camera viewfinder */}
      <div className="relative w-full h-full">
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
        
        {/* Top overlay with close button */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <div className="text-white text-lg font-semibold">Camera</div>
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

        {/* Bottom overlay with controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-center items-center space-x-8">
            {/* Gallery button */}
            <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📷</span>
            </button>
            
            {/* Capture button */}
            <button className="w-16 h-16 bg-white rounded-full border-4 border-white/30 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full"></div>
            </button>
            
            {/* Flip camera button */}
            <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🔄</span>
            </button>
          </div>
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
