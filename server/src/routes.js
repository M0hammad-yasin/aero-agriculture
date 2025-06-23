const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const growthRoutes = require('./routes/growthRoutes');

const initializeRoutes=(app)=>{
    app.use('/api/auth',authRoutes);
    app.use('/api/sensors',sensorRoutes);
    app.use('/api/growth', growthRoutes);
}

module.exports = initializeRoutes;