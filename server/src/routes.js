const authRoutes = require('./routes/authRoutes');
const initializeRoutes=(app)=>{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/auth',authRoutes);
}
module.exports = initializeRoutes;