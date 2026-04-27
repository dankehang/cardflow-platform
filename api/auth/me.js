const { ensureDBConnected } = require('../_db');
const { User } = require('../_models');
const { auth } = require('../_middleware');

module.exports = async (req, res) => {
    // 确保数据库连接
    await ensureDBConnected(req, res, () => {});
    
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    // 认证中间件
    await new Promise((resolve, reject) => {
        auth(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
    
    try {
        // 获取用户信息
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};