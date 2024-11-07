// Define the type for our state data
export type StateData = {
    [key: string]: number[];
};

// If you want to be more specific about the length of the arrays
export type StateDataStrict = {
    [key: string]: [number, number, number, number, number, number, number];
};