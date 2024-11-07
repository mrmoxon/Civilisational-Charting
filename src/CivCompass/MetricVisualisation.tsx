import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line, Text, OrbitControls, Billboard, Plane } from '@react-three/drei';
import * as THREE from 'three';
import Node from './Node';

interface NodeData {
  name: string;
  x: number;
  y: number;
  z: number;
}

interface MetricVisualisationProps {
  rotationSpeed: number;
  setRotationSpeed: (speed: number) => void;
  colorScheme: string;
  showGridLines: boolean;
  showEdges: boolean;
  nodes: NodeData[];
  onNodeHover: (name: string | null) => void;
  onNodeClick: (name: string) => void;
  interactionRadius: number;
}

const MetricVisualisation: React.FC<MetricVisualisationProps> = ({ 
    rotationSpeed, 
    setRotationSpeed, 
    colorScheme, 
    showGridLines,
    showEdges,
    nodes,
    onNodeHover,
    onNodeClick,
    interactionRadius
     }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { camera } = useThree();
    
    useEffect(() => {
        const controls = camera.userData.controls;
        if (controls) {
        controls.addEventListener('start', (event: THREE.Event) => {
            if (event.type === 'start' && (controls as any).state === 1) { // Check if it's a drag event
            setIsDragging(true);
            }
        });
        controls.addEventListener('end', () => {
            setIsDragging(false);
        });
        }
        return () => {
        if (controls) {
            controls.removeEventListener('start', () => {});
            controls.removeEventListener('end', () => {});
        }
        };
    }, [camera]);

    useFrame(() => {
        if (groupRef.current && !isDragging && rotationSpeed > 0) {
          groupRef.current.rotation.y += rotationSpeed;
        }
      });
    
    // useEffect(() => {
    //     if (rotationSpeed > 0 && prevRotationSpeedRef.current === 0) {
    //     setIsDragging(false);
    //     }
    //     prevRotationSpeedRef.current = rotationSpeed;
    // }, [rotationSpeed]);

    const size = 8;
    let axisColors = {
        x: "red",
        y: "green",
        z: "blue"
    };
    let boldAxisColor = "white";
    let edgeColor = "rgba(255, 255, 255, 0.3)";

    if (colorScheme === 'pastel') {
        axisColors = {
        x: "#FFB3BA", // pastel red
        y: "#BAFFC9", // pastel green
        z: "#BAE1FF"  // pastel blue
        };
        boldAxisColor = "#E6E6FA"; // pastel purple
        edgeColor = "rgba(230, 230, 250, 0.3)"; // pastel purple with opacity
    } else if (colorScheme === 'monochrome') {
        axisColors = {
        x: "#808080", // gray
        y: "#A9A9A9", // dark gray
        z: "#D3D3D3"  // light gray
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
            onChange={(event) => {
            if (event.type === 'change' && (event.target as any).state === 1) { // Check if it's a drag event
                setIsDragging(true);
            }
            }}
            onStart={(event) => {
            if (event.type === 'start' && (event.target as any).state === 1) { // Check if it's a drag event
                setIsDragging(true);
            }
            }}
            onEnd={() => {
            setIsDragging(false);
            }}
            minDistance={size}
            maxDistance={size * 3}
        />
        <group ref={groupRef}>
            {/* Central Axes */}
            <Line points={[[-size, 0, 0], [size, 0, 0]]} color={axisColors.x} lineWidth={boldLineWidth} />
            <Line points={[[0, -size, 0], [0, size, 0]]} color={axisColors.y} lineWidth={boldLineWidth} />
            <Line points={[[0, 0, -size], [0, 0, size]]} color={axisColors.z} lineWidth={boldLineWidth} />

            {/* Box Edges */}
            {showEdges && (
                <>
                    <Line points={[[-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size], [-size, -size, -size]]} color={edgeColor} lineWidth={thinLineWidth} />
                    <Line points={[[-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size], [-size, -size, size]]} color={edgeColor} lineWidth={thinLineWidth} />
                    <Line points={[[-size, -size, -size], [-size, -size, size]]} color={edgeColor} lineWidth={thinLineWidth} />
                    <Line points={[[size, -size, -size], [size, -size, size]]} color={edgeColor} lineWidth={thinLineWidth} />
                    <Line points={[[-size, size, -size], [-size, size, size]]} color={edgeColor} lineWidth={thinLineWidth} />
                    <Line points={[[size, size, -size], [size, size, size]]} color={edgeColor} lineWidth={thinLineWidth} />
                </>
            )}

            {/* 2x2 Grid Lines */}
            {showGridLines && (
            <>
                {/* Front face (z = -size) */}
                <Line points={[[-size, 0, -size], [size, 0, -size]]} color={edgeColor} lineWidth={thinLineWidth} />
                <Line points={[[0, -size, -size], [0, size, -size]]} color={edgeColor} lineWidth={thinLineWidth} />

                {/* Back face (z = size) */}
                <Line points={[[-size, 0, size], [size, 0, size]]} color={edgeColor} lineWidth={thinLineWidth} />
                <Line points={[[0, -size, size], [0, size, size]]} color={edgeColor} lineWidth={thinLineWidth} />

                {/* Left face (x = -size) */}
                <Line points={[[-size, -size, 0], [-size, size, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
                <Line points={[[-size, 0, -size], [-size, 0, size]]} color={edgeColor} lineWidth={thinLineWidth} />

                {/* Right face (x = size) */}
                <Line points={[[size, -size, 0], [size, size, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
                <Line points={[[size, 0, -size], [size, 0, size]]} color={edgeColor} lineWidth={thinLineWidth} />

                {/* Top face (y = size) */}
                <Line points={[[-size, size, 0], [size, size, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
                <Line points={[[0, size, -size], [0, size, size]]} color={edgeColor} lineWidth={thinLineWidth} />

                {/* Bottom face (y = -size) */}
                <Line points={[[-size, -size, 0], [size, -size, 0]]} color={edgeColor} lineWidth={thinLineWidth} />
                <Line points={[[0, -size, -size], [0, -size, size]]} color={edgeColor} lineWidth={thinLineWidth} />        
                </>
            )}

            {/* Axis Labels */}
            <Text position={[size - 1.5, 0.01, -0.5]} fontSize={0.5} color={boldAxisColor} rotation={[Math.PI / 2, Math.PI, Math.PI]}>
            Abundant
            </Text>
            <Text position={[-size + 1, 0.01, -0.5]} fontSize={0.5} color={boldAxisColor} rotation={[Math.PI / 2, Math.PI, Math.PI]}>
            Scarce
            </Text>
            <Billboard position={[0, size + 0.5, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
            <Text fontSize={0.5} color={boldAxisColor}>
                Elitist
            </Text>
            </Billboard>
            <Billboard position={[0, -size - 0.5, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
            <Text fontSize={0.5} color={boldAxisColor}>
                Egalitarian
            </Text>
            </Billboard>
            <Text position={[-0.5, 0.01, size - 1.2]} fontSize={0.5} color={boldAxisColor} rotation={[Math.PI / 2, Math.PI, -Math.PI / 2]}>
            Altruistic
            </Text>
            <Text position={[-0.5, 0.01, -size + 1.6]} fontSize={0.5} color={boldAxisColor} rotation={[Math.PI/2, Math.PI, -Math.PI /2]}>
            Individualist
            </Text>

            {/* Opaque planes for monochrome scheme */}
            {colorScheme === 'monochrome' && (
                <>
                    <Plane args={[size * 2, size * 2]} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <meshBasicMaterial color={axisColors.x} transparent opacity={0.2} side={THREE.DoubleSide} />
                    </Plane>
                    <Plane args={[size * 2, size * 2]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color={axisColors.y} transparent opacity={0.2} side={THREE.DoubleSide} />
                    </Plane>
                    <Plane args={[size * 2, size * 2]} position={[0, 0, 0]}>
                    <meshBasicMaterial color={axisColors.z} transparent opacity={0.2} side={THREE.DoubleSide} />
                    </Plane>
                </>
            )}

            {/* Render Nodes */}
            {nodes.map((node, index) => (
                <Node
                key={index}
                position={[node.x * size, node.y * size, node.z * size]}
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

export default MetricVisualisation;
