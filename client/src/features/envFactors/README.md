# Environmental Factors Feature

This feature handles environmental sensor data including temperature, humidity, EC (Electrical Conductivity), CO2, and pH levels.

## Structure

```
envFactors/
├── components/
│   ├── EnvFactors.tsx      # Environmental factors display grid
│   ├── EnvConditions.tsx   # Temperature gauge component
│   └── index.ts           # Component exports
├── hooks/
│   ├── envFactors.hook.ts # Main hook for managing env factors data
│   └── index.ts          # Hook exports
├── services/
│   ├── envFactors.service.ts # API service for env factors
│   └── index.ts          # Service exports
└── index.ts              # Main feature exports
```

## Components

### EnvFactors
Displays a grid of environmental sensor readings (humidity, EC, pH, CO2) with icons and real-time values from the API.

### EnvConditions
Shows a temperature gauge with animated ticks and real-time temperature data from the API.

## Services

### EnvFactorsService
Handles all API calls for environmental sensor data:
- `getLatestReading()` - Get latest reading for a specific sensor
- `getAllLatestReadings()` - Get latest readings for all sensors
- `postSensorData()` - Post new sensor data
- `getHistoricalData()` - Get historical sensor data
- `getWeeklyStats()` - Get weekly statistics
- `deleteSensorReading()` - Delete a sensor reading

## Hooks

### useEnvFactors
Main hook that provides:
- **State**: `latestReadings`, `weeklyStats`, `isLoading`, `error`
- **Actions**: All service methods wrapped with error handling and loading states

## Usage

```tsx
import { EnvFactors, EnvConditions } from '../../features/envFactors';
import { useEnvFactors } from '../../features/envFactors';

// In a component
const { latestReadings, isLoading, error, getLatestReading } = useEnvFactors();
```

## API Integration

The feature integrates with the backend sensor API endpoints:
- `GET /api/sensors/:sensorType/latest` - Get latest reading
- `GET /api/sensors/all/latest` - Get all latest readings
- `POST /api/sensors/:sensorType/readings` - Post new reading
- `GET /api/sensors/:sensorType/readings` - Get historical data
- `GET /api/sensors/statistics/weekly` - Get weekly stats
- `DELETE /api/sensors/:sensorType/readings/:id` - Delete reading

## Sensor Types

Supported sensor types:
- `temperature` - Temperature readings (°C)
- `humidity` - Humidity readings (%)
- `ph` - pH level readings (pH)
- `ec` - Electrical conductivity (mS/cm)
- `co2` - CO2 levels (ppm)
- `solution-level` - Solution level (cm) 