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

// 表单提交处理（如果有表单）
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 这里可以添加表单提交逻辑
        console.log('表单提交');
    });
});