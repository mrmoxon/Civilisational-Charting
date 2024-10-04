import React, { useState, useRef } from 'react';
import { Sphere } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  name: string;
  onHover: (name: string | null) => void;
  onClick: (name: string) => void;
  interactionRadius: number;
}

const Node: React.FC<NodeProps> = ({ position, name, onHover, onClick, interactionRadius }) => {
  const [hovered, setHovered] = useState(false);
  const { camera, raycaster, mouse } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);

  const handlePointerMove = (event: THREE.Event) => {
    event.stopPropagation();
    if (sphereRef.current) {
      const sphere = new THREE.Sphere(new THREE.Vector3(...position), interactionRadius);
      raycaster.setFromCamera(mouse, camera);
      if (raycaster.ray.intersectsSphere(sphere)) {
        if (!hovered) {
          setHovered(true);
          onHover(name);
        }
      } else if (hovered) {
        setHovered(false);
        onHover(null);
      }
    }
  };

  const handleClick = (event: THREE.Event) => {
    event.stopPropagation();
    onClick(name);
  };

  return (
    <group onPointerMove={handlePointerMove} onClick={handleClick}>
      <Sphere ref={sphereRef} args={[0.1, 32, 32]} position={position}>
        <meshBasicMaterial color={hovered ? 'yellow' : 'white'} />
      </Sphere>
    </group>
  );
};

export default Node;