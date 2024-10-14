import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import * as d3 from 'd3';

interface DataPoint {
  name: string;
  x: number;
  y: number;
  z: number;
  w: number;
}

interface ComparativeGraphsProps {
  onGraphHover: (type: VisualizationType) => void;
  onGraphClick: (type: VisualizationType) => void;
  activeVisualization: VisualizationType;
}

enum VisualizationType {
  Main3D,
  XY2D,
  XZ2D,
  YZ2D,
  XW2D,
  Custom2D
}

const data: DataPoint[] = [
  { name: 'Singapore', x: 0.7, y: 0.8, z: 0.6, w: 0.5 },
  { name: 'China', x: 0.4, y: 0.7, z: 0.3, w: 0.6 },
  { name: 'Silicon Valley', x: 0.9, y: 0.6, z: 0.8, w: 0.7 },
  { name: 'UAE', x: 0.8, y: 0.5, z: 0.7, w: 0.4 },
  { name: 'USA', x: 0.7, y: 0.4, z: 0.9, w: 0.8 },
  { name: 'Denmark', x: 0.5, y: 0.3, z: 0.8, w: 0.9 },
  { name: 'Cuba', x: 0.2, y: 0.2, z: 0.1, w: 0.3 },
  { name: 'New Zealand', x: 0.6, y: 0.2, z: 0.7, w: 0.7 },
  { name: 'Switzerland', x: 0.8, y: 0.1, z: 0.9, w: 0.6 },
];

const colors = d3.schemeCategory10;

const allVisualizations = [
  VisualizationType.Main3D,
  VisualizationType.XY2D,
  VisualizationType.XZ2D,
  VisualizationType.YZ2D,
  VisualizationType.XW2D,
  VisualizationType.Custom2D
];

