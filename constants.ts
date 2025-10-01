// Defines the specifications for different types of 18650 Li-ion cells.

export interface CellSpec {
  id: string;
  name: string;
  voltage: number; // Nominal voltage in Volts (V)
  capacity: number; // Capacity in Amp-hours (Ah)
}

// A list of common 18650 cell profiles for the user to choose from.
export const CELL_SPECS: CellSpec[] = [
  { id: 'very_high_power', name: 'Very High Power (1.5Ah)', voltage: 3.7, capacity: 1.5 },
  { id: 'high_power', name: 'High Power (2.6Ah)', voltage: 3.7, capacity: 2.6 },
  { id: 'balanced', name: 'Balanced (3.0Ah)', voltage: 3.7, capacity: 3.0 },
  { id: 'high_capacity', name: 'High Capacity (3.5Ah)', voltage: 3.7, capacity: 3.5 },
];
