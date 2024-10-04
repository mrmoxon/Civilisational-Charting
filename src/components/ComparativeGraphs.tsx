import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

interface DataPoint {
  name: string;
  x: number;
  y: number;
  z: number;
}

const data: DataPoint[] = [
  { name: 'Singapore', x: 0.7, y: 0.8, z: 0.6 },
  { name: 'China', x: 0.4, y: 0.7, z: 0.3 },
  { name: 'Silicon Valley', x: 0.9, y: 0.6, z: 0.8 },
  { name: 'UAE', x: 0.8, y: 0.5, z: 0.7 },
  { name: 'USA', x: 0.7, y: 0.4, z: 0.9 },
  { name: 'Denmark', x: 0.5, y: 0.3, z: 0.8 },
  { name: 'Cuba', x: 0.2, y: 0.2, z: 0.1 },
  { name: 'New Zealand', x: 0.6, y: 0.2, z: 0.7 },
  { name: 'Switzerland', x: 0.8, y: 0.1, z: 0.9 },
];

const colors = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#800080', '#FFA500', '#A52A2A', '#FFC0CB', '#00FFFF'];

enum VisualizationType {
  XY,
  XZ,
  YZ
}

const ComparativeGraphs: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredGraph, setHoveredGraph] = useState<VisualizationType | null>(null);

  const springProps = useSpring({
    width: isExpanded ? '600px' : '500px',
    height: isExpanded ? '300px' : '200px',
  });

  const renderScatterPlot = (xKey: 'x' | 'y' | 'z', yKey: 'x' | 'y' | 'z', xLabel: string, yLabel: string, type: VisualizationType) => (
    <div
      onMouseEnter={() => setHoveredGraph(type)}
      onMouseLeave={() => setHoveredGraph(null)}
      style={{ 
        border: hoveredGraph === type ? '2px solid yellow' : 'none',
        transition: 'all 0.3s ease-in-out',
        transform: hoveredGraph === type ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <ScatterChart width={180} height={180} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type="number" dataKey={xKey} name={xLabel} />
        <YAxis type="number" dataKey={yKey} name={yLabel} />
        <ZAxis type="number" range={[60, 60]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </div>
  );

  return (
    <animated.div
      style={{
        ...springProps,
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        padding: '10px',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <h3 className="text-lg font-bold mb-2">Comparative Graphs</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        {renderScatterPlot('x', 'y', 'Individualist', 'Elitist', VisualizationType.XY)}
        {renderScatterPlot('x', 'z', 'Individualist', 'Abundance', VisualizationType.XZ)}
        {renderScatterPlot('y', 'z', 'Elitist', 'Abundance', VisualizationType.YZ)}
      </div>
    </animated.div>
  );
};

export default ComparativeGraphs;