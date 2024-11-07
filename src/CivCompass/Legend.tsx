import React from 'react';

const Legend = () => {
  return (
    <div className="absolute bottom-5 right-5 bg-white bg-opacity-80 p-4 rounded shadow-lg">
      <h3 className="text-lg font-bold mb-2">Legend</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>Scarcity-Abundance</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>Elitist-Egalitarian</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-2"></div>
          <span>Altruistic-Individualist</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
          <span>Example Node</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;