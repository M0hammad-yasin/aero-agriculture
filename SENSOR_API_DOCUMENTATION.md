# Sensor API Documentation

This document describes the sensor API endpoints for the AeroAgriculture application.

## Base URL
```
/api/sensors
```

## Supported Sensor Types
- `temperature` - Temperature sensors (°C)
- `humidity` - Humidity sensors (%)
- `ph` - pH sensors (pH)
- `ec` - Electrical Conductivity sensors (mS/cm)
- `co2` - CO2 sensors (ppm)
- `solution-level` - Solution level sensors (cm)

## API Response Format
All API responses follow this structure:
```json
{
  "data": any | null,
  "error": string | null,
  "isSuccess": boolean
}
```

## Endpoints

### 1. Get Latest Reading for Specific Sensor Type
**GET** `/api/sensors/:sensorType/latest`

**Parameters:**
- `sensorType` (path): One of the supported sensor types

**Response:**
```json
{
  "data": {
    "id": "string",
    "value": number,
    "timestamp": "ISO string",
    "deviceId": "string",
    "unit": "string"
  },
  "error": null,
  "isSuccess": true
}
```

**Example:**
```bash
GET /api/sensors/temperature/latest
```

### 2. Post New Sensor Reading
**POST** `/api/sensors/:sensorType/readings`

**Parameters:**
- `sensorType` (path): One of the supported sensor types

**Request Body:**
```json
{
  "value": number,
  "deviceId": "string" (optional, defaults to "default"),
  "unit": "string" (optional, uses default unit for sensor type)
}
```

**Response:**
```json
{
  "data": {
    "id": "string",
    "value": number,
    "timestamp": "ISO string",
    "deviceId": "string",
    "unit": "string"
  },
  "error": null,
  "isSuccess": true
}
```

**Example:**
```bash
POST /api/sensors/temperature/readings
Content-Type: application/json

{
  "value": 25.5,
  "deviceId": "sensor-001"
}
```

### 3. Get Historical Sensor Data
**GET** `/api/sensors/:sensorType/readings`

**Parameters:**
- `sensorType` (path): One of the supported sensor types

**Query Parameters:**
- `startDate` (optional): Start date in ISO format
- `endDate` (optional): End date in ISO format
- `limit` (optional): Maximum number of readings to return (default: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "value": number,
      "timestamp": "ISO string",
      "deviceId": "string",
      "unit": "string"
    }
  ],
  "error": null,
  "isSuccess": true
}
```

**Example:**
```bash
GET /api/sensors/temperature/readings?startDate=2024-01-01&endDate=2024-01-31&limit=50
```

### 4. Get Weekly Statistics for All Sensors
**GET** `/api/sensors/statistics/weekly`

**Response:**
```json
{
  "data": {
    "dates": ["2024-01-01", "2024-01-02", ...],
    "temperature": [25.5, 26.1, ...],
    "humidity": [65.2, 67.8, ...],
    "ph": [6.5, 6.7, ...],
    "ec": [1.2, 1.3, ...],
    "co2": [400, 420, ...],
    "solutionLevel": [15.5, 14.8, ...]
  },
  "error": null,
  "isSuccess": true
}
```

**Example:**
```bash
GET /api/sensors/statistics/weekly
```

### 5. Get Latest Readings for All Sensor Types
**GET** `/api/sensors/all/latest`

**Response:**
```json
{
  "data": {
    "temperature": {
      "id": "string",
      "value": number,
      "timestamp": "ISO string",
      "deviceId": "string",
      "unit": "°C"
    },
    "humidity": {
      "id": "string",
      "value": number,
      "timestamp": "ISO string",
      "deviceId": "string",
      "unit": "%"
    },
    // ... other sensor types
  },
  "error": null,
  "isSuccess": true
}
```

**Example:**
```bash
GET /api/sensors/all/latest
```

### 6. Delete Sensor Reading
**DELETE** `/api/sensors/:sensorType/readings/:id`

**Parameters:**
- `sensorType` (path): One of the supported sensor types
- `id` (path): MongoDB ObjectId of the reading to delete

**Response:**
```json
{
  "data": {
    "message": "Reading deleted successfully"
  },
  "error": null,
  "isSuccess": true
}
```

**Example:**
```bash
DELETE /api/sensors/temperature/readings/507f1f77bcf86cd799439011
```

## Error Responses

### 400 Bad Request
```json
{
  "data": null,
  "error": "Invalid sensor type",
  "isSuccess": false
}
```

### 404 Not Found
```json
{
  "data": null,
  "error": "No readings found for this sensor type",
  "isSuccess": false
}
```

### 500 Internal Server Error
```json
{
  "data": null,
  "error": "Server error while fetching data",
  "isSuccess": false
}
```

## Database Schema

Each sensor type has its own MongoDB collection with the following schema:

```javascript
{
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  deviceId: { type: String, default: 'default' }
}
```

## Usage Examples

### JavaScript/TypeScript (Frontend)
```typescript
// Get latest temperature reading
const response = await fetch('/api/sensors/temperature/latest');
const data = await response.json();

// Post new humidity reading
const response = await fetch('/api/sensors/humidity/readings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    value: 65.5,
    deviceId: 'humidity-sensor-01'
  })
});

// Get historical pH data
const response = await fetch('/api/sensors/ph/readings?startDate=2024-01-01&limit=100');
const data = await response.json();
```

### cURL Examples
```bash
# Get latest CO2 reading
curl -X GET http://localhost:3000/api/sensors/co2/latest

# Post new EC reading
curl -X POST http://localhost:3000/api/sensors/ec/readings \
  -H "Content-Type: application/json" \
  -d '{"value": 1.5, "deviceId": "ec-sensor-01"}'

# Get weekly statistics
curl -X GET http://localhost:3000/api/sensors/statistics/weekly
```

## Notes

1. All timestamps are stored and returned in ISO 8601 format
2. The `deviceId` field allows tracking readings from multiple devices of the same sensor type
3. Default units are automatically assigned based on sensor type
4. Historical data is returned in descending order (newest first)
5. Weekly statistics show daily averages for the past 7 days
6. All endpoints are currently public (no authentication required)