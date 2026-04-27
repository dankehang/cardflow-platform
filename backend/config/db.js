const mongoose = require('mongoose');
const { startLocalMongoDB } = require('./local-db');

const connectDB = async () => {
  try {
    // 首先尝试连接到MongoDB Atlas
    console.log('🔗 正在尝试连接到MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB连接成功! 主机: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.error('❌ MongoDB Atlas连接失败:', error.message);
    
    // 如果MongoDB Atlas连接失败，尝试启动本地MongoDB
    try {
      console.log('🔄 正在启动本地MongoDB服务器...');
      await startLocalMongoDB();
      
      // 连接到本地MongoDB
      console.log('🔗 正在连接到本地MongoDB...');
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ 本地MongoDB连接成功! 主机: ${conn.connection.host}`);
    } catch (localError) {
      console.error('❌ 本地MongoDB也连接失败:', localError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;