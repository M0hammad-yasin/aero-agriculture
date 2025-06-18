const {
  TemperatureData,
  HumidityData,
  PHData,
  ECData,
  CO2Data,
  SolLevelData
} = require('../models');

const sensorModels = {
  temperature: TemperatureData,
  humidity: HumidityData,
  ph: PHData,
  ec: ECData,
  co2: CO2Data,
  'solution-level': SolLevelData
};

const sensorUnits = {
  temperature: '°C',
  humidity: '%',
  ph: 'pH',
  ec: 'mS/cm',
  co2: 'ppm',
  'solution-level': 'cm'
};

exports.getLatestReading = async (req, res) => {
  const { sensorType } = req.params;
  const Model = sensorModels[sensorType];

  if (!Model) {
    return res.status(400).json({ data: null, error: 'Invalid sensor type', isSuccess: false });
  }

  const latestReading = await Model.findOne().sort({ timestamp: -1 }).limit(1);

  if (!latestReading) {
    return res.status(404).json({ data: null, error: 'No readings found for this sensor type', isSuccess: false });
  }

  const response = {
    id: latestReading._id,
    value: latestReading.value,
    timestamp: latestReading.timestamp.toISOString(),
    deviceId: latestReading.deviceId || 'default',
    unit: sensorUnits[sensorType]
  };

  res.status(200).json({ data: response, error: null, isSuccess: true });
};

exports.postSensorReading = async (req, res) => {
  const { sensorType } = req.params;
  const { value, deviceId } = req.body;

  const Model = sensorModels[sensorType];
  if (!Model) {
    return res.status(400).json({ data: null, error: 'Invalid sensor type', isSuccess: false });
  }

  if (value === undefined || value === null) {
    return res.status(400).json({ data: null, error: 'Value is required', isSuccess: false });
  }

  const newReading = new Model({
    value: parseFloat(value),
    deviceId: deviceId || 'default',
    timestamp: new Date()
  });

  const savedReading = await newReading.save();

  const response = {
    id: savedReading._id,
    value: savedReading.value,
    timestamp: savedReading.timestamp.toISOString(),
    deviceId: savedReading.deviceId || 'default',
    unit:  sensorUnits[sensorType]
  };

  res.status(201).json({ data: response, error: null, isSuccess: true });
};

exports.getHistoricalData = async (req, res) => {
  const { sensorType } = req.params;
  const { startDate, endDate, limit = 100 } = req.query;

  const Model = sensorModels[sensorType];
  if (!Model) {
    return res.status(400).json({ data: null, error: 'Invalid sensor type', isSuccess: false });
  }

  let query = {};
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const readings = await Model.find(query).sort({ timestamp: -1 }).limit(parseInt(limit));

  const response = readings.map(reading => ({
    id: reading._id,
    value: reading.value,
    timestamp: reading.timestamp.toISOString(),
    deviceId: reading.deviceId || 'default',
    unit: sensorUnits[sensorType]
  }));

  res.status(200).json({ data: response, error: null, isSuccess: true });
};

exports.getWeeklyStats = async (req, res) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const stats = {
    dates: [],
    temperature: [],
    humidity: [],
    ph: [],
    ec: [],
    co2: [],
    solutionLevel: []
  };

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(endDate.getDate() - i);
    date.setHours(0, 0, 0, 0);
    stats.dates.push(date.toISOString().split('T')[0]);
  }

  const sensorTypes = ['temperature', 'humidity', 'ph', 'ec', 'co2', 'solution-level'];
  const sensorKeys = ['temperature', 'humidity', 'ph', 'ec', 'co2', 'solutionLevel'];

  for (let i = 0; i < sensorTypes.length; i++) {
    const sensorType = sensorTypes[i];
    const sensorKey = sensorKeys[i];
    const Model = sensorModels[sensorType];

    for (let j = 0; j < 7; j++) {
      const dayStart = new Date();
      dayStart.setDate(endDate.getDate() - (6 - j));
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const readings = await Model.find({ timestamp: { $gte: dayStart, $lte: dayEnd } });

      if (readings.length > 0) {
        const average = readings.reduce((sum, reading) => sum + reading.value, 0) / readings.length;
        stats[sensorKey].push(Math.round(average * 100) / 100);
      } else {
        stats[sensorKey].push(0);
      }
    }
  }

  res.status(200).json({ data: stats, error: null, isSuccess: true });
};

exports.getAllLatestReadings = async (req, res) => {
  const allReadings = {};
  const sensorTypes = Object.keys(sensorModels);

  for (const sensorType of sensorTypes) {
    const Model = sensorModels[sensorType];
    const latestReading = await Model.findOne().sort({ timestamp: -1 }).limit(1);

    if (latestReading) {
      allReadings[sensorType] = {
        id: latestReading._id,
        value: latestReading.value,
        timestamp: latestReading.timestamp.toISOString(),
        deviceId: latestReading.deviceId || 'default',
        unit: sensorUnits[sensorType]
      };
    } else {
      allReadings[sensorType] = null;
    }
  }

  res.status(200).json({ data: allReadings, error: null, isSuccess: true });
};

exports.deleteSensorReading = async (req, res) => {
  const { sensorType, id } = req.params;
  const Model = sensorModels[sensorType];

  if (!Model) {
    return res.status(400).json({ data: null, error: 'Invalid sensor type', isSuccess: false });
  }

  const deletedReading = await Model.findByIdAndDelete(id);

  if (!deletedReading) {
    return res.status(404).json({ data: null, error: 'Reading not found', isSuccess: false });
  }

  res.status(200).json({ data: { message: 'Reading deleted successfully' }, error: null, isSuccess: true });
};
