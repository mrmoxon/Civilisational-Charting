// src/types/index.ts
export type ColorSchemeType = 'default' | 'pastel' | 'monochrome';

export interface NodeData {
  name: string;
  x: number;
  y: number;
  z: number;
  [key: string]: any;
}

export interface ColorScheme {
  democrat: string;
  republican: string;
  swing: string;
  grid: string;
  axis: string;
  highlight: string;
  connector: string;
}

export interface StateData {
    margins: number[];
    totalVotes?: number;
    demographics?: {
      [key: string]: number;
    };
  }
  
  export interface VotingData {
    [state: string]: number[];
  }
  