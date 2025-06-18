const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');

const initializeRoutes=(app)=>{
    app.use('/api/auth',authRoutes);
    app.use('/api/sensors',sensorRoutes);
}
module.exports = initializeRoutes;