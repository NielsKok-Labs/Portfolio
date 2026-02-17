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
    '.project-card, .cert-card, .blog-card, .skill-item, .about-grid > *, .timeline-card'
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

// Back to top
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Project filter tabs
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const tags = [...card.querySelectorAll('.tag')].map(t => t.textContent.trim().toLowerCase());
            const match = filter === 'all' || tags.includes(filter.toLowerCase());

            if (match) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Contact netwerktopologie
const contactCanvas = document.getElementById('contactCanvas');
const contactCtx = contactCanvas.getContext('2d');

let contactNodes = [];
let contactMouse = { x: null, y: null };
const CONTACT_NODE_COUNT = 35;
const CONTACT_MAX_DIST = 120;

function resizeContactCanvas() {
    const parent = contactCanvas.parentElement;
    contactCanvas.width = parent.offsetWidth;
    contactCanvas.height = parent.offsetHeight;
}
function createContactNodes() {
    contactNodes = [];
    for (let i = 0; i < CONTACT_NODE_COUNT; i++) {
        contactNodes.push({
            x: Math.random() * contactCanvas.width,
            y: Math.random() * contactCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2.5 + 1.5,
        });
    }
}

function drawContactNetwork() {
    contactCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);

    const primaryColor = '99, 102, 241';
    const accentColor  = '139, 92, 246';

    for (let i = 0; i < contactNodes.length; i++) {
        for (let j = i + 1; j < contactNodes.length; j++) {
            const dx = contactNodes[i].x - contactNodes[j].x;
            const dy = contactNodes[i].y - contactNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONTACT_MAX_DIST) {
                const alpha = 1 - dist / CONTACT_MAX_DIST;
                contactCtx.beginPath();
                contactCtx.moveTo(contactNodes[i].x, contactNodes[i].y);
                contactCtx.lineTo(contactNodes[j].x, contactNodes[j].y);
                contactCtx.strokeStyle = `rgba(${primaryColor}, ${alpha * 0.6})`;
                contactCtx.lineWidth = 0.8;
                contactCtx.stroke();
            }
        }

        if (contactMouse.x && contactMouse.y) {
            const dx = contactNodes[i].x - contactMouse.x;
            const dy = contactNodes[i].y - contactMouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseRadius = 150;

            if (dist < mouseRadius) {
                const alpha = 1 - dist / mouseRadius;
                contactCtx.beginPath();
                contactCtx.moveTo(contactNodes[i].x, contactNodes[i].y);
                contactCtx.lineTo(contactMouse.x, contactMouse.y);
                contactCtx.strokeStyle = `rgba(${accentColor}, ${alpha * 0.9})`;
                contactCtx.lineWidth = 1;
                contactCtx.stroke();
            }
        }
    }

    contactNodes.forEach(node => {
        contactCtx.beginPath();
        contactCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        contactCtx.fillStyle = `rgba(${primaryColor}, 0.9)`;
        contactCtx.fill();
    });
}

function updateContactNodes() {
    contactNodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > contactCanvas.width)  node.vx *= -1;
        if (node.y < 0 || node.y > contactCanvas.height) node.vy *= -1;
    });
}

function animateContact() {
    updateContactNodes();
    drawContactNetwork();
    requestAnimationFrame(animateContact);
}

contactCanvas.addEventListener('mousemove', e => {
    const rect = contactCanvas.getBoundingClientRect();
    contactMouse.x = e.clientX - rect.left;
    contactMouse.y = e.clientY - rect.top;
});

contactCanvas.addEventListener('mouseleave', () => {
    contactMouse.x = null;
    contactMouse.y = null;
});

window.addEventListener('resize', () => {
    resizeContactCanvas();
    createContactNodes();
});

// Start pas als het canvas zichtbaar is
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            resizeContactCanvas();
            createContactNodes();
            animateContact();
            contactObserver.unobserve(entry.target);
        }
    });
});

contactObserver.observe(contactCanvas);

// Command palette
const paletteOverlay = document.getElementById('paletteOverlay');
const paletteInput   = document.getElementById('paletteInput');
const paletteResults = document.getElementById('paletteResults');

