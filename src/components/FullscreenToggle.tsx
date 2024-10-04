import React from 'react';

interface FullscreenToggleProps {
  isFullViewport: boolean;
  toggleFullViewport: () => void;
}

const FullscreenToggle: React.FC<FullscreenToggleProps> = ({ isFullViewport, toggleFullViewport }) => {
  return (
    <button
      onClick={toggleFullViewport}
      className="fixed top-4 right-4 w-8 h-8 bg-transparent border-2 border-white rounded-sm z-50 focus:outline-none"
      aria-label={isFullViewport ? "Exit full viewport" : "Enter full viewport"}
    >
      {isFullViewport ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      )}
    </button>
  );
};

export default FullscreenToggle;