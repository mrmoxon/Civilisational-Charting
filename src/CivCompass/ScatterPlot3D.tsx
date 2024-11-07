import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface DataPoint {
  name: string;
  x: number;
  y: number;
  z: number;
}

interface ScatterPlot3DProps {
  data: DataPoint[];
  xKey: 'x' | 'y' | 'z';
  yKey: 'x' | 'y' | 'z';
  xLabel: string;
  yLabel: string;
}

const ScatterPlot3D: React.FC<ScatterPlot3DProps> = ({ data, xKey, yKey, xLabel, yLabel }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <group ref={groupRef}>
        {data.map((point, index) => (
          <Sphere key={index} args={[0.05, 32, 32]} position={[point[xKey], point[yKey], 0]}>
            <meshStandardMaterial color={`hsl(${index * 50}, 100%, 50%)`} />
          </Sphere>
        ))}
      </group>
      <axesHelper args={[5]} />
      <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
    </Canvas>
  );
};

export default ScatterPlot3D;