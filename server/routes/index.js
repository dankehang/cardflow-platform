const express = require('express');
const Job = require('../models/Job');
const CrawlLog = require('../models/CrawlLog');
const crawlAll = require('../utils/crawl');
const sendEmail = require('../utils/email');
const { addJob } = require('../utils/jobController');

const router = express.Router();

router.get('/jobs', async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword, location, source, salary } = req.query;
        const query = {};
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' }
            ];
        }
        if (location) { location: { $regex: location, $options: 'i' } };
        if (source) query.source = source;
        if (salary) {
            query.salary = { $regex: salary, $options: 'i' } };
        
        const jobs = await Job.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit;
        const count = await Job.countDocuments(query);
        res.json({
            success: true, data: jobs, pagination: {
                page: parseInt(page), limit: parseInt(limit), total: count, pages: Math.ceil(count / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取失败：' + error.message });
    }
});

router.get('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: '职位不存在' });
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取失败：' + error.message });
    }
});

router.get('/jobs/stats', async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const todayJobs = await Job.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000 } });
        const statsBySource = await Job.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } }]);
        const statsByLocation = await Job.aggregate([{ $group: { _id: '$location', count: { $sum: 1 } }]);
        res.json({
            success: true, data: { total: totalJobs, todayNew: todayJobs, bySource: statsBySource, byLocation: statsByLocation } });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取失败：' + error.message });
    }
});

router.post('/jobs', addJob);

router.post('/crawl', async (req, res) => {
    try {
        const result = await crawlAll();
        res.json({
            success: true, message: `爬取完成！共发现 ${result.total} 条职位，新增 ${result.new} 条', data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: '爬取失败：' + error.message });
    }
});

router.get('/crawl/logs', async (req, res) => {
    try {
        const logs = await CrawlLog.find().sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取失败：' + error.message });
    }
});

router.post('/notify/test', async (req, res) => {
    try {
        const testJobs = [
            { title: '测试职位1', company: '测试公司1', location: '长沙', salary: '10k-15k', url: 'https://example.com/1' },
            { title: '测试职位2', company: '测试公司2', location: '长沙', salary: '8k-12k', url: 'https://example.com/2' }
        ];
        await sendEmail(testJobs);
        res.json({ success: true, message: '测试邮件已发送！' });
    } catch (error) {
        res.status(500).json({ success: false, message: '发送失败：' + error.message });
    }
});

module.exports = router;