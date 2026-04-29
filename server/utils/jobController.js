const Job = require('../models/Job');

const addJob = async (req, res) => {
    try {
        const { title, company, location, salary, requirements, description, source, url } = req.body;
        
        if (!title || !company) {
            return res.status(400).json({
                success: false, message: '职位标题和公司名称不能为空' });
        }

        const job = new Job({
            title,
            company,
            location: location || '长沙',
            salary: salary || '面议',
            requirements: requirements || '',
            description: description || '',
            source: source || '手动添加',
            url: url || ''
        });

        await job.save();
        res.json({
            success: true, message: '职位添加成功！', data: job });
    } catch (error) {
        res.status(500).json({
            success: false, message: '添加失败：' + error.message });
    }
};

module.exports = { addJob };