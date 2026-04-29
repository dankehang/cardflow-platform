const axios = require('axios');

const crawlZhaopin = async () => {
    const jobs = [];
    try {
        const keyword = encodeURIComponent('医学检验');
        const url = `https://fe-api.zhaopin.com/c/i/sou?pageSize=30&cityId=538&workExperience=-1&education=-1&companyType=-1&employmentType=-1&jobWelfareTag=-1&kw=${keyword}&kt=3`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': 'https://sou.zhaopin.com/',
                'Origin': 'https://sou.zhaopin.com'
            },
            timeout: 15000
        });
        
        if (response.data && response.data.data && response.data.data.results) {
            response.data.data.results.forEach(item => {
                if (item.jobName && item.company.name) {
                    jobs.push({
                        title: item.jobName,
                        company: item.company.name,
                        location: item.city.display || '长沙',
                        salary: item.salary || '面议',
                        requirements: item.positionDesc || '',
                        description: '',
                        source: '智联招聘',
                        url: `https://jobs.zhaopin.com/${item.number}.htm`
                    });
                }
            });
        }
        console.log(`✅ 智联招聘爬取完成，共 ${jobs.length} 条职位`);
    } catch (error) {
        console.error('❌ 智联招聘爬取失败:', error.message);
    }
    return jobs;
};

module.exports = crawlZhaopin;