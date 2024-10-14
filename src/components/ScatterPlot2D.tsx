import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceLine } from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: number | string;
}

interface ScatterPlot2DProps {
  data: DataPoint[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
}

const colors = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#800080', '#FFA500', '#A52A2A', '#FFC0CB', '#00FFFF'];

const ScatterPlot2D: React.FC<ScatterPlot2DProps> = ({ data, xKey, yKey, xLabel, yLabel }) => {
  return (
    <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <XAxis type="number" dataKey={xKey} name={xLabel} domain={[-1, 1]} />
      <YAxis type="number" dataKey={yKey} name={yLabel} domain={[-1, 1]} />
      <ZAxis type="number" range={[60, 60]} />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <ReferenceLine x={0} stroke="gray" />
      <ReferenceLine y={0} stroke="gray" />
      <Scatter data={data} fill="#8884d8">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Scatter>
    </ScatterChart>
  );
};

export default ScatterPlot2D;