const nodemailer = require('nodemailer');

const sendEmail = async (jobs) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let html = `<h2>📋 每日更新 - 长沙市医学检验招聘信息汇总</h2>`;
        html += `<p>本次共发现 <strong>${jobs.length}</strong> 条新职位：</p>`;
        html += `<ul>`;
        
        jobs.forEach((job, index) => {
            html += `
            <li style="margin: 15px 0; padding: 10px; border-bottom: 1px solid #eee;">
                <h3><a href="${job.url}" target="_blank" style="color: #1677ff;">${index + 1}. ${job.title}</a></h3>
                <p><strong>公司：</strong>${job.company}</p>
                <p><strong>地点：</strong>${job.location}</p>
                <p><strong>薪资：</strong>${job.salary}</p>
                <p><strong>来源：</strong>${job.source}</p>
            </li>
            `;
        });
        
        html += `</ul>`;
        html += `<p style="color: #999; font-size: 12px;">--- 本邮件由系统自动发送 ---</p>`;

        const info = await transporter.sendMail({
            from: `"医学检验招聘监测" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: `【每日更新】长沙市医学检验招聘信息汇总 (${jobs.length}条新职位)`,
            html: html
        });

        console.log('✅ 邮件发送成功:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ 邮件发送失败:', error.message);
        return false;
    }
};

module.exports = sendEmail;