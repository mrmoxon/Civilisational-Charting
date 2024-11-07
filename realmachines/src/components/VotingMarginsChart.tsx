import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Line, Text, Billboard, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import votingData from './votingData.ts';

type ColorSchemeType = 'default' | 'pastel' | 'monochrome';

interface ColorScheme {
  democrat: string;
  republican: string;
  swing: string;
  grid: string;
  axis: string;
  highlight: string;
  connector: string;
}

interface VotingMarginsChartProps {
  rotationSpeed: number;
  setRotationSpeed: (speed: number) => void;
  colorScheme: ColorSchemeType;
  showGridLines: boolean;
  showEdges: boolean;
  onStateHover: (state: string | null) => void;
  onStateClick: (state: string) => void;
}

// Define the structure of the voting data
interface VotingDataType {
    [state: string]: number[];
  }
  
  const CHART_CONFIG = {
    size: 8,
    years: ['2000', '2004', '2008', '2012', '2016', '2020', '2024'],
    gridValues: [-75, -50, -25, 25, 50, 75]
  } as const;
    
const colorSchemes: Record<ColorSchemeType, ColorScheme> = {
  default: {
    democrat: '#3498db',
    republican: '#e74c3c',
    swing: '#2ecc71',
    grid: 'rgba(255, 255, 255, 0.3)',
    axis: 'white',
    highlight: '#ffd700',
    connector: '#f5f5dc'
  },
  pastel: {
    democrat: '#90caf9',
    republican: '#ef9a9a',
    swing: '#a5d6a7',
    grid: 'rgba(230, 230, 250, 0.3)',
    axis: '#E6E6FA',
    highlight: '#fffacd',
    connector: '#f5f5dc'
  },
  monochrome: {
    democrat: '#808080',
    republican: '#404040',
    swing: '#606060',
    grid: 'rgba(255, 255, 255, 0.2)',
    axis: 'white',
    highlight: '#ffffff',
    connector: '#f5f5dc'
  }
};

