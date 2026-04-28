const express = require('express');
const CrawlLog = require('../models/CrawlLog');
const crawlAll = require('../utils/crawl');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log('🚀 手动触发爬取任务...');
        const result = await crawlAll();
        res.json({
            success: true,
            message: `爬取完成！共发现 ${result.total} 条职位，新增 ${result.new} 条`,
            data: result
        });
    } catch (error) {
        console.error('手动爬取失败:', error.message);
        res.status(500).json({ success: false, message: '爬取失败', error: error.message });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const logs = await CrawlLog.find().sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, data: logs });
    } catch (error) {
        console.error('获取爬取日志失败:', error.message);
        res.status(500).json({ success: false, message: '获取爬取日志失败' });
    }
});

module.exports = router;