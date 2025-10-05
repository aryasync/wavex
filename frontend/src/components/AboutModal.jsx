import { useState } from "react";

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a3636] rounded-lg p-6 max-w-md w-full mx-4 border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white font-['Orbitron']">About Tsunami Fridge</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-white/80">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">🌊 WaveX Design</h3>
            <p className="text-sm leading-relaxed">
              Tsunami Fridge Tracker features a modern WaveX-inspired interface designed for 
              seamless inventory management and expiration tracking.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">📱 Features</h3>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Multi-category filtering</li>
              <li>• Camera-based item recognition</li>
              <li>• Expiration date tracking</li>
              <li>• Calendar integration</li>
              <li>• Real-time notifications</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">🎯 Mission</h3>
            <p className="text-sm leading-relaxed">
              Reduce food waste by helping you track your fridge contents and never miss 
              expiration dates again.
            </p>
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-white/60 text-center">
              Built with React, Tailwind CSS, and WaveX design principles
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
