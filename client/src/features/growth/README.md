# Growth Feature

This feature manages plant growth data, including plant stages, health status, and growth statistics.

## Structure

```
growth/
├── components/
│   ├── PlantGrowth.tsx    # Plant growth stage management
│   ├── GrowthStats.tsx    # Growth statistics charts
│   └── index.ts          # Component exports
├── hooks/
│   ├── growth.hook.ts    # Main hook for managing growth data
│   └── index.ts         # Hook exports
├── services/
│   ├── growth.service.ts # API service for growth data
│   └── index.ts         # Service exports
└── index.ts             # Main feature exports
```

## Components

### PlantGrowth
Manages plant growth stages with interactive controls to advance plants through their lifecycle (Seed → Sprout → Veg → Flower → Harvest).

### GrowthStats
Displays growth statistics using charts showing environmental factors over time that affect plant growth.

## Services

### GrowthService
Handles all API calls for plant growth data:
- `getAllPlantData()` - Get all plant data
- `getPlantDataById()` - Get specific plant data
- `createPlantData()` - Create new plant record
- `updatePlantData()` - Update plant data
- `deletePlantData()` - Delete plant data
- `getGrowthStatistics()` - Get growth statistics
- `getWeeklyGrowthData()` - Get weekly growth data
- `updatePlantStage()` - Update plant stage
- `updatePlantHealth()` - Update plant health status

## Hooks

### useGrowth
Main hook that provides:
- **State**: `plantData`, `growthStats`, `weeklyGrowthData`, `isLoading`, `error`
- **Actions**: All service methods wrapped with error handling and loading states

## Usage

```tsx
import { PlantGrowth, GrowthStats } from '../../features/growth';
import { useGrowth } from '../../features/growth';

// In a component
const { plantData, isLoading, error, updatePlantStage } = useGrowth();
```

## Data Models

### PlantGrowthData
```typescript
interface PlantGrowthData {
  id: string;
  plantType: string;
  currentStage: string;
  health: string;
  plantedDate: string;
  expectedHarvestDate: string;
  imageUrl?: string;
}
```

### GrowthStatistics
```typescript
interface GrowthStatistics {
  totalPlants: number;
  healthyPlants: number;
  plantsInFlower: number;
  plantsReadyForHarvest: number;
  averageGrowthRate: number;
}
```

## Plant Stages

Plants progress through these stages:
1. **Seed** - Initial planting stage
2. **Sprout** - Germination and early growth
3. **Veg** - Vegetative growth phase
4. **Flower** - Flowering and fruiting phase
5. **Harvest** - Ready for harvest

## API Integration

The feature integrates with the backend growth API endpoints:
- `GET /api/growth` - Get all plant data
- `GET /api/growth/:id` - Get specific plant data
- `POST /api/growth` - Create new plant
- `PUT /api/growth/:id` - Update plant data
- `DELETE /api/growth/:id` - Delete plant
- `GET /api/growth/statistics` - Get growth statistics
- `GET /api/growth/weekly-data` - Get weekly growth data
- `PATCH /api/growth/:id/stage` - Update plant stage
- `PATCH /api/growth/:id/health` - Update plant health

## Features

- **Real-time Data**: Components automatically fetch and display the latest data
- **Interactive Controls**: Users can advance plant stages through the UI
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Loading spinners and states for better UX
- **Responsive Design**: Components adapt to different screen sizes 