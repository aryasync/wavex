import FuturisticButton from './FuturisticButton';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-lg w-full mx-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">About WaveX</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-white/80">
          {/* Mission */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Mission</h3>
            <p className="text-sm leading-relaxed">
              Reduce food waste by helping you track your fridge contents and never miss 
              expiration dates again.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="text-white/60 mr-2">•</span>
                <span>AI-powered camera recognition for instant item detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-white/60 mr-2">•</span>
                <span>Smart expiration tracking with visual calendar</span>
              </li>
              <li className="flex items-start">
                <span className="text-white/60 mr-2">•</span>
                <span>Category-based filtering and organization</span>
              </li>
              <li className="flex items-start">
                <span className="text-white/60 mr-2">•</span>
                <span>Real-time notifications for expiring items</span>
              </li>             
            </ul>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Our Team</h3>
            <p className="text-sm leading-relaxed mb-2">
              Created by Arya, Ella, Mark, and Nidhi.
            </p>
            <p className="text-xs text-white/60">
              HelloHacks 2025
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Built With</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <p className="text-white/80 font-medium">Frontend:</p>
                <ul className="text-white/60 space-y-1">
                  <li>• React</li>
                  <li>• React Router</li>
                  <li>• Vite</li>
                  <li>• Tailwind CSS</li>
                  <li>• Lucide React</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="text-white/80 font-medium">Backend:</p>
                <ul className="text-white/60 space-y-1">
                  <li>• Node.js</li>
                  <li>• Express</li>
                  <li>• OpenAI API</li>
                  <li>• Sharp</li>
                  <li>• Node-cron</li>
                  <li>• CORS</li>
                  <li>• Dotenv</li>
                </ul>
              </div>
            </div>
              <div className="mt-3">
                <p className="text-white/80 font-medium text-sm mb-1">Design & Tools:</p>
                <p className="text-white/60 text-sm">Figma, ESLint, Multer, Nodemon</p>
              </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-center">
          <FuturisticButton
            variant="primary"
            onClick={onClose}
            className="px-8"
          >
            Close
          </FuturisticButton>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
