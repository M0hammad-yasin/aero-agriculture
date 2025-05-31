const authRoutes = require('./routes/authRoutes');
const initializeRoutes=(app)=>{
    app.use('/api/auth',authRoutes);
}
module.exports = initializeRoutes;