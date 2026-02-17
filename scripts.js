// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// Smooth scroll voor anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Intersection Observer voor fade-in animaties
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll(
    '.project-card, .cert-card, .blog-card, .skill-item, .about-grid > *'
);

animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Counter animatie voor stats
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const strong = entry.target.querySelector('strong');
            const endValue = parseInt(strong.textContent);
            animateValue(strong, 0, endValue, 2000);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        
        submitButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Verzenden...';
        submitButton.disabled = true;

        setTimeout(() => {
            alert('✅ Bericht verzonden! Ik neem zo snel mogelijk contact met je op.');
            contactForm.reset();
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }, 1500);
    });
}

// Active nav link op basis van scroll positie
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Parallax effect voor gradient orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.3 + (index * 0.1);
        orb.style.transform = `translate(-50%, -50%) translateY(${scrolled * speed}px)`;
    });
});

// Code typing animation
const codeElements = document.querySelectorAll('.code-content code span');
codeElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.animation = `fadeIn 0.1s ease forwards ${index * 0.05}s`;
});

// Extra styles via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        to { opacity: 1; }
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .nav-menu a.active {
        color: var(--primary);
    }

    .nav-menu a.active::after {
        width: 100%;
    }

    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 1px solid var(--border);
            box-shadow: var(--shadow);
        }

        [data-theme="dark"] .nav-menu.active {
            background: rgba(15, 23, 42, 0.98);
        }

        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }

    .project-card {
        position: relative;
        overflow: hidden;
    }

    .project-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s ease;
    }

    .project-card:hover::before {
        left: 100%;
    }

    .scroll-indicator {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-10px); }
    }

    ::selection {
        background: var(--primary);
        color: white;
    }

    *:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

document.head.appendChild(style);

// Console easter egg
console.log('%c👋 Hey developer!', 'font-size: 24px; color: #6366f1; font-weight: bold;');
console.log('%c🚀 Nice to see you checking the code!', 'font-size: 14px; color: #8b5cf6;');
console.log('%c📧 Want to work together? Hit me up!', 'font-size: 12px; color: #475569;');

// Performance monitoring
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.loadTime > 3000) {
                console.warn('Slow loading asset:', entry.name);
            }
        }
    });
    perfObserver.observe({ entryTypes: ['resource'] });
}
