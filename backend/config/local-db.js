const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// 启动本地MongoDB服务器
async function startLocalMongoDB() {
  // 如果已经启动了，就直接返回
  if (mongod) {
    console.log('ℹ️  本地MongoDB服务器已经在运行中');
    return;
  }
  
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('✅ 本地MongoDB服务器已启动');
    console.log('🔗 本地MongoDB连接字符串:', uri);
    
    // 更新环境变量
    process.env.MONGO_URI = uri;
    
    return uri;
  } catch (error) {
    console.error('❌ 启动本地MongoDB服务器失败:', error);
    throw error;
  }
}

// 停止本地MongoDB服务器
async function stopLocalMongoDB() {
  if (mongod) {
    await mongod.stop();
    mongod = null;
    console.log('✅ 本地MongoDB服务器已停止');
  }
}

module.exports = {
  startLocalMongoDB,
  stopLocalMongoDB
};