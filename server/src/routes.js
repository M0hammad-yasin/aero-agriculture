const authRoutes = require('./routes/authRoutes');
const initializeRoutes=(app)=>{
    app.use('/api/auth',async(req,res,next)=>{
        console.log("from server")
        next();
    },authRoutes);
}
module.exports = initializeRoutes;