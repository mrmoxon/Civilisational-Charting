import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Node from './Node';

interface NodeData {
  name: string;
  x: number;
  y: number;
}

interface SinglePlaneVisProps {
  rotationSpeed: number;
  colorScheme: string;
  showGridLines: boolean;
  nodes: NodeData[];
  onNodeHover: (name: string | null) => void;
  onNodeClick: (name: string) => void;
  interactionRadius: number;
  xAxisLabel: string;
  yAxisLabel: string;
}

const SinglePlaneVis: React.FC<SinglePlaneVisProps> = ({
  rotationSpeed,
  colorScheme,
  showGridLines,
  nodes,
  onNodeHover,
  onNodeClick,
  interactionRadius,
  xAxisLabel,
  yAxisLabel,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  useEffect(() => {
    const controls = camera.userData.controls;
    if (controls) {
      controls.addEventListener('start', () => setIsDragging(true));
      controls.addEventListener('end', () => setIsDragging(false));
    }
    return () => {
      if (controls) {
        controls.removeEventListener('start', () => setIsDragging(true));
        controls.removeEventListener('end', () => setIsDragging(false));
      }
    };
  }, [camera]);

  useFrame(() => {
    if (groupRef.current && !isDragging && rotationSpeed > 0) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  const size = 4;
  let axisColors = {
    x: "red",
    y: "green",
  };
  let boldAxisColor = "white";
  let edgeColor = "rgba(255, 255, 255, 0.3)";

  if (colorScheme === 'pastel') {
    axisColors = {
      x: "#FFB3BA",
      y: "#BAFFC9",
    };
    boldAxisColor = "#E6E6FA";
    edgeColor = "rgba(230, 230, 250, 0.3)";
  } else if (colorScheme === 'monochrome') {
    axisColors = {
      x: "#808080",
      y: "#A9A9A9",
    };
    boldAxisColor = "white";
    edgeColor = "rgba(255, 255, 255, 0.3)";
  }

  const boldLineWidth = 3;
  const thinLineWidth = 0.5;

  return (
    <>
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        onChange={() => setIsDragging(true)}
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      />
      <group ref={groupRef}>
        {/* Central Axes */}
        <Line points={[[-size, 0, 0], [size, 0, 0]]} color={axisColors.x} lineWidth={boldLineWidth} />
        <Line points={[[0, -size, 0], [0, size, 0]]} color={axisColors.y} lineWidth={boldLineWidth} />

        {/* Grid Lines */}
        {showGridLines && (
          <>
            <Line points={[[-size, -size/2, 0], [size, -size/2, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
            <Line points={[[-size, size/2, 0], [size, size/2, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
            <Line points={[[-size/2, -size, 0], [-size/2, size, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
            <Line points={[[size/2, -size, 0], [size/2, size, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
          </>
        )}

        {/* Axis Labels */}
        <Text position={[size - 0.5, 0.3, 0]} fontSize={0.3} color={boldAxisColor}>
          {xAxisLabel}
        </Text>
        <Text position={[0.3, size - 0.5, 0]} fontSize={0.3} color={boldAxisColor} rotation={[0, 0, Math.PI / 2]}>
          {yAxisLabel}
        </Text>

        {/* Render Nodes */}
        {nodes.map((node, index) => (
          <Node
            key={index}
            position={[node.x * size, node.y * size, 0]}
            name={node.name}
            onHover={onNodeHover}
            onClick={onNodeClick}
            interactionRadius={interactionRadius}
          />
        ))}
      </group>
    </>
  );
};

export default SinglePlaneVis;