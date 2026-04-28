const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 正在尝试连接到MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB连接成功! 主机: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB();