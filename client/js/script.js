const API_BASE_URL = '/api';

let currentPage = 1;
let currentSearch = '';
let currentSource = 'all';
let currentSalary = 'all';

async function fetchJobs() {
    try {
        const url = `${API_BASE_URL}/jobs?page=${currentPage}&limit=10&search=${encodeURIComponent(currentSearch)}&source=${currentSource}&salary=${currentSalary}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            renderJobs(data.data);
            renderPagination(data.pagination);
        } else {
            console.error('获取职位列表失败:', data.message);
        }
    } catch (error) {
        console.error('获取职位列表失败:', error);
    }
}

async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/stats`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('total-count').textContent = data.data.total;
            document.getElementById('today-count').textContent = data.data.todayCount;
            renderSourceStats(data.data.sourceStats);
        }
    } catch (error) {
        console.error('获取统计数据失败:', error);
    }
}

function renderJobs(jobs) {
    const container = document.getElementById('jobs-list');
    container.innerHTML = '';
    
    if (jobs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">暂无职位数据</p>';
        return;
    }
    
    jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = `job-card${job.isNew ? ' new' : ''}`;
        card.addEventListener('click', () => showJobDetail(job));
        
        card.innerHTML = `
            <div class="job-header">
                <h3 class="job-title">${job.title}</h3>
                <span class="job-salary">${job.salary}</span>
            </div>
            <div class="job-meta">
                <span class="meta-item"><i class="fas fa-building"></i>${job.company}</span>
                <span class="meta-item"><i class="fas fa-map-marker-alt"></i>${job.location}</span>
            </div>
            <span class="job-source">${job.source}</span>
        `;
        
        container.appendChild(card);
    });
}

function renderSourceStats(stats) {
    const container = document.getElementById('source-stats');
    container.innerHTML = '';
    
    stats.forEach(stat => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <span class="stat-num">${stat.count}</span>
            <span class="stat-name">${stat._id}</span>
        `;
        container.appendChild(card);
    });
}

function renderPagination(pagination) {
    const container = document.getElementById('pagination');
    container.innerHTML = '';
    
    const { page, pages } = pagination;
    
    if (pages <= 1) return;
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '上一页';
    prevBtn.disabled = page === 1;
    prevBtn.addEventListener('click', () => {
        if (page > 1) {
            currentPage--;
            fetchJobs();
        }
    });
    container.appendChild(prevBtn);
    
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === page) btn.className = 'active';
        btn.addEventListener('click', () => {
            currentPage = i;
            fetchJobs();
        });
        container.appendChild(btn);
    }
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一页';
    nextBtn.disabled = page === pages;
    nextBtn.addEventListener('click', () => {
        if (page < pages) {
            currentPage++;
            fetchJobs();
        }
    });
    container.appendChild(nextBtn);
}

function showJobDetail(job) {
    const modal = document.getElementById('job-modal');
    const body = document.getElementById('modal-body');
    
    body.innerHTML = `
        <div class="detail-row">
            <span class="label">职位名称</span>
            <span class="value">${job.title}</span>
        </div>
        <div class="detail-row">
            <span class="label">公司名称</span>
            <span class="value">${job.company}</span>
        </div>
        <div class="detail-row">
            <span class="label">工作地点</span>
            <span class="value">${job.location}</span>
        </div>
        <div class="detail-row">
            <span class="label">薪资待遇</span>
            <span class="value">${job.salary}</span>
        </div>
        <div class="detail-row">
            <span class="label">职位来源</span>
            <span class="value">${job.source}</span>
        </div>
        <div class="detail-row">
            <span class="label">任职要求</span>
            <span class="value">${job.requirements || '暂无'}</span>
        </div>
        <div class="detail-row">
            <span class="label">职位描述</span>
            <span class="value">${job.description || '暂无'}</span>
        </div>
        <button class="apply-btn" onclick="window.open('${job.url}', '_blank')">前往应聘</button>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('job-modal').style.display = 'none';
}

document.getElementById('search-btn').addEventListener('click', () => {
    currentSearch = document.getElementById('search-input').value;
    currentPage = 1;
    fetchJobs();
});

document.getElementById('search-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        currentSearch = document.getElementById('search-input').value;
        currentPage = 1;
        fetchJobs();
    }
});

document.getElementById('source-filter').addEventListener('change', () => {
    currentSource = document.getElementById('source-filter').value;
    currentPage = 1;
    fetchJobs();
});

document.getElementById('salary-filter').addEventListener('change', () => {
    currentSalary = document.getElementById('salary-filter').value;
    currentPage = 1;
    fetchJobs();
});

document.getElementById('refresh-btn').addEventListener('click', async () => {
    const btn = document.getElementById('refresh-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/crawl`, { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            alert(data.message);
            fetchJobs();
            fetchStats();
        } else {
            alert('刷新失败: ' + data.message);
        }
    } catch (error) {
        alert('刷新失败: ' + error.message);
    }
    
    btn.innerHTML = '<i class="fas fa-refresh"></i> 手动刷新';
});

document.querySelector('.close-modal').addEventListener('click', closeModal);

document.getElementById('job-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('job-modal')) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
    fetchStats();
});