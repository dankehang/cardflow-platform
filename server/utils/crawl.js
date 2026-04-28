const Job = require('../models/Job');
const CrawlLog = require('../models/CrawlLog');
const crawlZhaopin = require('../crawlers/zhaopin');
const crawl51job = require('../crawlers/51job');
const crawlBoss = require('../crawlers/boss');
const sendEmail = require('./email');

const crawlAll = async () => {
    console.log('🔍 开始爬取所有招聘网站...');
    
    const crawlers = [
        { name: '智联招聘', crawl: crawlZhaopin },
        { name: '前程无忧', crawl: crawl51job },
        { name: 'Boss直聘', crawl: crawlBoss }
    ];

    let allJobs = [];
    let newJobs = [];

    for (const { name, crawl } of crawlers) {
        console.log(`🔄 正在爬取 ${name}...`);
        try {
            const jobs = await crawl();
            console.log(`✅ ${name} 爬取完成，共 ${jobs.length} 条职位`);
            allJobs = [...allJobs, ...jobs];

            for (const job of jobs) {
                try {
                    const existingJob = await Job.findOne({ url: job.url });
                    if (!existingJob) {
                        const newJob = new Job(job);
                        await newJob.save();
                        newJobs.push(job);
                    }
                } catch (error) {
                    if (error.code !== 11000) {
                        console.error('保存职位失败:', error.message);
                    }
                }
            }

            await CrawlLog.create({
                source: name,
                jobCount: jobs.length,
                newJobCount: jobs.length,
                status: 'success'
            });
        } catch (error) {
            console.error(`❌ ${name} 爬取失败:`, error.message);
            await CrawlLog.create({
                source: name,
                jobCount: 0,
                newJobCount: 0,
                status: 'failed',
                errorMessage: error.message
            });
        }
    }

    console.log(`📊 爬取完成！共发现 ${allJobs.length} 条职位，新增 ${newJobs.length} 条`);

    if (newJobs.length > 0 && process.env.EMAIL_USER && process.env.EMAIL_TO) {
        console.log('📧 正在发送邮件通知...');
        await sendEmail(newJobs);
    }

    return { total: allJobs.length, new: newJobs.length };
};

module.exports = crawlAll;