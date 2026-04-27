const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

console.log('正在尝试连接到MongoDB Atlas...');
console.log('连接字符串:', process.env.MONGO_URI || '未找到连接字符串');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cardflow')
  .then(() => {
    console.log('✅ MongoDB连接成功!');
    console.log('连接的主机:', mongoose.connection.host);
    console.log('连接的数据库:', mongoose.connection.name);
    
    // 测试创建一个简单的文档
    const testSchema = new mongoose.Schema({
      name: String,
      date: Date
    });
    const Test = mongoose.model('Test', testSchema);
    
    return Test.create({ name: '测试文档', date: new Date() });
  })
  .then(doc => {
    console.log('✅ 测试文档创建成功:', doc);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✅ MongoDB连接已关闭');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB连接错误:', err);
    console.error('错误名称:', err.name);
    console.error('错误消息:', err.message);
    console.error('错误堆栈:', err.stack);
    process.exit(1);
  });