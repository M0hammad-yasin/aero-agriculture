const express = require('express');
const router = express.Router();
const {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getGrowthStatistics,
  getWeeklyGrowthData,
  updatePlantStage,
  updatePlantHealth
} = require('../controllers/growthController');
const auth = require('../middleware/auth');
const asyncWrapper = require('../utils/asyncWrapper');

// All routes require authentication
router.use(auth);

// @route   GET api/growth
// @desc    Get all plants for the authenticated user
// @access  Private
router.get('/', asyncWrapper(getAllPlants));

// @route   GET api/growth/statistics
// @desc    Get growth statistics
// @access  Private
router.get('/statistics', asyncWrapper(getGrowthStatistics));

// @route   GET api/growth/weekly-data
// @desc    Get weekly growth data
// @access  Private
router.get('/weekly-data', asyncWrapper(getWeeklyGrowthData));

// @route   GET api/growth/:id
// @desc    Get a single plant by ID
// @access  Private
router.get('/:id', asyncWrapper(getPlantById));

// @route   POST api/growth
// @desc    Create a new plant
// @access  Private
router.post('/', asyncWrapper(createPlant));

// @route   PUT api/growth/:id
// @desc    Update a plant
// @access  Private
router.put('/:id', asyncWrapper(updatePlant));

// @route   DELETE api/growth/:id
// @desc    Delete a plant
// @access  Private
router.delete('/:id', asyncWrapper(deletePlant));

// @route   PATCH api/growth/:id/stage
// @desc    Update plant stage
// @access  Private
router.patch('/:id/stage', asyncWrapper(updatePlantStage));

// @route   PATCH api/growth/:id/health
// @desc    Update plant health
// @access  Private
router.patch('/:id/health', asyncWrapper(updatePlantHealth));

module.exports = router; 