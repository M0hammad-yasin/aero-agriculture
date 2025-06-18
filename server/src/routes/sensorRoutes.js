const express = require('express');
const router = express.Router();
const {
  getLatestReading,
  postSensorReading,
  getHistoricalData,
  getWeeklyStats,
  getAllLatestReadings,
  deleteSensorReading
} = require('../controllers/sensorController');
const asyncWrapper = require('../utils/asyncWrapper');

// @route   GET api/sensors/statistics/weekly
// @desc    Get weekly statistics for all sensors
// @access  Public
router.get('/statistics/weekly', asyncWrapper(getWeeklyStats));

// @route   GET api/sensors/all/latest
// @desc    Get latest readings for all sensor types
// @access  Public
router.get('/all/latest', asyncWrapper(getAllLatestReadings));

// @route   GET api/sensors/:sensorType/latest
// @desc    Get latest reading for a specific sensor type
// @access  Public
// @params  sensorType: temperature | humidity | ph | ec | co2 | solution-level
router.get('/:sensorType/latest', asyncWrapper(getLatestReading));

// @route   POST api/sensors/:sensorType/readings
// @desc    Post new sensor reading
// @access  Public
// @params  sensorType: temperature | humidity | ph | ec | co2 | solution-level
// @body    { value: number, deviceId?: string, unit?: string }
router.post('/:sensorType/readings', asyncWrapper(postSensorReading));

// @route   GET api/sensors/:sensorType/readings
// @desc    Get historical sensor data
// @access  Public
// @params  sensorType: temperature | humidity | ph | ec | co2 | solution-level
// @query   startDate?: string, endDate?: string, limit?: number
router.get('/:sensorType/readings', asyncWrapper(getHistoricalData));

// @route   DELETE api/sensors/:sensorType/readings/:id
// @desc    Delete a specific sensor reading
// @access  Public
// @params  sensorType: temperature | humidity | ph | ec | co2 | solution-level
// @params  id: string (MongoDB ObjectId)
router.delete('/:sensorType/readings/:id', asyncWrapper(deleteSensorReading));

module.exports = router;