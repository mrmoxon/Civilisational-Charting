import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  x: number;
  y: number;
  z: number;
}

interface ScatterPlot2DProps {
  data: DataPoint[];
  xKey: 'x' | 'y' | 'z';
  yKey: 'x' | 'y' | 'z';
  xLabel: string;
  yLabel: string;
}

const ScatterPlot2D: React.FC<ScatterPlot2DProps> = ({ data, xKey, yKey, xLabel, yLabel }) => {
  return (
    <ResponsiveContainer width="80%" height="80%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type="number" dataKey={xKey} name={xLabel} />
        <YAxis type="number" dataKey={yKey} name={yLabel} />
        <ZAxis type="number" range={[60, 60]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 50%)`} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlot2D;