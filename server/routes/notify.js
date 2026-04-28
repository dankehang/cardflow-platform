const express = require('express');
const sendEmail = require('../utils/email');

const router = express.Router();

router.post('/test', async (req, res) => {
    try {
        const testJobs = [
            {
                title: '医学检验师',
                company: '长沙市第一人民医院',
                location: '长沙',
                salary: '8k-12k',
                source: '智联招聘',
                url: 'https://example.com/job/1'
            }
        ];
        
        const result = await sendEmail(testJobs);
        
        if (result) {
            res.json({ success: true, message: '测试邮件发送成功' });
        } else {
            res.status(500).json({ success: false, message: '测试邮件发送失败' });
        }
    } catch (error) {
        console.error('测试邮件发送失败:', error.message);
        res.status(500).json({ success: false, message: '测试邮件发送失败', error: error.message });
    }
});

module.exports = router;