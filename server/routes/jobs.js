const express = require('express');
const Job = require('../models/Job');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, search, location, source, salary } = req.query;
        
        let query = {};
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (location && location !== 'all') {
            query.location = { $regex: location, $options: 'i' };
        }
        
        if (source && source !== 'all') {
            query.source = source;
        }
        
        if (salary && salary !== 'all') {
            if (salary === 'high') {
                query.salary = { $regex: '10k|15k|20k|25k|30k', $options: 'i' };
            } else if (salary === 'medium') {
                query.salary = { $regex: '5k|6k|7k|8k|9k', $options: 'i' };
            } else if (salary === 'low') {
                query.salary = { $regex: '1k|2k|3k|4k', $options: 'i' };
            }
        }
        
        const total = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.json({
            success: true,
            data: jobs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('获取职位列表失败:', error.message);
        res.status(500).json({ success: false, message: '获取职位列表失败' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: '职位不存在' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        console.error('获取职位详情失败:', error.message);
        res.status(500).json({ success: false, message: '获取职位详情失败' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const total = await Job.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Job.countDocuments({ createdAt: { $gte: today } });
        
        const sourceStats = await Job.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);
        
        res.json({
            success: true,
            data: {
                total,
                todayCount,
                sourceStats
            }
        });
    } catch (error) {
        console.error('获取统计数据失败:', error.message);
        res.status(500).json({ success: false, message: '获取统计数据失败' });
    }
});

module.exports = router;