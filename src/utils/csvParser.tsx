export interface DataPoint {
  [key: string]: string | number;
}

export const parseCSV = (csv: string): DataPoint[] => {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(header => header.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const dataPoint: DataPoint = {};

    headers.forEach((header, index) => {
      const value = values[index];
      dataPoint[header] = isNaN(Number(value)) ? value : Number(value);
    });

    return dataPoint;
  });
};

export const getNumericColumns = (data: DataPoint[]): string[] => {
  if (data.length === 0) return [];
  const firstDataPoint = data[0];
  return Object.keys(firstDataPoint).filter(key => typeof firstDataPoint[key] === 'number');
};