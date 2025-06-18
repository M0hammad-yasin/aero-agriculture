/**
 * Sensor reading type
 */
export type SensorType = 'temperature' | 'humidity' | 'ph' | 'ec' | 'co2' | 'solution-level';

/**
 * Base sensor reading interface
 */
export interface SensorReading {
  id: string;
  value: number;
  timestamp: string;
  deviceId: string;
}

/**
 * Temperature sensor reading
 */
export interface TemperatureReading extends SensorReading {
  unit: '°C' | '°F';
}

/**
 * Humidity sensor reading
 */
export interface HumidityReading extends SensorReading {
  unit: '%';
}

/**
 * pH sensor reading
 */
export interface PHReading extends SensorReading {
  unit: 'pH';
}

/**
 * Electrical Conductivity sensor reading
 */
export interface ECReading extends SensorReading {
  unit: 'mS/cm';
}

/**
 * CO2 sensor reading
 */
export interface CO2Reading extends SensorReading {
  unit: 'ppm';
}

/**
 * Solution level sensor reading
 */
export interface SolutionLevelReading extends SensorReading {
  unit: 'cm' | '%';
}

/**
 * Weekly statistics for sensor readings
 */
export interface WeeklySensorStats {
  dates: string[];
  temperature: number[];
  humidity: number[];
  ph: number[];
  ec: number[];
  co2: number[];
  solutionLevel: number[];
}

/**
 * Sensor reading creation payload
 */
export interface CreateSensorReadingRequest {
  value: number;
  deviceId: string;
  unit?: string;
}

/**
 * Type mapping for sensor readings
 */
export type SensorReadingTypeMap = {
  'temperature': TemperatureReading;
  'humidity': HumidityReading;
  'ph': PHReading;
  'ec': ECReading;
  'co2': CO2Reading;
  'solution-level': SolutionLevelReading;
}