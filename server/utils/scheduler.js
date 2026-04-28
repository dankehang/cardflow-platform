const schedule = require('node-schedule');
const crawlAll = require('./crawl');

console.log('⏰ 定时任务已启动，每天中午12:00执行爬取');

const job = schedule.scheduleJob('0 12 * * *', async () => {
    console.log('🚀 开始执行定时爬取任务...');
    await crawlAll();
});

module.exports = job;