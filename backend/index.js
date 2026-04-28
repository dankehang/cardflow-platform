const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();

// 中间件
const corsOptions = {
    origin: ['https://cardflow-platform-xpu2.vercel.app', 'https://cardflow-platform.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
const connectDB = require('./config/db');
connectDB();

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/designs', require('./routes/designs'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/pricing', require('./routes/pricing'));

// 健康检查
app.get('/', (req, res) => {
    res.json({ message: 'CardFlow Backend API' });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});