const ComparativeGraphs: React.FC<ComparativeGraphsProps> = ({ onGraphHover, onGraphClick, activeVisualization }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleVisualizations, setVisibleVisualizations] = useState<VisualizationType[]>(
    allVisualizations.filter(v => v !== activeVisualization).slice(0, 4)
  );

  const springProps = useSpring({
    width: isExpanded ? '440px' : '220px',
    height: isExpanded ? '440px' : '220px',
    right: '20px',
    bottom: '20px',
  });

  useEffect(() => {
    setVisibleVisualizations(prev => {
      const newVis = allVisualizations.filter(v => v !== activeVisualization && !prev.includes(v));
      return [...prev.filter(v => v !== activeVisualization), ...newVis].slice(0, 4);
    });
  }, [activeVisualization]);

  const handleGraphClick = (clickedVisualization: VisualizationType) => {
    if (clickedVisualization === activeVisualization) return;
    onGraphClick(clickedVisualization);
  };

  const createGraph = (svgRef: SVGSVGElement, xKey: 'x' | 'y' | 'z' | 'w', yKey: 'x' | 'y' | 'z' | 'w', xLabel: string, yLabel: string, svgSize: number) => {
    const margin = { top: 25, right: 25, bottom: 25, left: 25 };
    const width = svgSize - margin.left - margin.right;
    const height = svgSize - margin.top - margin.bottom;

    const svg = d3.select(svgRef)
      .attr('width', svgSize)
      .attr('height', svgSize)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    // Add white background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white');

    // Create centered axes
    svg.append('line')
      .attr('x1', 0).attr('y1', height / 2)
      .attr('x2', width).attr('y2', height / 2)
      .attr('stroke', 'black').attr('stroke-width', 1);

    svg.append('line')
      .attr('x1', width / 2).attr('y1', 0)
      .attr('x2', width / 2).attr('y2', height)
      .attr('stroke', 'black').attr('stroke-width', 1);

    // Add border
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Add data points
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d[xKey]))
      .attr('cy', d => y(d[yKey]))
      .attr('r', 3)
      .style('fill', (_, i) => colors[i]);

    // Function to add axis labels
    const addAxisLabel = (text: string, x: number, y: number, rotate: boolean = false) => {
      const label = svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text(text);

      if (rotate) {
        label.attr('transform', `rotate(-90, ${x}, ${y})`);
      }
    };

    // Function to get the opposite label
    const getOppositeLabel = (label: string): string => {
      switch (label.toLowerCase()) {
        case 'abundance': return 'Scarcity';
        case 'individualist': return 'Altruistic';
        case 'elitist': return 'Egalitarian';
        default: return label;
      }
    };

    // Add axis labels on all four sides
    addAxisLabel(xLabel, width / 2, height + margin.bottom - 5);
    addAxisLabel(getOppositeLabel(xLabel), width / 2, -5);
    addAxisLabel(yLabel, -margin.left + 15, height / 2, true);
    addAxisLabel(getOppositeLabel(yLabel), width + margin.right - 15, height / 2, true);
  };

  const create3DPreview = (svgRef: SVGSVGElement) => {
    const width = 175;
    const height = 175;
    const margin = { top: 20, right: 10, bottom: 10, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 1.5]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);
    const z = d3.scaleLinear().domain([0, 1]).range([0, innerWidth / 4]);

    // Add white background
    svg.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'white');

    // Function to draw a grid line
    const drawGridLine = (x1: number, y1: number, x2: number, y2: number) => {
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'gray')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2,2');
    };

    // Draw grid lines
    for (let i = 0; i <= 4; i++) {
      const pos = i * (innerWidth / 4);
      // Horizontal lines
      drawGridLine(0, pos, innerWidth, pos);
      drawGridLine(0, innerHeight - pos, innerWidth, innerHeight - pos);
      // Vertical lines
      drawGridLine(pos, 0, pos, innerHeight);
      drawGridLine(innerWidth - pos, 0, innerWidth - pos, innerHeight);
    }

    // Draw perspective lines
    const drawPerspectiveLine = (x: number, y: number) => {
      svg.append('line')
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', innerWidth / 3)
        .attr('y2', innerHeight / 1.5)
        .attr('stroke', 'grey')
        .attr('stroke-width', 2)
        // .attr('stroke-dasharray', '2,2');
    };

    // Draw perspective lines from corners and midpoints
    drawPerspectiveLine(0, 0);
    drawPerspectiveLine(innerWidth, 0);
    drawPerspectiveLine(0, innerHeight);
    drawPerspectiveLine(innerWidth, innerHeight);
    drawPerspectiveLine(innerWidth / 2, 0);
    drawPerspectiveLine(innerWidth / 2, innerHeight);
    drawPerspectiveLine(0, innerHeight / 2);
    drawPerspectiveLine(innerWidth, innerHeight / 2);

    // Draw main axes
    const drawAxis = (x1: number, y1: number, x2: number, y2: number) => {
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    };

    drawAxis(0, innerHeight, innerWidth, innerHeight); // x-axis
    drawAxis(0, innerHeight, 0, 0); // y-axis
    drawAxis(innerWidth, innerHeight, innerWidth, 0); // z-axis

    // Add data points
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x) + z(d.z) / 2)
      .attr('cy', d => y(d.y) - z(d.z) / 2)
      .attr('r', 2.5)
      .style('fill', (_, i) => colors[i]);

    // Add border
    svg.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  };

  const renderGraph = (visualizationType: VisualizationType, size: 'small' | 'large' = 'small') => {
    const graphProps = {
      onMouseEnter: () => onGraphHover(visualizationType),
      onMouseLeave: () => onGraphHover(activeVisualization),
      onClick: () => handleGraphClick(visualizationType),
      style: {
        cursor: 'pointer',
        opacity: activeVisualization === visualizationType ? 1 : 0.7,
        backgroundColor: activeVisualization === visualizationType ? '#e6e1d8' : '#f0ebe5',
        padding: '0px',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
        width: size === 'large' ? '400px' : '200px',
        height: size === 'large' ? '400px' : '200px',
      },
    };

    const svgSize = size === 'large' ? 200 : 200;

    switch (visualizationType) {
      case VisualizationType.Main3D:
        return (
          <div {...graphProps}>
            <svg ref={svgRef => svgRef && create3DPreview(svgRef, svgSize)} />
          </div>
        );
      case VisualizationType.XY2D:
        return (
          <div {...graphProps}>
            <svg ref={svgRef => svgRef && createGraph(svgRef, 'x', 'y', 'Individualist', 'Elitist', svgSize)} />
          </div>
        );
      case VisualizationType.XZ2D:
        return (
          <div {...graphProps}>
            <svg ref={svgRef => svgRef && createGraph(svgRef, 'x', 'z', 'Individualist', 'Abundance', svgSize)} />
          </div>
        );
      case VisualizationType.YZ2D:
        return (
          <div {...graphProps}>
            <svg ref={svgRef => svgRef && createGraph(svgRef, 'y', 'z', 'Elitist', 'Abundance', svgSize)} />
          </div>
        );
      case VisualizationType.XW2D:
        return (
          <div {...graphProps}>
            <svg ref={svgRef => svgRef && createGraph(svgRef, 'x', 'w', 'GDP per capita', 'Exchange Rate', svgSize)} />
          </div>
        );
      case VisualizationType.Custom2D:
        return (
          <div {...graphProps}>
            <svg ref={svgRef => svgRef && createGraph(svgRef, 'z', 'w', '', '', svgSize)} />
          </div>
        );
    }
  };

  return (
    <animated.div
      ref={containerRef}
      style={{
        ...springProps,
        position: 'fixed',
        backgroundColor: '#f0ebe5',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        padding: '10px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '10px',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {visibleVisualizations.map(visualizationType => (
        <React.Fragment key={visualizationType}>
          {renderGraph(visualizationType)}
        </React.Fragment>
      ))}
    </animated.div>
  );
};

export default ComparativeGraphs;