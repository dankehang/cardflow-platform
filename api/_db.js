const mongoose = require('mongoose');

// 数据库连接
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cardflow');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// 确保数据库连接
const ensureDBConnected = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Database connection error' });
    }
};

module.exports = {
    connectDB,
    ensureDBConnected,
    mongoose
};