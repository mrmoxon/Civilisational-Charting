import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import MetricVisualisation from '../components/MetricVisualisation';
import ComparativeGraphs from '../components/ComparativeGraphs';
import ScatterPlot2D from '../components/ScatterPlot2D';
import ScatterPlot3D from '../components/ScatterPlot3D';
import ControlPanel from '../components/ControlPanel';
import RotationControl from '../components/RotationControl';
import FullscreenToggle from '../components/FullscreenToggle';
import RealMachinesLogo from '../components/RealMachines';
import DetailedMetrics from '../components/DetailedMetrics';
import { parseCSV, DataPoint } from '../utils/csvParser';
import SinglePlaneVis from '../components/SinglePlaneVis';
import FlexibleVis from '../components/FlexibleVis';

enum VisualizationType {
  Main3D,
  XY2D,
  XZ2D,
  YZ2D,
  XW2D,
  Custom2D
}

const CivilisationCompass: React.FC = () => {
  const [rotationSpeed, setRotationSpeed] = useState(0.001);
  const [showNodes, setShowNodes] = useState(true);
  const [colorScheme, setColorScheme] = useState('default');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [showGridLines, setShowGridLines] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [interactionRadius, setInteractionRadius] = useState(0.5);
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(VisualizationType.Main3D);
  const [hoveredVisualization, setHoveredVisualization] = useState<VisualizationType>(VisualizationType.Main3D);
  const [data, setData] = useState<DataPoint[]>([]);
  const [csvFile, setCsvFile] = useState<string>('/civcountries.csv');

  useEffect(() => {
    fetch(csvFile)
      .then(response => response.text())
      .then(csv => {
        const parsedData = parseCSV(csv);
        setData(parsedData);
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }, [csvFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsedData = parseCSV(content);
        setData(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handleRotationSpeedChange = useCallback((speed: number) => {
    setRotationSpeed(speed);
  }, []);

  const handleNodeHover = useCallback((name: string | null) => {
    setHoveredNode(name);
  }, []);

  const handleNodeClick = useCallback((name: string) => {
    setSelectedNode(name);
  }, []);

  const handleCloseDetailedMetrics = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleVisualizationHover = (type: VisualizationType) => {
    setHoveredVisualization(type);
  };

  const handleVisualizationClick = (type: VisualizationType) => {
    setActiveVisualization(type);
  };

  useEffect(() => {
    // Load CSV data
    fetch('/node_data.csv')
      .then(response => response.text())
      .then(csv => {
        const parsedNodes = parseCSV(csv);
        setNodes(parsedNodes);
      });
  }, []);

  const renderVisualization = () => {
    switch (activeVisualization) {
      case VisualizationType.Main3D:
        return (
          <Canvas camera={{ position: [7, 7, 7] }}>
            <ambientLight intensity={0.5} />
            <MetricVisualisation 
              rotationSpeed={rotationSpeed} 
              setRotationSpeed={handleRotationSpeedChange}
              colorScheme={colorScheme}
              showGridLines={showGridLines}
              showEdges={showEdges}
              nodes={nodes}
              onNodeHover={handleNodeHover}
              onNodeClick={handleNodeClick}
              interactionRadius={interactionRadius}
            />
          </Canvas>
        );
      case VisualizationType.XY2D:
        return (
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <SinglePlaneVis
              rotationSpeed={rotationSpeed}
              colorScheme={colorScheme}
              showGridLines={showGridLines}
              nodes={nodes.map(node => ({ name: node.name, x: node.x, y: node.y }))}
              onNodeHover={handleNodeHover}
              onNodeClick={handleNodeClick}
              interactionRadius={interactionRadius}
              xAxisLabel="Individualist"
              yAxisLabel="Elitist"
            />
          </Canvas>
        );
      case VisualizationType.XZ2D:
        return (
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <SinglePlaneVis
              rotationSpeed={rotationSpeed}
              colorScheme={colorScheme}
              showGridLines={showGridLines}
              nodes={nodes.map(node => ({ name: node.name, x: node.x, y: node.z }))}
              onNodeHover={handleNodeHover}
              onNodeClick={handleNodeClick}
              interactionRadius={interactionRadius}
              xAxisLabel="Individualist"
              yAxisLabel="Abundance"
            />
          </Canvas>
        );
      case VisualizationType.YZ2D:
        return (
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <SinglePlaneVis
              rotationSpeed={rotationSpeed}
              colorScheme={colorScheme}
              showGridLines={showGridLines}
              nodes={nodes.map(node => ({ name: node.name, x: node.y, y: node.z }))}
              onNodeHover={handleNodeHover}
              onNodeClick={handleNodeClick}
              interactionRadius={interactionRadius}
              xAxisLabel="Elitist"
              yAxisLabel="Abundance"
            />
          </Canvas>
        );
    }
  };

  return (
    <div className="w-screen h-screen" style={{ backgroundColor }}>
      <div className="absolute top-5 left-5 z-10 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">Civilisation Compass</h1>
        <p className="text-xl md:text-2xl">Quantifying Society's Progress</p>
      </div>
      {/* {renderVisualization(hoveredVisualization || activeVisualization)} */}
      <div className="w-full h-full" style={{ backgroundColor: activeVisualization === VisualizationType.Main3D ? '#1a1a1a' : 'transparent' }}>
        {/* {renderVisualization(hoveredVisualization || activeVisualization)} */}
        {renderVisualization()}
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
      <ComparativeGraphs 
        onGraphHover={handleVisualizationHover}
        onGraphClick={handleVisualizationClick}
        activeVisualization={activeVisualization}
      />
      <RealMachinesLogo isControlPanelOpen={isControlPanelOpen} />
      <DetailedMetrics
        hoveredNode={hoveredNode}
        selectedNode={selectedNode}
        nodeData={nodes.reduce((acc, node) => ({ ...acc, [node.name]: node }), {})}
        onClose={handleCloseDetailedMetrics}
      />
    </div>
  );
};

export default CivilisationCompass;