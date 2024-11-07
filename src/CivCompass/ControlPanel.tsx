import React, { useState } from 'react';

export type ColorSchemeType = 'default' | 'pastel' | 'monochrome';

interface ControlPanelProps {
  showNodes: boolean;
  setShowNodes: (show: boolean) => void;
  colorScheme: ColorSchemeType;
  setColorScheme: (scheme: ColorSchemeType) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  showGridLines: boolean;
  setShowGridLines: (show: boolean) => void;
  showEdges: boolean;
  setShowEdges: (show: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  showNodes,
  setShowNodes,
  colorScheme,
  setColorScheme,
  backgroundColor,
  setBackgroundColor,
  showGridLines,
  setShowGridLines,
  showEdges,
  setShowEdges,
  isOpen,
  setIsOpen,
}) => {

  return (
    <div className={`absolute top-60 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 bg-gray-800 text-white px-2 py-16 rounded-l-lg shadow-lg"
      >
        {isOpen ? '>' : '<'}
      </button>
      <div className="bg-gray-800 bg-opacity-90 p-4 rounded-l-lg shadow-lg w-80 text-white">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Color Scheme
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as ColorSchemeType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="default">Classic</option>
              <option value="pastel">Clean</option>
              <option value="monochrome">Planes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Background Color
            </label>
            <select
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="#1a1a1a">Dark Gray</option>
              <option value="#4a4a4a">Medium Gray</option>
              <option value="#5C544E">Abyss Brown</option>
            </select>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showGridLines}
                onChange={(e) => setShowGridLines(e.target.checked)}
                className="mr-2 form-checkbox text-indigo-600 bg-gray-700 border-gray-600 rounded"
              />
              <span className="text-sm">Show Grid Lines</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showEdges}
                onChange={(e) => setShowEdges(e.target.checked)}
                className="mr-2 form-checkbox text-indigo-600 bg-gray-700 border-gray-600 rounded"
              />
              <span className="text-sm">Show Edges</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;