const paletteItems = [
    { label: 'About me',       sub: 'Who is Niels?',              href: '#about',        icon: '01' },
    { label: 'Projects',       sub: 'Projects', href: '#projects',     icon: '02' },
    { label: 'Certificates',   sub: 'Certifications',       href: '#certificates', icon: '03' },
    { label: 'Experience',     sub: 'Working experience',      href: '#timeline',  icon: '04' },
    { label: 'Blog',           sub: 'Recent posts',      href: '#blog',         icon: '06' },
    { label: 'Contact',        sub: 'Lets connect',           href: '#contact',      icon: '06' },
    { label: 'GitHub',         sub: 'github.com/NielsKok-Labs',    href: 'https://github.com/NielsKok-Labs', icon: 'GH' },
    { label: 'LinkedIn',       sub: 'linkedin.com/in/nielskoknl',  href: 'https://www.linkedin.com/in/nielskoknl', icon: 'IN' },
];

let selectedIndex = 0;
let filtered = [...paletteItems];

function openPalette() {
    paletteOverlay.classList.add('open');
    paletteInput.value = '';
    filtered = [...paletteItems];
    selectedIndex = 0;
    renderResults();
    setTimeout(() => paletteInput.focus(), 50);
}

function closePalette() {
    paletteOverlay.classList.remove('open');
}

function renderResults() {
    paletteResults.innerHTML = '';
    if (filtered.length === 0) {
        paletteResults.innerHTML = '<li style="color:var(--text-muted);padding:1rem;text-align:center;">Geen resultaten</li>';
        return;
    }
    filtered.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = i === selectedIndex ? 'selected' : '';
        li.innerHTML = `
            <div class="palette-result-icon">${item.icon}</div>
            <div class="palette-result-text">
                <strong>${item.label}</strong>
                <span>${item.sub}</span>
            </div>
        `;
        li.addEventListener('click', () => navigateTo(item));
        paletteResults.appendChild(li);
    });
}

function navigateTo(item) {
    closePalette();
    if (item.href.startsWith('#')) {
        const target = document.querySelector(item.href);
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    } else {
        window.open(item.href, '_blank');
    }
}

paletteInput.addEventListener('input', () => {
    const q = paletteInput.value.toLowerCase();
    filtered = paletteItems.filter(item =>
        item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
    );
    selectedIndex = 0;
    renderResults();
});

paletteInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
        renderResults();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        renderResults();
    } else if (e.key === 'Enter') {
        if (filtered[selectedIndex]) navigateTo(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
        closePalette();
    }
});

paletteOverlay.addEventListener('click', e => {
    if (e.target === paletteOverlay) closePalette();
});

document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        paletteOverlay.classList.contains('open') ? closePalette() : openPalette();
    }
});

// Terminal easter egg (Ctrl+T)
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalInput   = document.getElementById('terminalInput');
const terminalOutput  = document.getElementById('terminalOutput');
const terminalBody    = document.getElementById('terminalBody');
const terminalClose   = document.getElementById('terminalClose');

