const axios = require('axios');
const cheerio = require('cheerio');

const crawlZhaopin = async () => {
    const jobs = [];
    try {
        const url = 'https://sou.zhaopin.com/?jl=538&kw=医学检验&kt=3';
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        $('.joblist-box__item').each((index, element) => {
            const title = $(element).find('.joblist-box__item-title').text().trim();
            const company = $(element).find('.joblist-box__item-company').text().trim();
            const location = $(element).find('.joblist-box__item-workcity').text().trim();
            const salary = $(element).find('.joblist-box__item-salary').text().trim();
            const url = $(element).find('.joblist-box__item-title').attr('href');
            
            if (title && company && url) {
                jobs.push({
                    title,
                    company,
                    location: location || '长沙',
                    salary: salary || '面议',
                    requirements: '',
                    description: '',
                    source: '智联招聘',
                    url
                });
            }
        });
    } catch (error) {
        console.error('智联招聘爬取失败:', error.message);
    }
    return jobs;
};

module.exports = crawlZhaopin;