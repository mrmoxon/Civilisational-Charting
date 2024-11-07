import React from 'react';

interface RealMachinesLogoProps {
  isControlPanelOpen: boolean;
}

const RealMachinesLogo: React.FC<RealMachinesLogoProps> = ({ isControlPanelOpen }) => {
  return (
    <div className={`fixed top-16 right-4 text-2xl font-bold transition-opacity duration-300 ${isControlPanelOpen ? 'opacity-0' : 'opacity-100'}`} style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="flex items-start">
        <div className="text-white flex">
          <span className="transform skew-x-[-15deg]">R</span>
          <span className="transform skew-x-[-10deg]">E</span>
          <span className="transform skew-x-[-5deg]">A</span>
          <span>L</span>
        </div>
        <div className="text-gray-400 flex flex-col items-start ml-0.5">
          <div style={{
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(to bottom right, #a0a0a0, #a0a0a0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            M
          </div>
          <div className="-mt-2 ml-0.5" style={{
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            letterSpacing: '-0.22em',
            lineHeight: '0.8em'
          }}>
            ACHINES
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealMachinesLogo;