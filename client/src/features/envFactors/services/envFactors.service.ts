import { AxiosInstance } from 'axios';
import { 
  SensorType, 
  SensorReading,
  CreateSensorReadingRequest,
  WeeklySensorStats,
  SensorReadingTypeMap
} from '../../../models/sensor.model';
import BaseApiService from '../../../services/api/baseApiServices';
import { ApiResponse } from '../../../models/auth-model';

/**
 * Environmental Factors Service
 * Handles API calls for environmental sensor data (temperature, humidity, EC, CO2, pH)
 */
class EnvFactorsService extends BaseApiService<SensorReading> {
  constructor(axios: AxiosInstance) {
    super(axios, '/sensors');
  }

  /**
   * Get the latest reading for a specific environmental sensor
   * @param sensorType - Type of environmental sensor
   * @returns Promise with API response
   */
  async getLatestReading<T extends SensorType>(
    sensorType: T
  ): Promise<ApiResponse<SensorReadingTypeMap[T]>> {
    return this.customGet<SensorReadingTypeMap[T]>(`${sensorType}/latest`);
  }

  /**
   * Get latest readings for all environmental sensors
   * @returns Promise with API response containing all latest readings
   */
  async getAllLatestReadings(): Promise<ApiResponse<Record<SensorType, SensorReadingTypeMap[SensorType] | null>>> {
    return this.customGet<Record<SensorType, SensorReadingTypeMap[SensorType] | null>>('all/latest');
  }

  /**
   * Post new environmental sensor data
   * @param sensorType - Type of environmental sensor
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
   * Get historical environmental sensor data
   * @param sensorType - Type of environmental sensor
   * @param startDate - Start date (ISO format)
   * @param endDate - End date (ISO format)
   * @param limit - Number of readings to return (default: 100)
   * @returns Promise with API response
   */
  async getHistoricalData<T extends SensorType>(
    sensorType: T,
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<ApiResponse<SensorReadingTypeMap[T][]>> {
    const params: Record<string, any> = { limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.customGet<SensorReadingTypeMap[T][]>(
      `${sensorType}/readings`,
      { params }
    );
  }

  /**
   * Get weekly statistics for all environmental sensors
   * @returns Promise with API response
   */
  async getWeeklyStats(): Promise<ApiResponse<WeeklySensorStats>> {
    return this.customGet<WeeklySensorStats>('statistics/weekly');
  }

  /**
   * Delete a specific environmental sensor reading
   * @param sensorType - Type of environmental sensor
   * @param id - Reading ID to delete
   * @returns Promise with API response
   */
  async deleteSensorReading(
    sensorType: SensorType,
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.customDelete<{ message: string }>(`${sensorType}/readings/${id}`);
  }
}

export default EnvFactorsService; 