const VotingMarginsChart: React.FC<VotingMarginsChartProps> = ({
    rotationSpeed,
    setRotationSpeed,
    colorScheme,
    showGridLines,
    showEdges,
    onStateHover,
    onStateClick,
  }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const [isDragging, setIsDragging] = useState(false);
    const [activeState, setActiveState] = useState<string | null>(null);
    const colors = colorSchemes[colorScheme];
    const { size, years, gridValues } = CHART_CONFIG;
  
    useEffect(() => {
      camera.position.set(0, 0, 12);
      camera.lookAt(0, 0, 0);
    }, [camera]);
  
    const handleStateInteraction = {
      enter: (state: string) => {
        setActiveState(state);
        onStateHover(state);
      },
      leave: () => {
        setActiveState(null);
        onStateHover(null);
      },
      click: (state: string) => {
        onStateClick(state);
      }
    };
  
    // Sort states by their 2024 margin
    const sortedStates = useMemo(() => {
      return Object.entries(votingData as VotingDataType)
        .sort(([, marginsA], [, marginsB]) => {
          const marginA = marginsA[marginsA.length - 1];
          const marginB = marginsB[marginsB.length - 1];
          return marginB - marginA;
        })
        .map(([state]) => state);
    }, []);
  
    const getLineStyles = (state: string, margins: number[]) => {
      const isSwing = margins.some((v: number) => v >= 0) && margins.some((v: number) => v < 0);
      return {
        color: state === activeState ? colors.highlight : 
                isSwing ? colors.swing : 
                margins[0] > 0 ? colors.democrat : colors.republican,
        lineWidth: state === activeState ? 4 : 2
      };
    };
  
    // Create state lines
    const StateLines = useMemo(() => 
      Object.entries(votingData as VotingDataType).map(([state, margins]) => {
        const points = margins.map((margin: number, index: number) => {
          const x = (index / (margins.length - 1) - 0.5) * size * 2;
          const y = (margin / 100) * size;
          return new THREE.Vector3(x, y, 0);
        });
  
        const { color, lineWidth } = getLineStyles(state, margins);
  
        return (
          <Line
            key={state}
            points={points}
            color={color}
            lineWidth={lineWidth}
            onPointerEnter={(e) => {
              e.stopPropagation();
              handleStateInteraction.enter(state);
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              handleStateInteraction.leave();
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleStateInteraction.click(state);
            }}
          />
        );
      }),
      [votingData, activeState, colors, size]
    );
  
    // Create state labels with connecting lines
    const StateLabels = useMemo(() => {
      const totalStates = sortedStates.length;
      const labelSpacing = (size * 1.6) / totalStates;
  
      return sortedStates.map((state, index) => {
        const margins = (votingData as VotingDataType)[state];
        const yPosition = (size * 0.8) - (index * labelSpacing);
        const { color } = getLineStyles(state, margins);
        const isSwingState = margins.some((v: number) => v >= 0) && margins.some((v: number) => v < 0);
        
        return (
          <group key={`label-${state}`}>
            <Billboard
              position={[size * 1.2, yPosition, 0]}
              follow={true}
              lockX={false}
              lockY={false}
              lockZ={false}
            >
              <Text
                color={state === activeState ? colors.highlight : color}
                fontSize={0.2}
                anchorX="left"
                anchorY="middle"
                outlineWidth={state === activeState ? 0.01 : 0}
                outlineColor="black"
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  handleStateInteraction.enter(state);
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  handleStateInteraction.leave();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStateInteraction.click(state);
                }}
              >
                {isSwingState ? `${state}*` : state} ({margins[margins.length - 1].toFixed(1)}%)
              </Text>
            </Billboard>
            <Line
              points={[
                [size, margins[margins.length - 1] / 100 * size, 0],
                [size * 1.1, yPosition, 0]
              ]}
              color={state === activeState ? colors.highlight : colors.connector}
              lineWidth={state === activeState ? 2 : 1}
              opacity={state === activeState ? 1 : 0.5}
            />
          </group>
        );
      });
    }, [sortedStates, activeState, colors, getLineStyles, size, votingData]);
  
    // Create grid lines and labels
    const GridLines = useMemo(() => 
      showGridLines && (
        <>
          {[-100, -75, -50, -25, 0, 25, 50, 75, 100].map((value) => (
            <group key={`grid-${value}`}>
              <Line
                points={[[-size, value/100 * size, 0], [size, value/100 * size, 0]]}
                color={colors.grid}
                lineWidth={1}
              />
              <Billboard position={[-size - 0.5, value/100 * size, 0]}>
                <Text
                  color={colors.axis}
                  fontSize={0.2}
                  anchorX="right"
                  anchorY="middle"
                >
                  {value}%
                </Text>
              </Billboard>
            </group>
          ))}
          {years.map((year, i) => {
            const x = (i / (years.length - 1) - 0.5) * size * 2;
            return (
              <Line
                key={`grid-v-${year}`}
                points={[[x, -size, 0], [x, size, 0]]}
                color={colors.grid}
                lineWidth={1}
              />
            );
          })}
        </>
      ),
      [showGridLines, colors.grid, colors.axis, size, years]
    );
  
    // Create axis labels
    const AxisLabels = useMemo(() => (
      <>
        {years.map((year, index) => {
          const x = (index / (years.length - 1) - 0.5) * size * 2;
          return (
            <Billboard key={year} position={[x, -size - 0.5, 0]}>
              <Text color={colors.axis} fontSize={0.3}>
                {year}
              </Text>
            </Billboard>
          );
        })}
        
        <Billboard position={[0, size + 1, 0]}>
          <Text color={colors.axis} fontSize={0.4}>
            Democratic →
          </Text>
        </Billboard>
        <Billboard position={[0, -size - 1, 0]}>
          <Text color={colors.axis} fontSize={0.4}>
            ← Republican
          </Text>
        </Billboard>
        
        <Billboard position={[-size, size + 1, 0]}>
          <Text color={colors.swing} fontSize={0.3}>
            * = Swing State
          </Text>
        </Billboard>
      </>
    ), [colors.axis, colors.swing, years, size]);
  
    useFrame(() => {
      if (groupRef.current && !isDragging && rotationSpeed > 0) {
        groupRef.current.rotation.y += rotationSpeed;
      }
    });
  
    return (
      <>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          onChange={() => setIsDragging(true)}
          onStart={() => setIsDragging(true)}
          onEnd={() => {
            setIsDragging(false);
            if (rotationSpeed > 0) {
              setRotationSpeed(rotationSpeed);
            }
          }}
          minDistance={8}
          maxDistance={20}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <group ref={groupRef}>
          <Line points={[[-size, 0, 0], [size, 0, 0]]} color={colors.axis} lineWidth={3} />
          <Line points={[[0, -size, 0], [0, size, 0]]} color={colors.axis} lineWidth={3} />
          
          {GridLines}
          {StateLines}
          {StateLabels}
          {AxisLabels}
        </group>
      </>
    );
  };
  
  export default VotingMarginsChart;  