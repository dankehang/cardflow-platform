const axios = require('axios');
const cheerio = require('cheerio');

const crawlBoss = async () => {
    const jobs = [];
    try {
        const url = 'https://www.zhipin.com/job_detail/?query=医学检验&city=101250100';
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        $('.job-list li').each((index, element) => {
            const title = $(element).find('.job-name').text().trim();
            const company = $(element).find('.company-name').text().trim();
            const location = $(element).find('.job-area').text().trim();
            const salary = $(element).find('.salary').text().trim();
            const url = 'https://www.zhipin.com' + $(element).find('.job-name a').attr('href');
            
            if (title && company && url) {
                jobs.push({
                    title,
                    company,
                    location: location || '长沙',
                    salary: salary || '面议',
                    requirements: '',
                    description: '',
                    source: 'Boss直聘',
                    url
                });
            }
        });
    } catch (error) {
        console.error('Boss直聘爬取失败:', error.message);
    }
    return jobs;
};

module.exports = crawlBoss;