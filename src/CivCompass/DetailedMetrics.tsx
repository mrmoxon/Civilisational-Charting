// import React, { useState, useEffect } from 'react';

// interface DetailedMetricsProps {
//   hoveredNode: string | null;
//   selectedNode: string | null;
//   nodeData: { [key: string]: any };
//   onClose: () => void;
// }

// const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ hoveredNode, selectedNode, nodeData, onClose }) => {
//   const [displayNode, setDisplayNode] = useState<string | null>(null);

//   useEffect(() => {
//     if (selectedNode) {
//       setDisplayNode(selectedNode);
//     } else if (hoveredNode) {
//       setDisplayNode(hoveredNode);
//     } else {
//       setDisplayNode(null);
//     }
//   }, [hoveredNode, selectedNode]);

//   if (!displayNode) return null;

//   const data = nodeData[displayNode];

//   return (
//     <div className="absolute bottom-4 left-4 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 50, 0.7)' }}>
//       <h3 className="text-xl font-bold mb-2 text-white">{displayNode}</h3>
//       <ul className="space-y-1">
//         {Object.entries(data).map(([key, value]) => (
//           <li key={key} className="text-sm text-gray-200">
//             <span className="font-semibold">{key}:</span> {value}
//           </li>
//         ))}
//       </ul>
//       {selectedNode && (
//         <button
//           onClick={onClose}
//           className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
//         >
//           Close
//         </button>
//       )}
//     </div>
//   );
// };

// export default DetailedMetrics;

import React, { useState, useEffect } from 'react';

interface StateData {
  margins: number[];
  totalVotes?: number;
  demographics?: {
    [key: string]: number;
  };
}

interface DetailedMetricsProps {
  hoveredNode: string | null;
  selectedNode: string | null;
  nodeData: Record<string, StateData>;
  onClose: () => void;
}

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ 
  hoveredNode, 
  selectedNode, 
  nodeData, 
  onClose 
}) => {
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

  if (!displayNode || !nodeData[displayNode]) return null;

  const data = nodeData[displayNode];
  const years = ['2000', '2004', '2008', '2012', '2016', '2020', '2024'];

  return (
    <div className="absolute bottom-4 left-4 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 50, 0.7)' }}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white">{displayNode}</h3>
        {selectedNode && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-200">
          <span className="font-semibold">Voting Margins:</span>
          <ul className="mt-1 space-y-1">
            {data.margins.map((margin, index) => (
              <li key={index}>
                {years[index]}: {margin.toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
        {data.totalVotes && (
          <div className="text-sm text-gray-200">
            <span className="font-semibold">Total Votes:</span> {data.totalVotes.toLocaleString()}
          </div>
        )}
        {data.demographics && (
          <div className="text-sm text-gray-200">
            <span className="font-semibold">Demographics:</span>
            <ul className="mt-1 space-y-1">
              {Object.entries(data.demographics).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedMetrics;