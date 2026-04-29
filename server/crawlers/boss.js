const axios = require('axios');

const crawlBoss = async () => {
    const jobs = [];
    try {
        const keyword = encodeURIComponent('医学检验');
        const url = `https://www.zhipin.com/job_detail/?query=${keyword}&city=101250100`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cookie': '__zp_stoken__=test'
            },
            timeout: 15000
        });
        
        const html = response.data;
        const jobItems = html.match(/<li[^>]*ka="[^"]*"[^>]*>[\s\S]*?<\/li>/g) || [];
        
        jobItems.forEach(item => {
            const titleMatch = item.match(/<span class="job-name"[^>]*>([^<]*)<\/span>/);
            const companyMatch = item.match(/<a[^>]*ka="search-job-company"[^>]*>([^<]*)<\/a>/);
            const locationMatch = item.match(/<span class="job-area"[^>]*>([^<]*)<\/span>/);
            const salaryMatch = item.match(/<span class="salary"[^>]*>([^<]*)<\/span>/);
            const urlMatch = item.match(/<a[^>]*href="([^"]*)"[^>]*ka="search-job-item"/);
            
            if (titleMatch && companyMatch && urlMatch) {
                jobs.push({
                    title: titleMatch[1].trim(),
                    company: companyMatch[1].trim(),
                    location: locationMatch ? locationMatch[1].trim() : '长沙',
                    salary: salaryMatch ? salaryMatch[1].trim() : '面议',
                    requirements: '',
                    description: '',
                    source: 'Boss直聘',
                    url: 'https://www.zhipin.com' + urlMatch[1]
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