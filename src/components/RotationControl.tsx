import React, { useRef, useEffect } from 'react';

interface RotationControlProps {
  rotationSpeed: number;
  setRotationSpeed: (speed: number) => void;
}

const RotationControl: React.FC<RotationControlProps> = ({ rotationSpeed, setRotationSpeed }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (inputRef.current && e.buttons === 1) {
        const rect = inputRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const value = (x / rect.width) * 0.01;
        setRotationSpeed(Math.max(0, Math.min(0.01, value)));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setRotationSpeed]);

  return (
    <div className="absolute top-4 right-16 w-32 h-8 bg-opacity-80 rounded-bl-lg shadow-lg flex items-center px-2">
      {/* Range slider */}
      <input
        ref={inputRef}
        type="range"
        min="0"
        max="0.01"
        step="0.0001"
        value={rotationSpeed}
        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
        className="w-full appearance-none h-1 bg-white rounded-lg" // Made the height thinner with 'h-1'
        style={{
          accentColor: 'white' // Keeps the slider thumb and track in white
        }}
      />
    </div>
  );
};

export default RotationControl;
