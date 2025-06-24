const Growth = require('../models/Growth');
const AppError = require('../utils/appError');

// Get all plants for a user
const getAllPlants = async (req, res) => {
  const plants = await Growth.find();
  res.json({
    status: 200,
    isSuccess: true,
    data: plants
  });
};

// Get a single plant by ID
const getPlantById = async (req, res) => {
  const plant = await Growth.findById(req.params.id);
  if (!plant) {
    throw new AppError('Plant not found', 404);
  }
  res.json({
    status: 200,
    isSuccess: true,
    data: plant
  });
};

// Create a new plant
const createPlant = async (req, res) => {
  const plant = await Growth.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json({
    status: 201,
    isSuccess: true,
    data: plant
  });
};

// Update a plant
const updatePlant = async (req, res) => {
  const plant = await Growth.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!plant) {
    throw new AppError('Plant not found', 404);
  }
  res.json({
    status: 200,
    isSuccess: true,
    data: plant
  });
};

// Delete a plant
const deletePlant = async (req, res) => {
  const plant = await Growth.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!plant) {
    throw new AppError('Plant not found', 404);
  }
  res.json({
    status: 200,
    isSuccess: true,
    data: null
  });
};

// Get growth statistics
const getGrowthStatistics = async (req, res) => {
  const plants = await Growth.find();
  
  const stats = {
    totalPlants: plants.length,
    healthyPlants: plants.filter(p => p.health === 'Healthy').length,
    plantsInFlower: plants.filter(p => p.currentStage === 'Flower').length,
    plantsReadyForHarvest: plants.filter(p => p.currentStage === 'Harvest').length,
    averageGrowthRate: 0 // This would need a more complex calculation based on your requirements
  };

  res.json({
    status: 200,
    isSuccess: true,
    data: stats
  });
};

// Get weekly growth data
const getWeeklyGrowthData = async (req, res) => {
  // Get the start of the current week
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // Aggregate sensor data for the week
  const [temperatureData, humidityData, phData, ecData, co2Data] = await Promise.all([
    req.app.get('models').TemperatureData.find({ timestamp: { $gte: startDate } }),
    req.app.get('models').HumidityData.find({ timestamp: { $gte: startDate } }),
    req.app.get('models').PHData.find({ timestamp: { $gte: startDate } }),
    req.app.get('models').ECData.find({ timestamp: { $gte: startDate } }),
    req.app.get('models').CO2Data.find({ timestamp: { $gte: startDate } })
  ]);

  // Process the data into the required format
  const dates = [...new Set([
    ...temperatureData.map(d => d.timestamp.toISOString().split('T')[0]),
    ...humidityData.map(d => d.timestamp.toISOString().split('T')[0]),
    ...phData.map(d => d.timestamp.toISOString().split('T')[0]),
    ...ecData.map(d => d.timestamp.toISOString().split('T')[0]),
    ...co2Data.map(d => d.timestamp.toISOString().split('T')[0])
  ])].sort();

  const weeklyData = {
    dates,
    humidity: dates.map(date => {
      const dayData = humidityData.filter(d => 
        d.timestamp.toISOString().split('T')[0] === date
      );
      return dayData.length ? Math.round(dayData.reduce((acc, curr) => acc + curr.value, 0) / dayData.length) : null;
    }),
    ph: dates.map(date => {
      const dayData = phData.filter(d => 
        d.timestamp.toISOString().split('T')[0] === date
      );
      return dayData.length ? Number((dayData.reduce((acc, curr) => acc + curr.value, 0) / dayData.length).toFixed(2)) : null;
    }),
    ec: dates.map(date => {
      const dayData = ecData.filter(d => 
        d.timestamp.toISOString().split('T')[0] === date
      );
      return dayData.length ? Number((dayData.reduce((acc, curr) => acc + curr.value, 0) / dayData.length).toFixed(2)) : null;
    }),
    co2: dates.map(date => {
      const dayData = co2Data.filter(d => 
        d.timestamp.toISOString().split('T')[0] === date
      );
      return dayData.length ? Math.round(dayData.reduce((acc, curr) => acc + curr.value, 0) / dayData.length) : null;
    })
  };

  res.json({
    status: 200,
    isSuccess: true,
    data: weeklyData
  });
};

// Update plant stage
const updatePlantStage = async (req, res) => {

  const { stage } = req.body;
  if (!['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'].includes(stage)) {
    throw new AppError('Invalid plant stage', 400);
  }

  const plant = await Growth.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { currentStage: stage },
    { new: true, runValidators: true }
  );

  if (!plant) {
    throw new AppError('Plant not found', 404);
  }

  res.json({
    status: 200,
    isSuccess: true,
    data: plant
  });
};

// Update plant health
const updatePlantHealth = async (req, res) => {
  const { health } = req.body;
  const plant = await Growth.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { health },
    { new: true, runValidators: true }
  );

  if (!plant) {
    throw new AppError('Plant not found', 404);
  }

  res.json({
    status: 200,
    isSuccess: true,
    data: plant
  });
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getGrowthStatistics,
  getWeeklyGrowthData,
  updatePlantStage,
  updatePlantHealth
}; 