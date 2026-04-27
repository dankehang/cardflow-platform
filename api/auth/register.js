const { ensureDBConnected } = require('../_db');
const { User } = require('../_models');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    // 确保数据库连接
    await ensureDBConnected(req, res, () => {});
    
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    try {
        const { name, email, password, company } = req.body;
        
        // 验证输入
        if (!name || !email || !password || !company) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // 检查用户是否已存在
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // 创建新用户
        user = new User({ name, email, password, company });
        await user.save();
        
        // 生成JWT token
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '30d' });
        
        // 返回用户信息和token
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                company: user.company,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};