// script.js — portfolio main script

// ─── Helpers ──────────────────────────────────────────────────────────────────
function el(id)   { return document.getElementById(id); }
function qs(sel)  { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

// ─── Dark mode ────────────────────────────────────────────────────────────────
const themeToggle = el('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
}

// ─── Smooth scroll ────────────────────────────────────────────────────────────
qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = qs(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ─── Mobile menu ──────────────────────────────────────────────────────────────
const menuToggle = qs('.menu-toggle');
const navMenu    = qs('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
    qsa('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ─── Navbar scroll shadow ─────────────────────────────────────────────────────
const navbar = qs('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 50
            ? '0 2px 10px rgba(0,0,0,0.1)'
            : 'none';
    }, { passive: true });
}

// ─── Fade-in observer ─────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function observeCards() {
    qsa('.project-card, .cert-card, .blog-card, .skill-item, .about-grid > *, .timeline-card')
        .forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.2s ease ${i * 0.05}s, transform 0.2s ease ${i * 0.05}s`;
            observer.observe(el);
        });
}

// ─── Terug naar boven ──────────────────────────────────────────────────────────────
const backToTop = el('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Active nav on scroll ─────────────────────────────────────────────────────
const sections = qsa('section[id]');
const navLinks  = qsa('.nav-menu a');
if (sections.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (pageYOffset >= s.offsetTop - 100) current = s.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href')?.slice(1) === current);
        });
    }, { passive: true });
}

// ─── Stats counter ────────────────────────────────────────────────────────────
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.classList.contains('counted')) return;
        const strong = entry.target.querySelector('strong');
        if (!strong) return;
        const end = parseInt(strong.textContent);
        if (isNaN(end)) return;
        entry.target.classList.add('counted');
        let startTs = null;
        const step = ts => {
            if (!startTs) startTs = ts;
            const p = Math.min((ts - startTs) / 2000, 1);
            strong.textContent = Math.floor(p * end) + (p < 1 ? '' : '');
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}, { threshold: 0.5 });
qsa('.stat').forEach(s => statsObserver.observe(s));

// ─── Parallax orbs ───────────────────────────────────────────────────────────
const orbs = qsa('.gradient-orb');
if (orbs.length) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        orbs.forEach((orb, i) => {
            orb.style.transform = `translate(-50%, -50%) translateY(${scrolled * (0.3 + i * 0.1)}px)`;
        });
    }, { passive: true });
}

// ─── Code typing animation ────────────────────────────────────────────────────
qsa('.code-content code span').forEach((span, i) => {
    span.style.opacity = '0';
    span.style.animation = `fadeIn 0.1s ease forwards ${i * 0.05}s`;
});

// ══════════════════════════════════════════════════════════════════════════════
// ─── DYNAMIC PROJECT CARDS ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// SVG illustrations per project image key
const PROJECT_IMAGES = {
    spo: `
        <div class="placeholder-image" style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#0ea5e9 100%);width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#spo-bg)"/>
                <line x1="0" y1="55" x2="400" y2="55" stroke="white" stroke-opacity="0.08"/>
                <line x1="0" y1="110" x2="400" y2="110" stroke="white" stroke-opacity="0.08"/>
                <line x1="0" y1="165" x2="400" y2="165" stroke="white" stroke-opacity="0.08"/>
                <rect x="30" y="38" width="200" height="12" rx="3" fill="white" fill-opacity="0.15"/>
                <rect x="244" y="38" width="50" height="12" rx="3" fill="#10b981" fill-opacity="0.7"/>
                <rect x="30" y="60" width="170" height="12" rx="3" fill="white" fill-opacity="0.15"/>
                <rect x="244" y="60" width="50" height="12" rx="3" fill="#10b981" fill-opacity="0.7"/>
                <rect x="30" y="82" width="220" height="12" rx="3" fill="white" fill-opacity="0.15"/>
                <rect x="244" y="82" width="50" height="12" rx="3" fill="#f59e0b" fill-opacity="0.7"/>
                <rect x="30" y="104" width="190" height="12" rx="3" fill="white" fill-opacity="0.15"/>
                <rect x="244" y="104" width="50" height="12" rx="3" fill="#10b981" fill-opacity="0.7"/>
                <rect x="30" y="126" width="160" height="12" rx="3" fill="white" fill-opacity="0.15"/>
                <rect x="244" y="126" width="50" height="12" rx="3" fill="#10b981" fill-opacity="0.7"/>
                <rect x="300" y="70" width="70" height="70" rx="14" fill="white" fill-opacity="0.08"/>
                <text x="335" y="114" font-size="28" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">⚙</text>
                <defs>
                    <linearGradient id="spo-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#6366f1"/>
                        <stop offset="100%" stop-color="#0ea5e9"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    homeassistant: `
        <svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="90" fill="#03A9F4"/>
            <polygon points="256,120 110,240 150,240 150,380 362,380 362,240 402,240" fill="white"/>
            <rect x="226" y="300" width="60" height="80" fill="#03A9F4"/>
        </svg>`,

    network: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 300" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="300" fill="url(#net-bg)"/>
                <rect x="100" y="80" width="80" height="140" rx="8" fill="white" fill-opacity="0.15"/>
                <rect x="220" y="80" width="80" height="140" rx="8" fill="white" fill-opacity="0.15"/>
                <path d="M140 150 L200 120 L260 150" stroke="white" stroke-width="4" opacity="0.3"/>
                <circle cx="200" cy="120" r="15" fill="white" fill-opacity="0.25"/>
                <defs>
                    <linearGradient id="net-bg" x1="0" y1="0" x2="400" y2="300">
                        <stop offset="0%" stop-color="#10b981"/>
                        <stop offset="100%" stop-color="#059669"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    ansible: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 300" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="300" fill="url(#ans-bg)"/>
                <circle cx="200" cy="80" r="40" fill="white" fill-opacity="0.15"/>
                <rect x="100" y="140" width="200" height="100" rx="8" fill="white" fill-opacity="0.15"/>
                <path d="M150 180 L170 200 L230 140" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
                <defs>
                    <linearGradient id="ans-bg" x1="0" y1="0" x2="400" y2="300">
                        <stop offset="0%" stop-color="#3b82f6"/>
                        <stop offset="100%" stop-color="#1d4ed8"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`
};

const STATUS_LABELS = {
    completed: { label: 'Afgerond', color: '#10b981' },
    active:    { label: 'Actief',   color: '#6366f1' },
    wip:       { label: 'In uitvoering', color: '#f59e0b' }
};

function buildProjectCard(project) {
    const image    = PROJECT_IMAGES[project.image] || PROJECT_IMAGES['ansible'];
    const status   = STATUS_LABELS[project.status] || STATUS_LABELS['active'];
    const linkText = project.linkType === 'repo' ? 'Bekijk repo' : 'Lees meer';
    const linkIcon = project.linkType === 'repo'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;

    const linkTarget = project.linkType === 'repo' ? ' target="_blank" rel="noopener noreferrer"' : '';

    const tagsHtml = project.tags.map(t =>
        `<span class="tag" data-tag="${t}">${t}</span>`
    ).join('');

    return `
        <article class="project-card" data-tags="${project.tags.join(',').toLowerCase()}" data-id="${project.id}">
            <div class="project-image">${image}</div>
            <div class="project-content">
                <div class="project-tags">${tagsHtml}</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-links">
                    <a href="${project.link}" class="project-link"${linkTarget}>
                        ${linkIcon}
                        ${linkText}
                    </a>
                </div>
            </div>
        </article>`;
}

function buildViewAllCard() {
    return `
        <article class="project-card project-card--view-all" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;min-height:300px;border-style:dashed;">
            <div style="margin-bottom:1.5rem;opacity:0.4;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="3" width="8" height="8" rx="1"/>
                    <rect x="14" y="3" width="8" height="8" rx="1"/>
                    <rect x="2" y="13" width="8" height="8" rx="1"/>
                    <rect x="14" y="13" width="8" height="8" rx="1"/>
                </svg>
            </div>
            <h3 style="margin-bottom:0.75rem;">Alle projecten</h3>
            <p style="font-size:0.95rem;margin-bottom:1.5rem;">Labs, client werk en open source — bekijk het volledige overzicht.</p>
            <a href="projects.html" class="project-link" style="font-size:1rem;">
                Bekijk alle projecten
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                </svg>
            </a>
        </article>`;
}

// ─── Filter logic (shared) ────────────────────────────────────────────────────
let allProjects  = [];
let activeFilter = 'all';

function applyFilter(filter, grid, isHomePage) {
    activeFilter = filter;

    // update button states
    qsa('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        btn.setAttribute('aria-selected', btn.getAttribute('data-filter') === filter);
    });

    const matched = filter === 'all'
        ? allProjects
        : allProjects.filter(p => p.tags.map(t => t.toLowerCase()).includes(filter.toLowerCase()));

    renderProjectsToGrid(grid, matched, isHomePage);
}

function renderProjectsToGrid(grid, projects, isHomePage) {
    const MAX_HOME = 2;
    const toShow   = isHomePage ? projects.slice(0, MAX_HOME) : projects;

    let html = toShow.map(buildProjectCard).join('');
    if (isHomePage) html += buildViewAllCard();

    grid.innerHTML = html;
    observeCards();
}

function initFilters(grid, isHomePage) {
    qsa('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyFilter(btn.getAttribute('data-filter'), grid, isHomePage);
        });
    });
}

// ─── Bootstrap projects on index.html ────────────────────────────────────────
const homeGrid = el('projectsGrid');
if (homeGrid) {
    fetch('projects.json')
        .then(r => r.json())
        .then(data => {
            allProjects = data;
            renderProjectsToGrid(homeGrid, data, true);
            initFilters(homeGrid, true);
        })
        .catch(() => {
            homeGrid.innerHTML = '<p style="color:var(--text-secondary);padding:1rem;">Projecten konden niet worden geladen.</p>';
        });
}

// ─── Bootstrap projects on projects.html ─────────────────────────────────────
const allGrid = el('allProjectsGrid');
if (allGrid) {
    fetch('projects.json')
        .then(r => r.json())
        .then(data => {
            allProjects = data;
            renderProjectsToGrid(allGrid, data, false);
            initFilters(allGrid, false);
        })
        .catch(() => {
            allGrid.innerHTML = '<p style="color:var(--text-secondary);padding:1rem;">Projecten konden niet worden geladen.</p>';
        });
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── CONTACT CANVAS ───────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const contactCanvas = el('contactCanvas');
if (contactCanvas) {
    const contactCtx = contactCanvas.getContext('2d');
    let contactNodes = [];
    let contactMouse = { x: null, y: null };
    const NODE_COUNT = 35;
    const MAX_DIST   = 120;

    function resizeContactCanvas() {
        const parent = contactCanvas.parentElement;
        contactCanvas.width  = parent.offsetWidth;
        contactCanvas.height = parent.offsetHeight;
    }

    function createContactNodes() {
        contactNodes = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * contactCanvas.width,
            y: Math.random() * contactCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2.5 + 1.5,
        }));
    }

    function drawContactNetwork() {
        contactCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
        const primary = '99,102,241';
        const accent  = '139,92,246';

        for (let i = 0; i < contactNodes.length; i++) {
            for (let j = i + 1; j < contactNodes.length; j++) {
                const dx   = contactNodes[i].x - contactNodes[j].x;
                const dy   = contactNodes[i].y - contactNodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    contactCtx.beginPath();
                    contactCtx.strokeStyle = `rgba(${primary},${(1 - dist / MAX_DIST) * 0.3})`;
                    contactCtx.lineWidth   = 1;
                    contactCtx.moveTo(contactNodes[i].x, contactNodes[i].y);
                    contactCtx.lineTo(contactNodes[j].x, contactNodes[j].y);
                    contactCtx.stroke();
                }
            }
        }

        contactNodes.forEach(node => {
            let r = node.radius;
            let color = primary;
            if (contactMouse.x !== null) {
                const dx   = node.x - contactMouse.x;
                const dy   = node.y - contactMouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) { r *= 1.5; color = accent; }
            }
            contactCtx.beginPath();
            contactCtx.arc(node.x, node.y, r, 0, Math.PI * 2);
            contactCtx.fillStyle = `rgba(${color},0.7)`;
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
    contactCanvas.addEventListener('mouseleave', () => { contactMouse.x = null; contactMouse.y = null; });
    window.addEventListener('resize', () => { resizeContactCanvas(); createContactNodes(); });

    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resizeContactCanvas();
                createContactNodes();
                animateContact();
                entry.target._canvasObserver?.unobserve(entry.target);
            }
        });
    }).observe(contactCanvas);
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const paletteOverlay = el('paletteOverlay');
const paletteInput   = el('paletteInput');
const paletteResults = el('paletteResults');

if (paletteOverlay && paletteInput && paletteResults) {
    const paletteItems = [
        { label: 'Over mij',     sub: 'Wie is Niels?',              href: '#about',        icon: '01' },
        { label: 'Projecten',    sub: 'Projecten & Labs',            href: '#projects',     icon: '02' },
        { label: 'Certificaten', sub: 'Certificeringen',             href: '#certificates', icon: '03' },
        { label: 'Ervaring',     sub: 'Werkervaring',         href: '#timeline',     icon: '04' },
        { label: 'Blog',         sub: 'Recente posts',               href: '#blog',         icon: '05' },
        { label: 'Contact',      sub: 'Neem contact op',             href: '#contact',      icon: '06' },
        { label: 'GitHub',       sub: 'github.com/NielsKok-Labs',   href: 'https://github.com/NielsKok-Labs', icon: 'GH' },
        { label: 'LinkedIn',     sub: 'linkedin.com/in/nielskoknl', href: 'https://www.linkedin.com/in/nielskoknl', icon: 'IN' },
    ];

    let selectedIndex = 0;
    let filtered = [...paletteItems];

    const openPalette  = () => { paletteOverlay.classList.add('open'); paletteInput.value = ''; filtered = [...paletteItems]; selectedIndex = 0; renderPalette(); setTimeout(() => paletteInput.focus(), 50); };
    const closePalette = () => paletteOverlay.classList.remove('open');

    function renderPalette() {
        paletteResults.innerHTML = '';
        if (!filtered.length) {
            paletteResults.innerHTML = '<li style="color:var(--text-muted);padding:1rem;text-align:center;">Geen resultaten</li>';
            return;
        }
        filtered.forEach((item, i) => {
            const li = document.createElement('li');
            li.className = i === selectedIndex ? 'selected' : '';
            li.innerHTML = `<div class="palette-result-icon">${item.icon}</div><div class="palette-result-text"><strong>${item.label}</strong><span>${item.sub}</span></div>`;
            li.addEventListener('click', () => navigatePalette(item));
            paletteResults.appendChild(li);
        });
    }

    function navigatePalette(item) {
        closePalette();
        if (item.href.startsWith('#')) {
            const target = qs(item.href);
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        } else {
            window.open(item.href, '_blank');
        }
    }

    paletteInput.addEventListener('input', () => {
        const q = paletteInput.value.toLowerCase();
        filtered = paletteItems.filter(i => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q));
        selectedIndex = 0;
        renderPalette();
    });

    paletteInput.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1); renderPalette(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); renderPalette(); }
        else if (e.key === 'Enter') { if (filtered[selectedIndex]) navigatePalette(filtered[selectedIndex]); }
        else if (e.key === 'Escape') closePalette();
    });

    paletteOverlay.addEventListener('click', e => { if (e.target === paletteOverlay) closePalette(); });
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); paletteOverlay.classList.contains('open') ? closePalette() : openPalette(); }
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── TERMINAL EASTER EGG ──────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const terminalOverlay = el('terminalOverlay');
const terminalInput   = el('terminalInput');
const terminalOutput  = el('terminalOutput');
const terminalBody    = el('terminalBody');
const terminalClose   = el('terminalClose');

if (terminalOverlay && terminalInput && terminalOutput && terminalBody && terminalClose) {
    const commands = {
        help: () => `<span class="term-info">Beschikbare commando's:</span>
  <span class="term-cmd">whoami</span>        — who is Niels?
  <span class="term-cmd">skills</span>        — technical skills
  <span class="term-cmd">experience</span>    — work experience
  <span class="term-cmd">certs</span>         — certifications
  <span class="term-cmd">projects</span>      — projects
  <span class="term-cmd">contact</span>       — contact information
  <span class="term-cmd">social</span>        — social media links
  <span class="term-cmd">clear</span>         — empty terminal
  <span class="term-cmd">sudo rm -rf /</span> — try it! 😏`,
        whoami: () => `<span class="term-success">Niels Kok</span>
Rol      : M365 Technical Consultant & Cloud Engineer
Locatie  : Bunnik, Utrecht, Nederland
Focus    : Cloud · Security · Automatisering · Netwerken`,
        skills: () => `<span class="term-info">Technische vaardigheden:</span>
  Cloud      → Azure, Microsoft 365, Terraform, Ansible
  Security   → Zero Trust, Conditional Access, Purview
  Automation → CI/CD, Python, PowerShell, DevSecOps
  Network    → Segmentation, Firewalls, Hybrid Connectivity`,
        experience: () => `<span class="term-info">Werkervaring:</span>
  <span class="term-success">2025–now </span> M365 Technical Consultant    @ XTRM Development
  <span class="term-warn">2025     </span> Security & Network Engineer  @ Conscia (stage)
  <span class="term-warn">2023–2024</span> Kubernetes Platform Engineer @ Anonify (stage)
  <span class="term-success">2021–2025</span> System Engineer              @ Stric
  <span class="term-success">2020–2021</span> Junior Sysadmin              @ Stric`,
        certs: () => `<span class="term-info">Certificaten:</span>
  ✅ AZ-900  — Azure Fundamentals
  ✅ SC-900  — Security Fundamentals
  ✅ MS-900  — Microsoft 365 Fundamentals
  ✅ AI-900  — Azure AI Fundamentals
  🎯 Next    — AZ-104, AZ-500, AZ-700`,
        projects: () => `<span class="term-info">Projecten:</span>
  [1] Waterschap Metadata Migratie  — PowerShell, SPO, PnP
  [2] Self-Hosted Smart Home        — Docker, Home Assistant, VPN
  [3] Network Security Lab          — Firewalls, VLANs, OT Security
  [4] Ansible Automation Playbooks  — Hardening, CI/CD`,
        contact: () => `<span class="term-info">Contact:</span>
  GitHub   → github.com/NielsKok-Labs
  LinkedIn → linkedin.com/in/nielskoknl`,
        social: () => `<span class="term-info">Socials:</span>
  🐙 GitHub   → <a href="https://github.com/NielsKok-Labs" target="_blank" style="color:#6366f1">github.com/NielsKok-Labs</a>
  💼 LinkedIn → <a href="https://www.linkedin.com/in/nielskoknl" target="_blank" style="color:#6366f1">linkedin.com/in/nielskoknl</a>`,
        clear: () => { terminalOutput.innerHTML = ''; return null; },
        'sudo rm -rf /': () => `<span class="term-error">Toegang geweigerd. Nice try. 😄</span>`,
    };

    let cmdHistory = [], historyIndex = -1;

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
        if (cmd) {
            if (commands[cmd] !== undefined) {
                const result = commands[cmd]();
                if (result !== null) printOutput(result);
            } else {
                printOutput(`<span class="term-error">command not found: ${raw}</span> — type <span class="term-cmd">help</span>`);
            }
        }
        printOutput('');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    const openTerminal  = () => { terminalOverlay.classList.add('open'); setTimeout(() => terminalInput.focus(), 50); };
    const closeTerminal = () => terminalOverlay.classList.remove('open');

    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === '~') { e.preventDefault(); terminalOverlay.classList.contains('open') ? closeTerminal() : openTerminal(); }
        if (e.key === 'Escape' && terminalOverlay.classList.contains('open')) closeTerminal();
    });

    terminalOverlay.addEventListener('click', e => { if (e.target === terminalOverlay) closeTerminal(); });
    terminalClose.addEventListener('click', closeTerminal);
    terminalBody.addEventListener('click', () => terminalInput.focus());

    terminalInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const val = terminalInput.value;
            cmdHistory.unshift(val);
            historyIndex = -1;
            runCommand(val);
            terminalInput.value = '';
        }
        if (e.key === 'ArrowUp') { e.preventDefault(); if (historyIndex < cmdHistory.length - 1) terminalInput.value = cmdHistory[++historyIndex]; }
        if (e.key === 'ArrowDown') { e.preventDefault(); historyIndex > 0 ? terminalInput.value = cmdHistory[--historyIndex] : (historyIndex = -1, terminalInput.value = ''); }
        if (e.key === 'Tab') { e.preventDefault(); const partial = terminalInput.value.toLowerCase(); const match = Object.keys(commands).find(c => c.startsWith(partial)); if (match) terminalInput.value = match; }
    });
}

// ─── Konami → Matrix ─────────────────────────────────────────────────────────
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

document.addEventListener('keydown', e => {
    if (el('terminalOverlay')?.classList.contains('open')) return;
    if (el('paletteOverlay')?.classList.contains('open'))  return;
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) { konamiIndex = 0; startMatrix(); }
    } else { konamiIndex = 0; }
});

function startMatrix() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:black;opacity:0;transition:opacity 0.5s ease;cursor:pointer;';
    document.body.appendChild(overlay);
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    overlay.appendChild(matrixCanvas);
    const hint = document.createElement('div');
    hint.textContent = '[ klik om te sluiten ]';
    hint.style.cssText = 'position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);color:#00ff41;font-family:"Fira Code",monospace;font-size:0.85rem;opacity:0.5;pointer-events:none;letter-spacing:0.1em;';
    overlay.appendChild(hint);
    setTimeout(() => overlay.style.opacity = '1', 10);
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const mCtx = matrixCanvas.getContext('2d');
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = 'アイウエオカキクケコ0123456789ABCDEF<>{}[]|/\\';
    let animId;
    function drawMatrix() {
        mCtx.fillStyle = 'rgba(0,0,0,0.05)';
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            mCtx.fillStyle = drops[i] === 1 ? '#ffffff' : '#00ff41';
            mCtx.font = `${fontSize}px "Fira Code", monospace`;
            mCtx.fillText(char, i * fontSize, y * fontSize);
            if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
        animId = requestAnimationFrame(drawMatrix);
    }
    animId = requestAnimationFrame(drawMatrix);
    overlay.addEventListener('click', () => { cancelAnimationFrame(animId); overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 500); });
}

// ─── Extra injected styles ────────────────────────────────────────────────────
const injectedStyle = document.createElement('style');
injectedStyle.textContent = `
@keyframes fadeIn { to { opacity: 1; } }
.nav-menu a.active { color: var(--primary); }
.nav-menu a.active::after { width: 100%; }
@media (max-width: 768px) {
    .nav-menu.active {
        display: flex; flex-direction: column; position: absolute;
        top: 100%; left: 0; right: 0;
        background: rgba(255,255,255,0.98);
        padding: 2rem; gap: 1.5rem;
        border-bottom: 1px solid var(--border);
        box-shadow: var(--shadow);
    }
    [data-theme="dark"] .nav-menu.active { background: rgba(15,23,42,0.98); }
    .menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
    .menu-toggle.active span:nth-child(2) { opacity: 0; }
    .menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(7px,-6px); }
}
.project-card { position: relative; overflow: hidden; }
.project-card::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
}
.project-card:hover::before { left: 100%; }
::selection { background: var(--primary); color: white; }
`;
document.head.appendChild(injectedStyle);

// ─── Console easter egg ───────────────────────────────────────────────────────
console.log('%c👋 Hey developer!', 'font-size:24px;color:#6366f1;font-weight:bold;');
console.log('%c🚀 Nice to see you checking the code!', 'font-size:14px;color:#8b5cf6;');
console.log('%c📧 Want to work together? Hit me up!', 'font-size:12px;color:#475569;');

// ─── Performance observer ─────────────────────────────────────────────────────
if ('PerformanceObserver' in window) {
    try {
        const po = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                if (entry.loadTime > 3000) console.warn('Slow loading asset:', entry.name);
            }
        });
        po.observe({ entryTypes: ['resource'] });
    } catch (e) {}
}
