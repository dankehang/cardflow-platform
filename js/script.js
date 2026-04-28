// 移动端菜单切换
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// 导航栏滚动效果
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 关闭移动端菜单
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// 按钮悬停效果
document.querySelectorAll('a[class*="bg-primary"]').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// 卡片悬停效果
document.querySelectorAll('.feature-card, .pricing-card, .card-type-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 定价方案选择
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    const button = card.querySelector('a');
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 这里可以添加选择定价方案的逻辑
        const planName = card.querySelector('h3').textContent;
        console.log(`选择了 ${planName}`);
        
        // 模拟选择效果
        pricingCards.forEach(c => c.classList.remove('ring-2', 'ring-primary'));
        card.classList.add('ring-2', 'ring-primary');
    });
});

// 卡类型查看
const cardTypeCards = document.querySelectorAll('.card-type-card');

cardTypeCards.forEach(card => {
    const button = card.querySelector('a');
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 这里可以添加查看卡类型详情的逻辑
        const cardTypeName = card.querySelector('h3').textContent;
        console.log(`查看 ${cardTypeName} 详情`);
    });
});

// 模态框功能
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const successModal = document.getElementById('success-modal');
const errorModal = document.getElementById('error-modal');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const closeModalBtns = document.querySelectorAll('.close-modal');

// 打开登录模态框
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

// 打开注册模态框
registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

// 切换到注册
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.add('hidden');
    registerModal.classList.remove('hidden');
});

// 切换到登录
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
});

// 关闭模态框
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        registerModal.classList.add('hidden');
        successModal.classList.add('hidden');
        errorModal.classList.add('hidden');
        document.body.style.overflow = '';
    });
});

// 点击模态框外部关闭
[loginModal, registerModal, successModal, errorModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
});

// API基础URL
// 开发环境
// const API_BASE_URL = 'http://localhost:5000/api';

// 生产环境（Railway后端）
const API_BASE_URL = 'https://cardflow-platform.up.railway.app/api';

// 显示成功提示
function showSuccess(title, message) {
    document.getElementById('success-title').textContent = title;
    document.getElementById('success-message').textContent = message;
    successModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// 显示错误提示
function showError(title, message) {
    document.getElementById('error-title').textContent = title;
    document.getElementById('error-message').textContent = message;
    errorModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// 登录表单提交
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 存储token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showSuccess('登录成功', '欢迎回来！');
                
                // 登录成功后关闭模态框并刷新页面
                setTimeout(() => {
                    loginModal.classList.add('hidden');
                    document.body.style.overflow = '';
                    // 这里可以添加页面跳转逻辑
                    window.location.reload();
                }, 1500);
            } else {
                showError('登录失败', data.message || '邮箱或密码错误');
            }
        } catch (error) {
            showError('登录失败', '网络错误，请稍后重试');
            console.error('Login error:', error);
        }
    });
}

// 注册表单提交
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const company = document.getElementById('register-company').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, company })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 存储token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showSuccess('注册成功', '欢迎加入CardFlow！');
                
                // 注册成功后关闭模态框并刷新页面
                setTimeout(() => {
                    registerModal.classList.add('hidden');
                    document.body.style.overflow = '';
                    // 这里可以添加页面跳转逻辑
                    window.location.reload();
                }, 1500);
            } else {
                showError('注册失败', data.message || '注册失败，请稍后重试');
            }
        } catch (error) {
            showError('注册失败', '网络错误，请稍后重试');
            console.error('Register error:', error);
        }
    });
}

// 检查用户登录状态
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // 用户已登录，更新导航栏
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        
        if (loginBtn && registerBtn) {
            loginBtn.textContent = '个人中心';
            registerBtn.textContent = '退出登录';
            
            // 退出登录功能
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            });
        }
    }
}

// 页面加载时检查登录状态
window.addEventListener('load', checkLoginStatus);