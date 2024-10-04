import React, { useState, useEffect } from 'react';

interface DetailedMetricsProps {
  hoveredNode: string | null;
  selectedNode: string | null;
  nodeData: { [key: string]: any };
  onClose: () => void;
}

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ hoveredNode, selectedNode, nodeData, onClose }) => {
  const [displayNode, setDisplayNode] = useState<string | null>(null);

  useEffect(() => {
    if (selectedNode) {
      setDisplayNode(selectedNode);
    } else if (hoveredNode) {
      setDisplayNode(hoveredNode);
    } else {
      setDisplayNode(null);
    }
  }, [hoveredNode, selectedNode]);

  if (!displayNode) return null;

  const data = nodeData[displayNode];

  return (
    <div className="absolute bottom-4 left-4 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 50, 0.7)' }}>
      <h3 className="text-xl font-bold mb-2 text-white">{displayNode}</h3>
      <ul className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="text-sm text-gray-200">
            <span className="font-semibold">{key}:</span> {value}
          </li>
        ))}
      </ul>
      {selectedNode && (
        <button
          onClick={onClose}
          className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Close
        </button>
      )}
    </div>
  );
};

export default DetailedMetrics;