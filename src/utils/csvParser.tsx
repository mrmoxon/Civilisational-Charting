// utils/csvParser.ts

export interface NodeData {
  name: string;
  x: number;
  y: number;
  z: number;
  [key: string]: string | number;
}

export const parseCSV = (csv: string): NodeData[] => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const node: NodeData = {
      name: '',
      x: 0,
      y: 0,
      z: 0
    };

    headers.forEach((header, index) => {
      const value = values[index].trim();
      if (header === 'name') {
        node.name = value;
      } else if (['x', 'y', 'z'].includes(header)) {
        node[header] = parseFloat(value);
      } else {
        node[header] = isNaN(parseFloat(value)) ? value : parseFloat(value);
      }
    });

    return node;
  });
};