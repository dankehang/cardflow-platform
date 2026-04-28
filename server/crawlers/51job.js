const axios = require('axios');
const cheerio = require('cheerio');

const crawl51job = async () => {
    const jobs = [];
    try {
        const url = 'https://search.51job.com/list/180200,000000,0000,00,9,99,%E5%8C%BB%E5%AD%A6%E6%A3%80%E9%AA%8C,2,1.html';
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        $('.joblist li').each((index, element) => {
            const title = $(element).find('a').first().text().trim();
            const company = $(element).find('.cname').text().trim();
            const location = $(element).find('.workarea').text().trim();
            const salary = $(element).find('.salary').text().trim();
            const url = $(element).find('a').first().attr('href');
            
            if (title && company && url) {
                jobs.push({
                    title,
                    company,
                    location: location || '长沙',
                    salary: salary || '面议',
                    requirements: '',
                    description: '',
                    source: '前程无忧',
                    url
                });
            }
        });
    } catch (error) {
        console.error('前程无忧爬取失败:', error.message);
    }
    return jobs;
};

module.exports = crawl51job;