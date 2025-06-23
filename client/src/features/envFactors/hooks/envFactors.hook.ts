import { useState, useCallback, useEffect } from 'react';
import { 
  SensorType, 
  SensorReading,
  CreateSensorReadingRequest,
  WeeklySensorStats,
  SensorReadingTypeMap
} from '../../../models/sensor.model';
import { EnvFactorsService } from '../services';
import { ApiResponse } from '../../../models/auth-model';
import apiClient from '../../../services/api/apiClient';

/**
 * Hook for managing environmental factors data
 */
export const useEnvFactors = () => {
  const [envFactorsService] = useState(() => new EnvFactorsService(apiClient));
  
  // State for latest readings
  const [latestReadings, setLatestReadings] = useState<Record<SensorType, SensorReadingTypeMap[SensorType] | null> | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklySensorStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get latest reading for a specific sensor
  const getLatestReading = useCallback(async <T extends SensorType>(
    sensorType: T
  ): Promise<ApiResponse<SensorReadingTypeMap[T]>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await envFactorsService.getLatestReading(sensorType);
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch latest reading';
      setError(errorMsg);
      return {
        data: null,
        error: errorMsg,
        status: 500,
        isSuccess: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [envFactorsService, clearError]);

  // Get all latest readings
  const getAllLatestReadings = useCallback(async (): Promise<ApiResponse<Record<SensorType, SensorReadingTypeMap[SensorType] | null>>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await envFactorsService.getAllLatestReadings();
      if (response.isSuccess && response.data) {
        setLatestReadings(response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch all latest readings';
      setError(errorMsg);
      return {
        data: null,
        error: errorMsg,
        status: 500,
        isSuccess: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [envFactorsService, clearError]);

  // Post new sensor data
  const postSensorData = useCallback(async <T extends SensorType>(
    sensorType: T,
    data: CreateSensorReadingRequest
  ): Promise<ApiResponse<SensorReadingTypeMap[T]>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await envFactorsService.postSensorData(sensorType, data);
      // Refresh latest readings after posting new data
      if (response.isSuccess) {
        await getAllLatestReadings();
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to post sensor data';
      setError(errorMsg);
      return {
        data: null,
        error: errorMsg,
        status: 500,
        isSuccess: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [envFactorsService, clearError, getAllLatestReadings]);

  // Get historical data
  const getHistoricalData = useCallback(async <T extends SensorType>(
    sensorType: T,
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<ApiResponse<SensorReadingTypeMap[T][]>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await envFactorsService.getHistoricalData(sensorType, startDate, endDate, limit);
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch historical data';
      setError(errorMsg);
      return {
        data: null,
        error: errorMsg,
        status: 500,
        isSuccess: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [envFactorsService, clearError]);

  // Get weekly statistics
  const getWeeklyStats = useCallback(async (): Promise<ApiResponse<WeeklySensorStats>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await envFactorsService.getWeeklyStats();
      if (response.isSuccess && response.data) {
        setWeeklyStats(response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch weekly statistics';
      setError(errorMsg);
      return {
        data: null,
        error: errorMsg,
        status: 500,
        isSuccess: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [envFactorsService, clearError]);

  // Delete sensor reading
  const deleteSensorReading = useCallback(async (
    sensorType: SensorType,
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await envFactorsService.deleteSensorReading(sensorType, id);
      // Refresh latest readings after deletion
      if (response.isSuccess) {
        await getAllLatestReadings();
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete sensor reading';
      setError(errorMsg);
      return {
        data: null,
        error: errorMsg,
        status: 500,
        isSuccess: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [envFactorsService, clearError, getAllLatestReadings]);

  // Load initial data
  useEffect(() => {
    getAllLatestReadings();
    getWeeklyStats();
  }, [getAllLatestReadings, getWeeklyStats]);

  return {
    // State
    latestReadings,
    weeklyStats,
    isLoading,
    error,
    
    // Actions
    getLatestReading,
    getAllLatestReadings,
    postSensorData,
    getHistoricalData,
    getWeeklyStats,
    deleteSensorReading,
    clearError
  };
}; 