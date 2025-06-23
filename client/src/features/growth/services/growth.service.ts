import { 
  WeeklySensorStats,
  PlantGrowthData,
  GrowthStatistics,
  IGrowthService,
  PlantResponse,
  PlantsResponse,
  GrowthStatsResponse,
  WeeklyGrowthResponse,
  CreatePlantRequest,
  UpdatePlantRequest,
  PlantStage,
  PlantHealth
} from '../../../models';
import {BaseApiService,axiosInstance} from '../../../services/api';

/**
 * Growth Service
 * Handles API calls for plant growth data and statistics
 */
class GrowthService extends BaseApiService<PlantGrowthData> implements IGrowthService {
  constructor() {
    super(axiosInstance, '/growth');
  }

  /**
   * Get all plant growth data
   * @returns Promise with API response containing all plant data
   */
  async getAllPlantData(): Promise<PlantsResponse> {
    const response = await this.getAll();
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response as PlantsResponse;
  }

  /**
   * Get plant growth data by ID
   * @param id - Plant ID
   * @returns Promise with API response
   */
  async getPlantDataById(id: string): Promise<PlantResponse> {
    const response = await this.getById(id);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response as PlantResponse;
  }

  /**
   * Create new plant growth record
   * @param plantData - Plant growth data
   * @returns Promise with API response
   */
  async createPlantData(plantData: CreatePlantRequest): Promise<PlantResponse> {
    const response = await this.create(plantData);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response as PlantResponse;
  }

  /**
   * Update plant growth data
   * @param id - Plant ID
   * @param plantData - Updated plant data
   * @returns Promise with API response
   */
  async updatePlantData(id: string, plantData: UpdatePlantRequest): Promise<PlantResponse> {
    const response = await this.update(id, plantData);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response as PlantResponse;
  }

  /**
   * Delete plant growth data
   * @param id - Plant ID
   * @returns Promise with API response
   */
  async deletePlantData(id: string):Promise<PlantResponse>{
    const response = await this.delete(id);
    return response;
  }

  /**
   * Get growth statistics
   * @returns Promise with API response containing growth statistics
   */
  async getGrowthStatistics(): Promise<GrowthStatsResponse> {
    const response = await this.customGet<GrowthStatistics>('statistics');
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response ;
  }

  /**
   * Get weekly growth data (environmental factors affecting growth)
   * @returns Promise with API response containing weekly sensor data
   */
  async getWeeklyGrowthData(): Promise<WeeklyGrowthResponse> {
    const response = await this.customGet<WeeklySensorStats>('weekly-data');
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response as WeeklyGrowthResponse;
  }

  /**
   * Update plant stage
   * @param id - Plant ID
   * @param stage - New stage
   * @returns Promise with API response
   */
  async updatePlantStage(id: string, stage: PlantStage): Promise<PlantResponse> {
    const response = await this.customPatch<{ stage: PlantStage }, PlantGrowthData>(`${id}/stage`, { stage });
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response as PlantResponse;
  }

  /**
   * Update plant health status
   * @param id - Plant ID
   * @param health - Health status
   * @returns Promise with API response
   */
  async updatePlantHealth(id: string, health: PlantHealth): Promise<PlantResponse> {
    const response = await this.customPatch<{ health: PlantHealth }, PlantGrowthData>(`${id}/health`, { health });
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response as PlantResponse;
  }
}

export default GrowthService; 