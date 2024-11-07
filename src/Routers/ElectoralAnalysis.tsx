// import React, { useState, useCallback } from 'react';
// import { Canvas } from '@react-three/fiber';
// import ControlPanel, { ColorSchemeType } from '../CivCompass/ControlPanel';
// import RotationControl from '../CivCompass/RotationControl';
// import RealMachinesLogo from '../CivCompass/RealMachines';
// import DetailedMetrics from '../CivCompass/DetailedMetrics';
// import VotingMarginsChart from '../Electoral/VotingMarginsChart';

// const ElectoralAnalysis: React.FC = () => {
//     const [rotationSpeed, setRotationSpeed] = useState(0.0005);
//     const [showNodes, setShowNodes] = useState(true);
//     const [colorScheme, setColorScheme] = useState<ColorSchemeType>('default');
//     const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
//     const [showGridLines, setShowGridLines] = useState(true);
//     const [showEdges, setShowEdges] = useState(true);
//     const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
//     const [hoveredState, setHoveredState] = useState<string | null>(null);
//     const [selectedState, setSelectedState] = useState<string | null>(null);
  
//     const handleRotationSpeedChange = useCallback((speed: number) => {
//       setRotationSpeed(speed);
//     }, []);
  
//     const handleStateHover = useCallback((state: string | null) => {
//       setHoveredState(state);
//     }, []);
  
//     const handleStateClick = useCallback((state: string) => {
//       setSelectedState(state);
//     }, []);
  
//     const handleCloseDetailedMetrics = useCallback(() => {
//       setSelectedState(null);
//     }, []);
  
//     return (
//         <div className="w-screen h-screen" style={{ backgroundColor }}>
//           <div className="absolute top-5 left-5 z-10 text-white">
//             <h1 className="text-4xl md:text-6xl font-bold mb-2">US Electoral Analysis</h1>
//             <p className="text-xl md:text-2xl">Voting Patterns 2000-2024</p>
//           </div>
    
//           <div className="w-full h-full">
//             <Canvas 
//               camera={{ 
//                 position: [0, 0, 12],
//                 fov: 60,
//                 near: 0.1,
//                 far: 1000
//               }}
//             >
//               <ambientLight intensity={0.5} />
//               <VotingMarginsChart
//                 rotationSpeed={rotationSpeed}
//                 setRotationSpeed={setRotationSpeed}
//                 colorScheme={colorScheme}
//                 showGridLines={showGridLines}
//                 showEdges={showEdges}
//                 onStateHover={handleStateHover}
//                 onStateClick={handleStateClick}
//               />
//             </Canvas>
//           </div>
    
//           <RotationControl
//             rotationSpeed={rotationSpeed}
//             setRotationSpeed={handleRotationSpeedChange}
//           />
          
//           <ControlPanel
//             showNodes={showNodes}
//             setShowNodes={setShowNodes}
//             colorScheme={colorScheme}
//             setColorScheme={setColorScheme}
//             backgroundColor={backgroundColor}
//             setBackgroundColor={setBackgroundColor}
//             showGridLines={showGridLines}
//             setShowGridLines={setShowGridLines}
//             showEdges={showEdges}
//             setShowEdges={setShowEdges}
//             isOpen={isControlPanelOpen}
//             setIsOpen={setIsControlPanelOpen}
//           />
    
//           <RealMachinesLogo isControlPanelOpen={isControlPanelOpen} />
    
//           <DetailedMetrics
//             hoveredNode={hoveredState}
//             selectedNode={selectedState}
//             nodeData={{}}
//             onClose={handleCloseDetailedMetrics}
//           />
//         </div>
//       );
//     };
    
// export default ElectoralAnalysis;

import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import ControlPanel, { ColorSchemeType } from '../CivCompass/ControlPanel';
import RotationControl from '../CivCompass/RotationControl';
import RealMachinesLogo from '../CivCompass/RealMachines';
import DetailedMetrics from '../CivCompass/DetailedMetrics';
import VotingMarginsChart from '../Electoral/VotingMarginsChart';
// import votingData from '../Electoral/votingData';
import { votingData } from '../Electoral/votingData';
import { VotingData } from '../types';

interface StateData {
  margins: number[];
}

const ElectoralAnalysis: React.FC = () => {
  const [rotationSpeed, setRotationSpeed] = useState(0.0002);
  const [showNodes, setShowNodes] = useState(true);
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>('default');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [showGridLines, setShowGridLines] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Create formatted state data for DetailedMetrics
  const stateData = useMemo(() => {
    const data: Record<string, StateData> = {};
    Object.entries(votingData as VotingData).forEach(([state, margins]) => {
      data[state] = {
        margins: margins as number[],
      };
    });
    return data;
  }, []);

  const handleRotationSpeedChange = useCallback((speed: number) => {
    setRotationSpeed(speed);
  }, []);

  const handleStateHover = useCallback((state: string | null) => {
    setHoveredState(state);
  }, []);

  const handleStateClick = useCallback((state: string) => {
    setSelectedState(state);
  }, []);

  const handleCloseDetailedMetrics = useCallback(() => {
    setSelectedState(null);
  }, []);

  return (
    <div className="w-screen h-screen" style={{ backgroundColor }}>
      <div className="absolute top-5 left-5 z-10 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">US Electoral Analysis</h1>
        <p className="text-xl md:text-2xl">Voting Patterns 2000-2024</p>
      </div>

      <div className="w-full h-full">
        <Canvas 
          camera={{ 
            position: [0, 0, 12],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
        >
          <ambientLight intensity={0.5} />
          <VotingMarginsChart
            rotationSpeed={rotationSpeed}
            setRotationSpeed={setRotationSpeed}
            colorScheme={colorScheme}
            showGridLines={showGridLines}
            showEdges={showEdges}
            onStateHover={handleStateHover}
            onStateClick={handleStateClick}
          />
        </Canvas>
      </div>

      <RotationControl
        rotationSpeed={rotationSpeed}
        setRotationSpeed={handleRotationSpeedChange}
      />
      
      <ControlPanel
        showNodes={showNodes}
        setShowNodes={setShowNodes}
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        showGridLines={showGridLines}
        setShowGridLines={setShowGridLines}
        showEdges={showEdges}
        setShowEdges={setShowEdges}
        isOpen={isControlPanelOpen}
        setIsOpen={setIsControlPanelOpen}
      />

      <RealMachinesLogo isControlPanelOpen={isControlPanelOpen} />

      <DetailedMetrics
        hoveredNode={hoveredState}
        selectedNode={selectedState}
        nodeData={stateData}
        onClose={handleCloseDetailedMetrics}
      />
    </div>
  );
};

export default ElectoralAnalysis;