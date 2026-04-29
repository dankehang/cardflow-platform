const puppeteer = require('puppeteer');

const crawlBoss = async () => {
    const jobs = [];
    let browser = null;
    
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        const url = 'https://www.zhipin.com/web/geek/job?query=医学检验&city=101250100';
        console.log(`正在访问: ${url}`);
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForSelector('.job-list-box', { timeout: 10000 }).catch(() => {});
        
        const jobList = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('.job-card-wrapper').forEach(card => {
                const titleEl = card.querySelector('.job-name');
                const companyEl = card.querySelector('.company-name a');
                const locationEl = card.querySelector('.job-area');
                const salaryEl = card.querySelector('.salary');
                const linkEl = card.querySelector('a');
                
                if (titleEl && companyEl) {
                    items.push({
                        title: titleEl.textContent.trim(),
                        company: companyEl.textContent.trim(),
                        location: locationEl ? locationEl.textContent.trim() : '长沙',
                        salary: salaryEl ? salaryEl.textContent.trim() : '面议',
                        url: linkEl ? 'https://www.zhipin.com' + linkEl.getAttribute('href') : ''
                    });
                }
            });
            return items;
        });
        
        jobList.forEach(job => {
            if (job.title && job.company && job.url) {
                jobs.push({
                    ...job,
                    requirements: '',
                    description: '',
                    source: 'Boss直聘'
                });
            }
        });
        
        console.log(`✅ Boss直聘爬取完成，共 ${jobs.length} 条职位`);
    } catch (error) {
        console.error('❌ Boss直聘爬取失败:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    return jobs;
};

module.exports = crawlBoss;