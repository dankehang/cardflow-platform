const axios = require('axios');
const puppeteer = require('puppeteer');

const crawlBoss = async () => {
    const jobs = [];
    try {
        const keyword = encodeURIComponent('医学检验');
        const url = `https://www.zhipin.com/web/geek/job?query=${keyword}&city=101250100`;
        
        console.log(`Boss直聘URL: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': 'https://www.zhipin.com/'
            },
            timeout: 10000
        });
        
        console.log(`Boss直聘响应状态: ${response.status}`);
        
        const html = response.data;
        const jobItems = html.match(/<li[^>]*class="job-card-wrapper"[^>]*>[\s\S]*?<\/li>/g) || [];
        
        console.log(`Boss直聘匹配到 ${jobItems.length} 个职位项`);
        
        jobItems.forEach(item => {
            const titleMatch = item.match(/<span[^>]*class="job-name"[^>]*>([^<]*)<\/span>/);
            const companyMatch = item.match(/<a[^>]*class="company-name"[^>]*>([^<]*)<\/a>/);
            const locationMatch = item.match(/<span[^>]*class="job-area"[^>]*>([^<]*)<\/span>/);
            const salaryMatch = item.match(/<span[^>]*class="salary"[^>]*>([^<]*)<\/span>/);
            const urlMatch = item.match(/<a[^>]*href="([^"]*)"[^>]*ka="search-job-item"/);
            
            if (titleMatch && companyMatch) {
                jobs.push({
                    title: titleMatch[1].trim(),
                    company: companyMatch[1].trim(),
                    location: locationMatch ? locationMatch[1].trim() : '长沙',
                    salary: salaryMatch ? salaryMatch[1].trim() : '面议',
                    requirements: '',
                    description: '',
                    source: 'Boss直聘',
                    url: urlMatch ? 'https://www.zhipin.com' + urlMatch[1] : ''
                });
            }
        });
        console.log(`✅ Boss直聘爬取完成，共 ${jobs.length} 条职位`);
    } catch (error) {
        console.error('❌ Boss直聘爬取失败:', error.message);
    }
    return jobs;
};

module.exports = crawlBoss;