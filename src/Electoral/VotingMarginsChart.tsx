import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Line, Text, Billboard, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import votingData from './votingData';

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

  // Sort states by their 2024 margin (last value in the array)
  const sortedStates = useMemo(() => {
    return Object.entries(votingData)
      .sort(([, marginsA], [, marginsB]) => {
        const marginA = marginsA[marginsA.length - 1];
        const marginB = marginsB[marginsB.length - 1];
        return marginB - marginA;
      })
      .map(([state]) => state);
  }, [votingData]);
    
    const getLineStyles = (state: string, margins: number[]) => {
        const isSwing = margins.some(v => v >= 0) && margins.some(v => v < 0);
        return {
            color: state === activeState ? colors.highlight : 
                    isSwing ? colors.swing : 
                    margins[0] > 0 ? colors.democrat : colors.republican,
            lineWidth: state === activeState ? 4 : 2
        };
    };
    
  // Calculate label positions
  const StateLabels = useMemo(() => {
    const totalStates = sortedStates.length;
    const labelSpacing = (size * 1.6) / totalStates; // Distribute labels along the height

    return sortedStates.map((state, index) => {
      const margins = votingData[state];
      const yPosition = (size * 0.8) - (index * labelSpacing); // Start from top and go down
      const { color } = getLineStyles(state, margins);
      
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
              {state} ({margins[margins.length - 1].toFixed(1)}%)
            </Text>
          </Billboard>
          {/* Connector line from graph to label */}
          {state === activeState && (
            <Line
              points={[
                [size, margins[margins.length - 1] / 100 * size, 0],
                [size * 1.1, yPosition, 0]
              ]}
              color={colors.highlight}
              lineWidth={1}
              dashed
            />
          )}
        </group>
      );
    });
  }, [sortedStates, activeState, colors, getLineStyles]);

  const GridLines = useMemo(() => (
    showGridLines && (
      <>
        {/* Horizontal grid lines */}
        {gridValues.map((value) => (
          <Line
            key={`grid-h-${value}`}
            points={[[-size, value/100 * size, 0], [size, value/100 * size, 0]]}
            color={colors.grid}
            lineWidth={1}
          />
        ))}
        {/* Vertical grid lines */}
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
    )
  ), [showGridLines, colors.grid]);

  const createStateLines = useMemo(() => 
    Object.entries(votingData).map(([state, margins]) => {
      const points = margins.map((margin, i) => {
        const x = (i / (margins.length - 1) - 0.5) * size * 2;
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

  const createStateLabels = useMemo(() => {
    const totalStates = sortedStates.length;
    const labelSpacing = (size * 1.6) / totalStates;

    return sortedStates.map((state, index) => {
        const margins = votingData[state];
        const yPosition = (size * 0.8) - (index * labelSpacing);
        const { color } = getLineStyles(state, margins);
        const isSwingState = margins.some(v => v >= 0) && margins.some(v => v < 0);
        
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
                        {isSwingState ? `_${state}_` : state} ({margins[margins.length - 1].toFixed(1)}%)
                    </Text>
                </Billboard>
                {/* Removed 'dashed' prop for solid lines */}
                <Line
                    points={[
                        [size, margins[margins.length - 1] / 100 * size, 0],
                        [size * 1.1, yPosition, 0]
                    ]}
                    color={colors.connector}
                    lineWidth={1}
                />
            </group>
        );
    });
}, [sortedStates, activeState, colors, getLineStyles, size, votingData]);

    const createGridLines = useMemo(() => 
        showGridLines && (
            <>
                {/* Update grid values to show more percentage points */}
                {[-100, -75, -50, -25, 0, 25, 50, 75, 100].map((value) => (
                    <group key={`grid-${value}`}>
                        <Line
                            points={[[-size, value/100 * size, 0], [size, value/100 * size, 0]]}
                            color={colors.grid}
                            lineWidth={1}
                        />
                        {/* Add percentage labels on y-axis */}
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

    const Labels = useMemo(() => (
        <>
            {/* Axis labels */}
            <Billboard position={[size + 1, 0, 0]}>
                <Text color={colors.axis} fontSize={0.5}>
                    Time →
                </Text>
            </Billboard>
            <Billboard position={[0, size + 1, 0]}>
                <Text color={colors.axis} fontSize={0.5}>
                    Democratic
                </Text>
            </Billboard>
            <Billboard position={[0, -size - 1, 0]}>
                <Text color={colors.axis} fontSize={0.5}>
                    Republican
                </Text>
            </Billboard>
    
            {/* Year labels */}
            {years.map((year, i) => {
                const x = (i / (years.length - 1) - 0.5) * size * 2;
                return (
                    <Billboard key={year} position={[x, -size - 0.5, 0]}>
                        <Text color={colors.axis} fontSize={0.3}>
                            {year}
                        </Text>
                    </Billboard>
                );
            })}
    
            {/* Percentage labels */}
            {gridValues.map((value) => (
                <Billboard key={`label-${value}`} position={[-size/8, value/100 * size, 0]}>
                    <Text color={colors.axis} fontSize={0.3}>
                        {value}%
                    </Text>
                </Billboard>
            ))}
        </>
    ), [colors.axis, years, gridValues, size]);
    
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
        {/* Main axes */}
        <Line points={[[-size, 0, 0], [size, 0, 0]]} color={colors.axis} lineWidth={3} />
        <Line points={[[0, -size, 0], [0, size, 0]]} color={colors.axis} lineWidth={3} />
        
        {createGridLines}
        {createStateLines}
        {createStateLabels}
        {Labels}
      </group>
    </>
  );
};

export default VotingMarginsChart;