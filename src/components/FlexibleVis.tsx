import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, Label } from 'recharts';
import { DataPoint, getNumericColumns } from '../utils/csvParser';

interface FlexibleVisProps {
  data: DataPoint[];
  width: number;
  height: number;
}

const FlexibleVis: React.FC<FlexibleVisProps> = ({ data, width, height }) => {
  const numericColumns = useMemo(() => getNumericColumns(data), [data]);
  const [xAxis, setXAxis] = useState(numericColumns[0] || '');
  const [yAxis, setYAxis] = useState(numericColumns[1] || '');
  const [zAxis, setZAxis] = useState(numericColumns[2] || '');

  const processedData = useMemo(() => {
    if (!xAxis || !yAxis) return [];

    const maxY = Math.max(...data.map(d => Number(d[yAxis])));
    return data.map(d => ({
      ...d,
      compressedY: Math.pow(Number(d[yAxis]) / maxY, 0.25) * maxY
    }));
  }, [data, xAxis, yAxis]);

  return (
    <div>
      <div>
        <label>X Axis: </label>
        <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
          {numericColumns.map(col => <option key={col} value={col}>{col}</option>)}
        </select>
        <label>Y Axis: </label>
        <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
          {numericColumns.map(col => <option key={col} value={col}>{col}</option>)}
        </select>
        <label>Z Axis (size): </label>
        <select value={zAxis} onChange={(e) => setZAxis(e.target.value)}>
          <option value="">None</option>
          {numericColumns.map(col => <option key={col} value={col}>{col}</option>)}
        </select>
      </div>
      <ScatterChart width={width} height={height} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type="number" dataKey={xAxis} name={xAxis}>
          <Label value={xAxis} offset={0} position="bottom" />
        </XAxis>
        <YAxis type="number" dataKey="compressedY" name={yAxis} scale="pow" domain={[0, 'dataMax']}>
          <Label value={`${yAxis} (compressed)`} angle={-90} position="left" style={{ textAnchor: 'middle' }} />
        </YAxis>
        {zAxis && <ZAxis type="number" dataKey={zAxis} range={[50, 400]} name={zAxis} />}
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Data Points" data={processedData} fill="#8884d8" />
      </ScatterChart>
    </div>
  );
};

export default FlexibleVis;