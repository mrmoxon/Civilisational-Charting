import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface CubeVisualisationProps {
  isActive: boolean;
  onClick: () => void;
}

const CubeVisualisation: React.FC<CubeVisualisationProps> = ({ isActive, onClick }) => {
  const cubeRef = useRef<THREE.Group>();

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <div 
      onClick={onClick}
      style={{ 
        width: '150px', 
        height: '150px', 
        cursor: 'pointer',
        border: isActive ? '2px solid yellow' : '2px solid transparent'
      }}
    >
      <Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
        <ambientLight intensity={0.5} />
        <group ref={cubeRef}>
          {/* Cube edges */}
          <Line points={[-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1]} color="white" />
          <Line points={[-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1]} color="white" />
          <Line points={[-1, -1, -1, -1, -1, 1]} color="white" />
          <Line points={[1, -1, -1, 1, -1, 1]} color="white" />
          <Line points={[1, 1, -1, 1, 1, 1]} color="white" />
          <Line points={[-1, 1, -1, -1, 1, 1]} color="white" />

          {/* Axis planes */}
          <Plane args={[2, 2]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <meshBasicMaterial color="red" transparent opacity={0.2} side={2} />
          </Plane>
          <Plane args={[2, 2]} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <meshBasicMaterial color="green" transparent opacity={0.2} side={2} />
          </Plane>
          <Plane args={[2, 2]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="blue" transparent opacity={0.2} side={2} />
          </Plane>
        </group>
      </Canvas>
    </div>
  );
};

export default CubeVisualisation;