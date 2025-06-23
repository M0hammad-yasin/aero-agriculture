import { AxiosInstance } from 'axios';
import { 
  WeeklySensorStats
} from '../../../models/sensor.model';
import BaseApiService from '../../../services/api/baseApiServices';
import { ApiResponse } from '../../../models/auth-model';

/**
 * Plant Growth Data Interface
 */
export interface PlantGrowthData {
  id: string;
  plantType: string;
  currentStage: string;
  health: string;
  plantedDate: string;
  expectedHarvestDate: string;
  imageUrl?: string;
}

/**
 * Growth Statistics Interface
 */
export interface GrowthStatistics {
  totalPlants: number;
  healthyPlants: number;
  plantsInFlower: number;
  plantsReadyForHarvest: number;
  averageGrowthRate: number;
}

/**
 * Growth Service
 * Handles API calls for plant growth data and statistics
 */
class GrowthService extends BaseApiService<PlantGrowthData> {
  constructor(axios: AxiosInstance) {
    super(axios, '/growth');
  }

  /**
   * Get all plant growth data
   * @returns Promise with API response containing all plant data
   */
  async getAllPlantData(): Promise<ApiResponse<PlantGrowthData[]>> {
    return this.getAll();
  }

  /**
   * Get plant growth data by ID
   * @param id - Plant ID
   * @returns Promise with API response
   */
  async getPlantDataById(id: string): Promise<ApiResponse<PlantGrowthData>> {
    return this.getById(id);
  }

  /**
   * Create new plant growth record
   * @param plantData - Plant growth data
   * @returns Promise with API response
   */
  async createPlantData(plantData: Partial<PlantGrowthData>): Promise<ApiResponse<PlantGrowthData>> {
    return this.create(plantData);
  }

  /**
   * Update plant growth data
   * @param id - Plant ID
   * @param plantData - Updated plant data
   * @returns Promise with API response
   */
  async updatePlantData(id: string, plantData: Partial<PlantGrowthData>): Promise<ApiResponse<PlantGrowthData>> {
    return this.update(id, plantData);
  }

  /**
   * Delete plant growth data
   * @param id - Plant ID
   * @returns Promise with API response
   */
  async deletePlantData(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  /**
   * Get growth statistics
   * @returns Promise with API response containing growth statistics
   */
  async getGrowthStatistics(): Promise<ApiResponse<GrowthStatistics>> {
    return this.customGet<GrowthStatistics>('statistics');
  }

  /**
   * Get weekly growth data (environmental factors affecting growth)
   * @returns Promise with API response containing weekly sensor data
   */
  async getWeeklyGrowthData(): Promise<ApiResponse<WeeklySensorStats>> {
    return this.customGet<WeeklySensorStats>('weekly-data');
  }

  /**
   * Update plant stage
   * @param id - Plant ID
   * @param stage - New stage
   * @returns Promise with API response
   */
  async updatePlantStage(id: string, stage: string): Promise<ApiResponse<PlantGrowthData>> {
    return this.customPatch<{ stage: string }, PlantGrowthData>(`${id}/stage`, { stage });
  }

  /**
   * Update plant health status
   * @param id - Plant ID
   * @param health - Health status
   * @returns Promise with API response
   */
  async updatePlantHealth(id: string, health: string): Promise<ApiResponse<PlantGrowthData>> {
    return this.customPatch<{ health: string }, PlantGrowthData>(`${id}/health`, { health });
  }
}

export default GrowthService; 