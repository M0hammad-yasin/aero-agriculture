import { AxiosInstance } from 'axios';
import { 
  SensorType, 
  SensorReading,
  CreateSensorReadingRequest,
  WeeklySensorStats,
  SensorReadingTypeMap
} from '../models/sensor.model';
import { BaseApiService } from './api';
import { ApiResponse } from '../models/auth-model';

/**
 * Sensor Service
 * Handles API calls for sensor data
 */
class SensorService extends BaseApiService<SensorReading> {
  constructor(axios: AxiosInstance) {
    super(axios, '/sensors');
  }

  /**
   * Get the latest reading for a specific sensor type
   * @param sensorType - Type of sensor
   * @returns Promise with API response
   */
  async getLatestReading<T extends SensorType>(
    sensorType: T
  ): Promise<ApiResponse<SensorReadingTypeMap[T]>> {
    return this.customGet<SensorReadingTypeMap[T]>(`${sensorType}/latest`);
  }

  /**
   * Post new sensor data
   * @param sensorType - Type of sensor
   * @param data - Sensor reading data
   * @returns Promise with API response
   */
  async postSensorData<T extends SensorType>(
    sensorType: T,
    data: CreateSensorReadingRequest
  ): Promise<ApiResponse<SensorReadingTypeMap[T]>> {
    return this.customPost<CreateSensorReadingRequest, SensorReadingTypeMap[T]>(
      `${sensorType}/readings`,
      data
    );
  }

  /**
   * Get historical sensor data for a specific type
   * @param sensorType - Type of sensor
   * @param startDate - Start date (ISO format)
   * @param endDate - End date (ISO format)
   * @returns Promise with API response
   */
  async getHistoricalData<T extends SensorType>(
    sensorType: T,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<SensorReadingTypeMap[T][]>> {
    return this.customGet<SensorReadingTypeMap[T][]>(
      `${sensorType}/readings`,
      {
        params: {
          startDate,
          endDate
        }
      }
    );
  }

  /**
   * Get weekly statistics for all sensors
   * @returns Promise with API response
   */
  async getWeeklyStats(): Promise<ApiResponse<WeeklySensorStats>> {
    return this.customGet<WeeklySensorStats>('statistics/weekly');
  }
}

export default SensorService;