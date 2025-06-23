import { WeeklySensorStats } from './sensor.model';
import { ApiResponse } from './auth-model';

/**
 * Plant growth stages
 */
export type PlantStage = 'Seed' | 'Sprout' | 'Veg' | 'Flower' | 'Harvest';

/**
 * Plant health status
 */
export type PlantHealth = 'Healthy' | 'Unhealthy' | 'Critical' | 'Unknown';

/**
 * Plant growth data interface
 */
export interface PlantGrowthData {
  _id: string;
  plantType: string;
  currentStage: PlantStage;
  health: PlantHealth;
  plantedDate: string;
  expectedHarvestDate: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Growth statistics interface
 */
export interface GrowthStatistics {
  totalPlants: number;
  healthyPlants: number;
  plantsInFlower: number;
  plantsReadyForHarvest: number;
  averageGrowthRate: number;
}

/**
 * Create plant request interface
 */
export interface CreatePlantRequest {
  plantType: string;
  currentStage?: PlantStage;
  health?: PlantHealth;
  plantedDate?: string;
  expectedHarvestDate: string;
  imageUrl?: string;
}

/**
 * Update plant request interface
 */
export interface UpdatePlantRequest extends Partial<CreatePlantRequest> {}

/**
 * Update plant stage request interface
 */
export interface UpdatePlantStageRequest {
  stage: PlantStage;
}

/**
 * Update plant health request interface
 */
export interface UpdatePlantHealthRequest {
  health: PlantHealth;
}


export interface PlantResponse extends ApiResponse<PlantGrowthData> {}
export interface PlantsResponse extends ApiResponse<PlantGrowthData[]> {}
export interface GrowthStatsResponse extends ApiResponse<GrowthStatistics> {}
export interface WeeklyGrowthResponse extends ApiResponse<WeeklySensorStats> {}

/**
 * Growth service interface
 */
export interface IGrowthService {
  getAllPlantData(): Promise<PlantsResponse>;
  getPlantDataById(id: string): Promise<PlantResponse>;
  createPlantData(data: CreatePlantRequest): Promise<PlantResponse>;
  updatePlantData(id: string, data: UpdatePlantRequest): Promise<PlantResponse>;
  deletePlantData(id: string): Promise<PlantResponse>;
  getGrowthStatistics(): Promise<GrowthStatsResponse>;
  getWeeklyGrowthData(): Promise<WeeklyGrowthResponse>;
  updatePlantStage(id: string, stage: PlantStage): Promise<PlantResponse>;
  updatePlantHealth(id: string, health: PlantHealth): Promise<PlantResponse>;
} 