import { useState, useCallback, useEffect } from 'react';
import { 
  WeeklySensorStats
} from '../../../models/sensor.model';
import { GrowthService, PlantGrowthData, GrowthStatistics } from '../services';
import { ApiResponse } from '../../../models/auth-model';
import apiClient from '../../../services/api/apiClient';

/**
 * Hook for managing plant growth data
 */
export const useGrowth = () => {
  const [growthService] = useState(() => new GrowthService(apiClient));
  
  // State
  const [plantData, setPlantData] = useState<PlantGrowthData[] | null>(null);
  const [growthStats, setGrowthStats] = useState<GrowthStatistics | null>(null);
  const [weeklyGrowthData, setWeeklyGrowthData] = useState<WeeklySensorStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get all plant data
  const getAllPlantData = useCallback(async (): Promise<ApiResponse<PlantGrowthData[]>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.getAllPlantData();
      if (response.isSuccess && response.data) {
        setPlantData(response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch plant data';
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
  }, [growthService, clearError]);

  // Get plant data by ID
  const getPlantDataById = useCallback(async (id: string): Promise<ApiResponse<PlantGrowthData>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.getPlantDataById(id);
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch plant data';
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
  }, [growthService, clearError]);

  // Create new plant data
  const createPlantData = useCallback(async (data: Partial<PlantGrowthData>): Promise<ApiResponse<PlantGrowthData>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.createPlantData(data);
      // Refresh plant data after creation
      if (response.isSuccess) {
        await getAllPlantData();
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create plant data';
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
  }, [growthService, clearError, getAllPlantData]);

  // Update plant data
  const updatePlantData = useCallback(async (id: string, data: Partial<PlantGrowthData>): Promise<ApiResponse<PlantGrowthData>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.updatePlantData(id, data);
      // Refresh plant data after update
      if (response.isSuccess) {
        await getAllPlantData();
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update plant data';
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
  }, [growthService, clearError, getAllPlantData]);

  // Delete plant data
  const deletePlantData = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.deletePlantData(id);
      // Refresh plant data after deletion
      if (response.isSuccess) {
        await getAllPlantData();
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete plant data';
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
  }, [growthService, clearError, getAllPlantData]);

  // Get growth statistics
  const getGrowthStatistics = useCallback(async (): Promise<ApiResponse<GrowthStatistics>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.getGrowthStatistics();
      if (response.isSuccess && response.data) {
        setGrowthStats(response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch growth statistics';
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
  }, [growthService, clearError]);

  // Get weekly growth data
  const getWeeklyGrowthData = useCallback(async (): Promise<ApiResponse<WeeklySensorStats>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.getWeeklyGrowthData();
      if (response.isSuccess && response.data) {
        setWeeklyGrowthData(response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch weekly growth data';
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
  }, [growthService, clearError]);

  // Update plant stage
  const updatePlantStage = useCallback(async (id: string, stage: string): Promise<ApiResponse<PlantGrowthData>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.updatePlantStage(id, stage);
      // Refresh plant data after stage update
      if (response.isSuccess) {
        await getAllPlantData();
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update plant stage';
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
  }, [growthService, clearError, getAllPlantData]);

  // Update plant health
  const updatePlantHealth = useCallback(async (id: string, health: string): Promise<ApiResponse<PlantGrowthData>> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await growthService.updatePlantHealth(id, health);
      // Refresh plant data after health update
      if (response.isSuccess) {
        await getAllPlantData();
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update plant health';
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
  }, [growthService, clearError, getAllPlantData]);

  // Load initial data
  useEffect(() => {
    getAllPlantData();
    getGrowthStatistics();
    getWeeklyGrowthData();
  }, [getAllPlantData, getGrowthStatistics, getWeeklyGrowthData]);

  return {
    // State
    plantData,
    growthStats,
    weeklyGrowthData,
    isLoading,
    error,
    
    // Actions
    getAllPlantData,
    getPlantDataById,
    createPlantData,
    updatePlantData,
    deletePlantData,
    getGrowthStatistics,
    getWeeklyGrowthData,
    updatePlantStage,
    updatePlantHealth,
    clearError
  };
}; 