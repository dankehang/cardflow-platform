const puppeteer = require('puppeteer');

const crawl51job = async () => {
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
        
        const url = 'https://search.51job.com/list/180200,000000,0000,00,9,99,医学检验,2,1.html';
        console.log(`正在访问: ${url}`);
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForSelector('.joblist, #resultList', { timeout: 10000 }).catch(() => {});
        
        const jobList = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('.joblist .e, #resultList .el').forEach(card => {
                const titleEl = card.querySelector('.jobname a, .t1 a');
                const companyEl = card.querySelector('.company_name a, .t2 a');
                const locationEl = card.querySelector('.workarea, .t3');
                const salaryEl = card.querySelector('.wages, .t4');
                const linkEl = card.querySelector('a');
                
                if (titleEl && companyEl) {
                    items.push({
                        title: titleEl.textContent.trim(),
                        company: companyEl.textContent.trim(),
                        location: locationEl ? locationEl.textContent.trim() : '长沙',
                        salary: salaryEl ? salaryEl.textContent.trim() : '面议',
                        url: linkEl ? linkEl.href : ''
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
                    source: '前程无忧'
                });
            }
        });
        
        console.log(`✅ 前程无忧爬取完成，共 ${jobs.length} 条职位`);
    } catch (error) {
        console.error('❌ 前程无忧爬取失败:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    return jobs;
};

module.exports = crawl51job;