const commands = {
    help: () => `
<span class="term-info">Available commands:</span>
  <span class="term-cmd">whoami</span>        — wie ben ik?
  <span class="term-cmd">skills</span>        — technische skills
  <span class="term-cmd">experience</span>    — werkervaring
  <span class="term-cmd">certs</span>         — certificaten
  <span class="term-cmd">projects</span>      — projecten
  <span class="term-cmd">contact</span>       — contactgegevens
  <span class="term-cmd">social</span>        — social media links
  <span class="term-cmd">clear</span>         — terminal leegmaken
  <span class="term-cmd">sudo rm -rf /</span> — probeer het maar 😏
`,
    whoami: () => `
<span class="term-success">Niels Kok</span>
Role     : M365 Technical Consultant & Cloud Engineer
Location : Bunnik, Utrecht, Nederland
Focus    : Cloud · Security · Automation · Networking
Goal     : Cloud & Security Architect
`,
    skills: () => `
<span class="term-info">Technical Skills:</span>
  Cloud      → Azure, Microsoft 365, Terraform, Ansible
  Security   → Zero Trust, Conditional Access, Security Baselines
  Automation → CI/CD, Python, PowerShell, DevSecOps
  Network    → Segmentation, Firewalls, Hybrid Connectivity
  Tools      → Kubernetes, ArgoCD, Flux, Prometheus
`,
    experience: () => `
<span class="term-info">Work Experience:</span>
  <span class="term-success">2025–now </span> M365 Technical Consultant    @ XTRM Development
  <span class="term-warn">2025     </span> Security & Network Engineer  @ Conscia (stage)
  <span class="term-warn">2023–2024</span> Kubernetes Platform Engineer @ Anonify (stage)
  <span class="term-success">2021–2025</span> System Engineer              @ Stric
  <span class="term-success">2020–2021</span> Junior Sysadmin              @ Stric
  <span class="term-muted">2019     </span> Service Desk Consultant      @ Missing Piece BV
`,
    certs: () => `
<span class="term-info">Certificates:</span>
  ✅ AZ-900  — Azure Fundamentals
  ✅ SC-900  — Security Fundamentals
  ✅ MS-900  — Microsoft 365 Fundamentals
  ✅ AI-900  — Azure AI Fundamentals
  ✅ PL-900  — Power Platform Fundamentals
  ✅ ArgoCD  — Introduction
  🎯 Next    — AZ-104, AZ-500, AZ-700
`,
    projects: () => `
<span class="term-info">Projects:</span>
  [1] Azure Infrastructure Automation  — Terraform, IaC, VNets, NSGs
  [2] Network Security Lab             — Firewalls, VLANs, OT Security
  [3] Ansible Automation Playbooks     — Hardening, CI/CD, Deployments
`,
    contact: () => `
<span class="term-info">Contact:</span>
  GitHub   → github.com/NielsKok-Labs
  LinkedIn → linkedin.com/in/nielskoknl
`,
    social: () => `
<span class="term-info">Social:</span>
  🐙 GitHub   → <a href="https://github.com/NielsKok-Labs" target="_blank" style="color:#6366f1">github.com/NielsKok-Labs</a>
  💼 LinkedIn → <a href="https://www.linkedin.com/in/nielskoknl" target="_blank" style="color:#6366f1">linkedin.com/in/nielskoknl</a>
  ✈️  Travel   → <a href="https://www.polarsteps.com/nielskoknl" target="_blank" style="color:#6366f1">polarsteps.com/nielskoknl</a>
`,
    clear: () => {
        terminalOutput.innerHTML = '';
        return null;
    },
    'sudo rm -rf /': () => `<span class="term-error">Permission denied. Nice try. 😄</span>`,
};

let cmdHistory = [];
let historyIndex = -1;

function printOutput(html) {
    if (html === null) return;
    const p = document.createElement('p');
    p.className = 'term-line';
    p.innerHTML = html;
    terminalOutput.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();

    const typed = document.createElement('div');
    typed.className = 'term-typed-line';
    typed.innerHTML = `<span class="term-prompt">niels@portfolio:~$</span><span style="color:#e2e8f0">${raw}</span>`;
    terminalOutput.appendChild(typed);

    if (cmd === '') {
        terminalBody.scrollTop = terminalBody.scrollHeight;
        return;
    }

    if (commands[cmd] !== undefined) {
        const result = commands[cmd]();
        if (result !== null) printOutput(result);
    } else {
        printOutput(`<span class="term-error">command not found: ${raw}</span> — type <span class="term-cmd">help</span>`);
    }

    printOutput('');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function openTerminal() {
    terminalOverlay.classList.add('open');
    setTimeout(() => terminalInput.focus(), 50);
}

function closeTerminal() {
    terminalOverlay.classList.remove('open');
}

// Ctrl+T opent terminal
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        // Voorkom nieuw browser tabblad
        e.preventDefault();
        terminalOverlay.classList.contains('open') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && terminalOverlay.classList.contains('open')) {
        closeTerminal();
    }
});

// Sluit bij klik buiten modal of op rode dot
terminalOverlay.addEventListener('click', e => {
    if (e.target === terminalOverlay) closeTerminal();
});

terminalClose.addEventListener('click', closeTerminal);

// Terminal input
if (terminalInput) {
    terminalInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const val = terminalInput.value;
            cmdHistory.unshift(val);
            historyIndex = -1;
            runCommand(val);
            terminalInput.value = '';
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                terminalInput.value = cmdHistory[historyIndex];
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = cmdHistory[historyIndex];
            } else {
                historyIndex = -1;
                terminalInput.value = '';
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const partial = terminalInput.value.toLowerCase();
            const match = Object.keys(commands).find(c => c.startsWith(partial));
            if (match) terminalInput.value = match;
        }
    });

    terminalBody.addEventListener('click', () => terminalInput.focus());
}
