const crawlMock = async () => {
    const jobs = [
        {
            title: '医学检验师',
            company: '长沙市第一人民医院',
            location: '长沙-开福区',
            salary: '8k-12k',
            requirements: '医学检验专业，本科及以上学历，持有检验师资格证',
            description: '负责临床检验工作，包括血液、尿液、生化等检验项目',
            source: '智联招聘',
            url: 'https://jobs.zhaopin.com/mock1.htm'
        },
        {
            title: '检验科主管',
            company: '湖南省人民医院',
            location: '长沙-芙蓉区',
            salary: '15k-20k',
            requirements: '医学检验专业，硕士及以上学历，5年以上工作经验',
            description: '负责检验科日常管理工作，质量控制和人员培训',
            source: '前程无忧',
            url: 'https://search.51job.com/mock2'
        },
        {
            title: '临床检验技师',
            company: '长沙市中心医院',
            location: '长沙-雨花区',
            salary: '6k-10k',
            requirements: '医学检验专业，大专及以上学历，有检验技师证优先',
            description: '从事临床检验工作，包括常规检验、生化检验等',
            source: 'Boss直聘',
            url: 'https://www.zhipin.com/mock3'
        },
        {
            title: '医学检验员',
            company: '长沙金域医学检验所',
            location: '长沙-岳麓区',
            salary: '5k-8k',
            requirements: '医学检验专业，大专及以上学历',
            description: '负责第三方医学检验工作',
            source: '智联招聘',
            url: 'https://jobs.zhaopin.com/mock4.htm'
        },
        {
            title: '检验科主任',
            company: '中南大学湘雅医院',
            location: '长沙-开福区',
            salary: '20k-30k',
            requirements: '医学检验专业，博士学历，10年以上工作经验，高级职称',
            description: '负责检验科全面管理，学科建设，科研教学',
            source: '前程无忧',
            url: 'https://search.51job.com/mock5'
        },
        {
            title: 'PCR检验员',
            company: '长沙迪安医学检验中心',
            location: '长沙-高新区',
            salary: '7k-12k',
            requirements: '医学检验专业，持有PCR上岗证',
            description: '负责核酸检测等分子诊断工作',
            source: 'Boss直聘',
            url: 'https://www.zhipin.com/mock6'
        },
        {
            title: '病理检验技师',
            company: '湖南省肿瘤医院',
            location: '长沙-岳麓区',
            salary: '10k-15k',
            requirements: '病理检验专业，本科及以上学历',
            description: '负责病理标本检验和诊断辅助工作',
            source: '智联招聘',
            url: 'https://jobs.zhaopin.com/mock7.htm'
        },
        {
            title: '输血科技师',
            company: '长沙市第三医院',
            location: '长沙-天心区',
            salary: '8k-12k',
            requirements: '医学检验专业，有输血技术资格证',
            description: '负责血库管理和输血检验工作',
            source: '前程无忧',
            url: 'https://search.51job.com/mock8'
        }
    ];
    
    console.log(`✅ 模拟数据生成完成，共 ${jobs.length} 条职位`);
    return jobs;
};

module.exports = crawlMock;