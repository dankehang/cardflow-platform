const axios = require('axios');
const puppeteer = require('puppeteer');

const crawl51job = async () => {
    const jobs = [];
    try {
        const keyword = encodeURIComponent('医学检验');
        const url = `https://search.51job.com/list/180200,000000,0000,00,9,99,${keyword},2,1.html`;
        
        console.log(`前程无忧URL: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': 'https://www.51job.com/'
            },
            timeout: 10000
        });
        
        console.log(`前程无忧响应状态: ${response.status}`);
        
        const html = response.data;
        const jobItems = html.match(/<div[^>]*class="el"[^>]*>[\s\S]*?<\/div>/g) || [];
        
        console.log(`前程无忧匹配到 ${jobItems.length} 个职位项`);
        
        jobItems.forEach((item, index) => {
            const titleMatch = item.match(/<a[^>]*title="([^"]*)"[^>]*class="t1"/);
            const companyMatch = item.match(/<span class="t2"><a[^>]*>([^<]*)<\/a><\/span>/);
            const locationMatch = item.match(/<span class="t3">([^<]*)<\/span>/);
            const salaryMatch = item.match(/<span class="t4">([^<]*)<\/span>/);
            const urlMatch = item.match(/<a[^>]*href="([^"]*)"[^>]*class="t1"/);
            
            if (titleMatch && companyMatch) {
                jobs.push({
                    title: titleMatch[1].trim(),
                    company: companyMatch[1].trim(),
                    location: locationMatch ? locationMatch[1].trim() : '长沙',
                    salary: salaryMatch ? salaryMatch[1].trim() : '面议',
                    requirements: '',
                    description: '',
                    source: '前程无忧',
                    url: urlMatch ? urlMatch[1] : ''
                });
            }
        });
        console.log(`✅ 前程无忧爬取完成，共 ${jobs.length} 条职位`);
    } catch (error) {
        console.error('❌ 前程无忧爬取失败:', error.message);
    }
    return jobs;
};

module.exports = crawl51job;