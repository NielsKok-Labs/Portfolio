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
        </div>`,

    provision: `
        <div class="placeholder-image" style="background:linear-gradient(135deg,#0072c6 0%,#6366f1 60%,#8b5cf6 100%);width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#prov-bg)"/>
                <rect x="30" y="60" width="80" height="100" rx="10" fill="white" fill-opacity="0.12"/>
                <text x="70" y="118" font-size="28" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="monospace">O</text>
                <text x="70" y="140" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Ontwikkel</text>
                <rect x="160" y="60" width="80" height="100" rx="10" fill="white" fill-opacity="0.12"/>
                <text x="200" y="118" font-size="28" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="monospace">A</text>
                <text x="200" y="140" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Acceptatie</text>
                <rect x="290" y="60" width="80" height="100" rx="10" fill="white" fill-opacity="0.12"/>
                <text x="330" y="118" font-size="28" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="monospace">P</text>
                <text x="330" y="140" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Productie</text>
                <line x1="112" y1="110" x2="158" y2="110" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <polyline points="152,104 160,110 152,116" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <line x1="242" y1="110" x2="288" y2="110" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <polyline points="282,104 290,110 282,116" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <defs>
                    <linearGradient id="prov-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0072c6"/>
                        <stop offset="100%" stop-color="#6366f1"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,
     
    security: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#sec-bg)"/>
                <!-- shield outline -->
                <path d="M200 40 L270 70 L270 130 C270 165 200 190 200 190 C200 190 130 165 130 130 L130 70 Z"
                      fill="white" fill-opacity="0.12" stroke="white" stroke-opacity="0.25" stroke-width="2"/>
                <!-- checkmark inside shield -->
                <path d="M175 115 L192 132 L228 96"
                      stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
                <!-- score badge -->
                <rect x="290" y="155" width="90" height="48" rx="10" fill="white" fill-opacity="0.1"/>
                <text x="335" y="175" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Secure Score</text>
                <text x="335" y="193" font-size="15" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.85" font-family="monospace">73,96%</text>
                <!-- small dots grid (decorative) -->
                <circle cx="50" cy="170" r="3" fill="white" fill-opacity="0.15"/>
                <circle cx="70" cy="170" r="3" fill="white" fill-opacity="0.1"/>
                <circle cx="90" cy="170" r="3" fill="white" fill-opacity="0.15"/>
                <circle cx="50" cy="190" r="3" fill="white" fill-opacity="0.1"/>
                <circle cx="70" cy="190" r="3" fill="white" fill-opacity="0.15"/>
                <circle cx="90" cy="190" r="3" fill="white" fill-opacity="0.1"/>
                <defs>
                    <linearGradient id="sec-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0f172a"/>
                        <stop offset="100%" stop-color="#1e3a5f"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,
    
    teams: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#teams-bg)"/>
                <!-- Teams icon simplified -->
                <rect x="30" y="55" width="100" height="110" rx="14" fill="white" fill-opacity="0.12"/>
                <text x="80" y="122" font-size="38" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">T</text>
                <!-- Arrow -->
                <line x1="148" y1="110" x2="195" y2="110" stroke="white" stroke-opacity="0.5" stroke-width="2.5"/>
                <polyline points="188,103 196,110 188,117" fill="none" stroke="white" stroke-opacity="0.5" stroke-width="2.5"/>
                <!-- Archive box -->
                <rect x="205" y="70" width="90" height="80" rx="10" fill="white" fill-opacity="0.12"/>
                <rect x="205" y="70" width="90" height="18" rx="10" fill="white" fill-opacity="0.18"/>
                <line x1="238" y1="70" x2="238" y2="88" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
                <line x1="262" y1="70" x2="262" y2="88" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
                <rect x="222" y="100" width="56" height="8" rx="3" fill="white" fill-opacity="0.2"/>
                <rect x="222" y="115" width="40" height="8" rx="3" fill="white" fill-opacity="0.15"/>
                <!-- Small XML tag -->
                <rect x="310" y="75" width="60" height="30" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="340" y="95" font-size="11" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="monospace">&lt;xml/&gt;</text>
                <!-- ZIP label -->
                <rect x="310" y="115" width="60" height="30" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="340" y="135" font-size="11" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="monospace">.zip</text>
                <!-- Flow dots -->
                <circle cx="155" cy="170" r="4" fill="white" fill-opacity="0.2"/>
                <circle cx="175" cy="170" r="4" fill="white" fill-opacity="0.3"/>
                <circle cx="195" cy="170" r="4" fill="white" fill-opacity="0.4"/>
                <circle cx="215" cy="170" r="4" fill="white" fill-opacity="0.3"/>
                <circle cx="235" cy="170" r="4" fill="white" fill-opacity="0.2"/>
                <defs>
                    <linearGradient id="teams-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#4b4acf"/>
                        <stop offset="100%" stop-color="#0ea5e9"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

        pryvee: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#pryvee-bg)"/>
                <!-- Wordmark: Pry -->
                <text x="72" y="122" font-size="42" font-weight="700" text-anchor="middle"
                      fill="white" fill-opacity="0.9" font-family="sans-serif">Pry</text>
                <!-- Wordmark: vee (accent) -->
                <text x="165" y="122" font-size="42" font-weight="700" text-anchor="middle"
                      fill="white" fill-opacity="0.45" font-family="sans-serif">vee</text>
                <!-- Module pills -->
                <rect x="30" y="145" width="72" height="22" rx="11" fill="white" fill-opacity="0.15"/>
                <text x="66" y="161" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.8" font-family="sans-serif">Snapshot</text>
                <rect x="110" y="145" width="60" height="22" rx="11" fill="white" fill-opacity="0.12"/>
                <text x="140" y="161" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">Redact</text>
                <rect x="178" y="145" width="56" height="22" rx="11" fill="white" fill-opacity="0.08"/>
                <text x="206" y="161" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Spaces</text>
                <!-- Architecture hint right side -->
                <rect x="270" y="60" width="100" height="34" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="320" y="82" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="monospace">GitHub Pages</text>
                <line x1="320" y1="94" x2="320" y2="108" stroke="white" stroke-opacity="0.25" stroke-width="1.5"/>
                <rect x="270" y="108" width="100" height="34" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="320" y="130" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="monospace">CF Workers</text>
                <line x1="320" y1="142" x2="320" y2="156" stroke="white" stroke-opacity="0.25" stroke-width="1.5"/>
                <rect x="270" y="156" width="100" height="34" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="320" y="178" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="monospace">Graph API</text>
                <defs>
                    <linearGradient id="pryvee-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#1a0533"/>
                        <stop offset="100%" stop-color="#2a0f3d"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    healthcheck: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#hc-bg)"/>
                <!-- Clipboard outline -->
                <rect x="120" y="35" width="100" height="130" rx="8" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.2" stroke-width="1.5"/>
                <rect x="145" y="28" width="50" height="16" rx="8" fill="white" fill-opacity="0.2"/>
                <!-- Check lines -->
                <line x1="136" y1="75" x2="208" y2="75" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
                <line x1="136" y1="95" x2="208" y2="95" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
                <line x1="136" y1="115" x2="208" y2="115" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
                <line x1="136" y1="135" x2="208" y2="135" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
                <!-- Checkmarks -->
                <path d="M136 75 L142 81 L154 67" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                <path d="M136 95 L142 101 L154 87" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                <path d="M136 115 L142 121 L154 107" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                <path d="M136 135 L142 141 L154 127" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                <!-- Score badge right -->
                <rect x="260" y="60" width="110" height="80" rx="14" fill="white" fill-opacity="0.1"/>
                <text x="315" y="90" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">CIS v6.0.1</text>
                <text x="315" y="110" font-size="22" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.85" font-family="monospace">BIO2</text>
                <text x="315" y="128" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Benchmark</text>
                <!-- Shield small -->
                <path d="M170 160 L185 166 L185 177 C185 183 170 188 170 188 C170 188 155 183 155 177 L155 166 Z" fill="white" fill-opacity="0.12" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
                <defs>
                    <linearGradient id="hc-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0f2027"/>
                        <stop offset="100%" stop-color="#1a3a4a"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    ultimo: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#ult-bg)"/>
                <!-- Ultimo box left -->
                <rect x="25" y="65" width="90" height="90" rx="12" fill="white" fill-opacity="0.12"/>
                <text x="70" y="103" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Ultimo</text>
                <text x="70" y="120" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Asset mgmt</text>
                <!-- Gear icon -->
                <circle cx="70" cy="134" r="7" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <!-- Arrow middle -->
                <line x1="118" y1="110" x2="148" y2="110" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <polyline points="142,104 150,110 142,116" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <!-- Azure Automation -->
                <rect x="153" y="75" width="90" height="70" rx="12" fill="white" fill-opacity="0.1"/>
                <text x="198" y="104" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Azure</text>
                <text x="198" y="118" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Automation</text>
                <text x="198" y="133" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="monospace">Runbook</text>
                <!-- Arrow right -->
                <line x1="246" y1="110" x2="276" y2="110" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <polyline points="270,104 278,110 270,116" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
                <!-- SharePoint box right -->
                <rect x="280" y="65" width="90" height="90" rx="12" fill="white" fill-opacity="0.12"/>
                <text x="325" y="103" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">SharePoint</text>
                <text x="325" y="118" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">350 sites</text>
                <!-- Bottom stat -->
                <rect x="120" y="168" width="160" height="28" rx="8" fill="white" fill-opacity="0.08"/>
                <text x="200" y="185" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">30 min → geautomatiseerd</text>
                <defs>
                    <linearGradient id="ult-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#1e3a5f"/>
                        <stop offset="100%" stop-color="#0f172a"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    purview: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#purv-bg)"/>
                <!-- Shield main -->
                <path d="M200 30 L255 55 L255 110 C255 145 200 170 200 170 C200 170 145 145 145 110 L145 55 Z" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.2" stroke-width="1.5"/>
                <!-- Lock inside shield -->
                <rect x="185" y="85" width="30" height="25" rx="4" fill="white" fill-opacity="0.2"/>
                <path d="M192 85 L192 79 C192 74 208 74 208 79 L208 85" stroke="white" stroke-opacity="0.5" stroke-width="2" fill="none"/>
                <circle cx="200" cy="97" r="4" fill="white" fill-opacity="0.6"/>
                <!-- Labels left -->
                <rect x="20" y="55" width="110" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="75" y="70" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">Gevoeligheidslabels</text>
                <rect x="20" y="85" width="110" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="75" y="100" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">DLP-beleid</text>
                <rect x="20" y="115" width="110" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="75" y="130" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">Retentielabels</text>
                <!-- Labels right -->
                <rect x="270" y="55" width="110" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="325" y="70" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">MDTO</text>
                <rect x="270" y="85" width="110" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="325" y="100" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">Workshops</text>
                <rect x="270" y="115" width="110" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="325" y="130" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">FG / CISO</text>
                <!-- Bottom label -->
                <text x="200" y="195" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Microsoft Purview · Gemeente Midden-Groningen</text>
                <defs>
                    <linearGradient id="purv-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#1a0a2e"/>
                        <stop offset="100%" stop-color="#2d1b4e"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    automate: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#auto-bg)"/>
                <!-- Person icon -->
                <circle cx="70" cy="75" r="22" fill="white" fill-opacity="0.15"/>
                <text x="70" y="82" font-size="22" text-anchor="middle" fill="white" fill-opacity="0.7">👤</text>
                <text x="70" y="115" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Nieuwe medewerker</text>
                <!-- Arrow -->
                <line x1="100" y1="75" x2="140" y2="75" stroke="white" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4,3"/>
                <!-- Calendar / 3 months -->
                <rect x="145" y="55" width="80" height="40" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="185" y="73" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">3 maanden</text>
                <text x="185" y="86" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="monospace">in dienst</text>
                <!-- Arrow down -->
                <line x1="185" y1="97" x2="185" y2="120" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <polyline points="179,114 185,122 191,114" fill="none" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <!-- Flow box -->
                <rect x="145" y="125" width="80" height="35" rx="8" fill="white" fill-opacity="0.12"/>
                <text x="185" y="140" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">Power Automate</text>
                <text x="185" y="153" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="monospace">flow trigger</text>
                <!-- Arrow right -->
                <line x1="228" y1="142" x2="258" y2="142" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <polyline points="252,136 260,142 252,148" fill="none" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <!-- Enquête box -->
                <rect x="262" y="118" width="100" height="50" rx="10" fill="white" fill-opacity="0.1"/>
                <text x="312" y="138" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">📋 Enquête</text>
                <text x="312" y="153" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">automatisch verstuurd</text>
                <!-- HLD/LLD badges -->
                <rect x="262" y="55" width="46" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="285" y="69" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">HLD</text>
                <rect x="314" y="55" width="46" height="22" rx="6" fill="white" fill-opacity="0.1"/>
                <text x="337" y="69" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">LLD</text>
                <defs>
                    <linearGradient id="auto-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0c2340"/>
                        <stop offset="100%" stop-color="#1a3a5c"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    purview_intern: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#pi-bg)"/>
                <!-- Book/document icon -->
                <rect x="140" y="40" width="120" height="140" rx="10" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.15" stroke-width="1.5"/>
                <rect x="140" y="40" width="12" height="140" rx="6" fill="white" fill-opacity="0.18"/>
                <!-- Lines in doc -->
                <rect x="165" y="65" width="75" height="8" rx="3" fill="white" fill-opacity="0.2"/>
                <rect x="165" y="82" width="60" height="6" rx="3" fill="white" fill-opacity="0.12"/>
                <rect x="165" y="100" width="70" height="6" rx="3" fill="white" fill-opacity="0.12"/>
                <rect x="165" y="118" width="50" height="6" rx="3" fill="white" fill-opacity="0.12"/>
                <rect x="165" y="136" width="65" height="6" rx="3" fill="white" fill-opacity="0.12"/>
                <!-- Reuse arrows -->
                <path d="M270 100 C300 80 320 120 290 140" stroke="white" stroke-opacity="0.3" stroke-width="2" fill="none" stroke-dasharray="5,3"/>
                <polyline points="284,146 290,138 298,144" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="2"/>
                <text x="310" y="112" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Herbruikbaar</text>
                <!-- Intern badge -->
                <rect x="148" y="175" width="104" height="22" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="200" y="190" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Intern · XTRM / Alistar</text>
                <defs>
                    <linearGradient id="pi-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#1a0a2e"/>
                        <stop offset="100%" stop-color="#0f172a"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    provisioning_intern: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#provin-bg)"/>
                <!-- Template card center -->
                <rect x="130" y="50" width="140" height="110" rx="12" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.15" stroke-width="1.5"/>
                <text x="200" y="80" font-size="10" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Template</text>
                <rect x="148" y="90" width="104" height="8" rx="3" fill="white" fill-opacity="0.2"/>
                <rect x="148" y="106" width="80" height="6" rx="3" fill="white" fill-opacity="0.12"/>
                <rect x="148" y="120" width="90" height="6" rx="3" fill="white" fill-opacity="0.12"/>
                <rect x="148" y="134" width="70" height="6" rx="3" fill="white" fill-opacity="0.12"/>
                <!-- Clone arrows -->
                <path d="M200 162 L200 178" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <line x1="140" y1="178" x2="260" y2="178" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
                <line x1="140" y1="178" x2="140" y2="192" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
                <line x1="200" y1="178" x2="200" y2="192" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
                <line x1="260" y1="178" x2="260" y2="192" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
                <!-- Client dots -->
                <circle cx="140" cy="197" r="6" fill="white" fill-opacity="0.25"/>
                <circle cx="200" cy="197" r="6" fill="white" fill-opacity="0.25"/>
                <circle cx="260" cy="197" r="6" fill="white" fill-opacity="0.25"/>
                <text x="140" y="212" font-size="7" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Klant A</text>
                <text x="200" y="212" font-size="7" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Klant B</text>
                <text x="260" y="212" font-size="7" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Klant C</text>
                <defs>
                    <linearGradient id="provin-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0a1628"/>
                        <stop offset="100%" stop-color="#1e3a5f"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    healthcheck_tool: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#hct-bg)"/>
                <!-- Terminal window -->
                <rect x="40" y="40" width="200" height="140" rx="10" fill="#0d1117" fill-opacity="0.8"/>
                <rect x="40" y="40" width="200" height="24" rx="10" fill="white" fill-opacity="0.08"/>
                <circle cx="58" cy="52" r="4" fill="#ff5f56"/>
                <circle cx="72" cy="52" r="4" fill="#ffbd2e"/>
                <circle cx="86" cy="52" r="4" fill="#27c93f"/>
                <!-- PS code lines -->
                <text x="52" y="83" font-size="8" fill="#6366f1" font-family="monospace" opacity="0.9">Get-CISCheck</text>
                <text x="52" y="98" font-size="8" fill="#4ade80" font-family="monospace" opacity="0.7">✓ MFA enabled</text>
                <text x="52" y="113" font-size="8" fill="#4ade80" font-family="monospace" opacity="0.7">✓ CA policy found</text>
                <text x="52" y="128" font-size="8" fill="#fbbf24" font-family="monospace" opacity="0.7">⚠ Legacy auth</text>
                <text x="52" y="143" font-size="8" fill="#4ade80" font-family="monospace" opacity="0.7">✓ DKIM enabled</text>
                <text x="52" y="158" font-size="8" fill="#60a5fa" font-family="monospace" opacity="0.6">Mapping BIO2 → CIS</text>
                <!-- Badges right -->
                <rect x="260" y="55" width="110" height="35" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="315" y="70" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">CIS v6.0.1</text>
                <text x="315" y="83" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Geautomatiseerd</text>
                <rect x="260" y="100" width="110" height="35" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="315" y="115" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">BIO2</text>
                <text x="315" y="128" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Mapping</text>
                <rect x="260" y="145" width="110" height="35" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="315" y="160" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">PowerShell</text>
                <text x="315" y="173" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Based</text>
                <defs>
                    <linearGradient id="hct-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0d1b2a"/>
                        <stop offset="100%" stop-color="#1a2f45"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    conditionalaccess: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#ca-bg)"/>
                <!-- User box -->
                <rect x="20" y="80" width="70" height="60" rx="10" fill="white" fill-opacity="0.1"/>
                <circle cx="55" cy="102" r="12" fill="white" fill-opacity="0.2"/>
                <text x="55" y="130" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Gebruiker</text>
                <!-- Arrow to CA -->
                <line x1="92" y1="110" x2="125" y2="110" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <polyline points="119,104 127,110 119,116" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <!-- CA box center -->
                <rect x="128" y="55" width="144" height="110" rx="12" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.2" stroke-width="1.5"/>
                <text x="200" y="78" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Conditional Access</text>
                <line x1="135" y1="84" x2="265" y2="84" stroke="white" stroke-opacity="0.1" stroke-width="1"/>
                <!-- CA policies listed -->
                <text x="145" y="100" font-size="7.5" fill="#4ade80" font-family="monospace" opacity="0.8">✓ MFA enforced</text>
                <text x="145" y="115" font-size="7.5" fill="#4ade80" font-family="monospace" opacity="0.8">✓ Compliant device</text>
                <text x="145" y="130" font-size="7.5" fill="#60a5fa" font-family="monospace" opacity="0.8">+ App maatwerk</text>
                <text x="145" y="145" font-size="7.5" fill="#60a5fa" font-family="monospace" opacity="0.8">+ CIS policies</text>
                <!-- Arrow to apps -->
                <line x1="274" y1="110" x2="307" y2="110" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <polyline points="301,104 309,110 301,116" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <!-- Apps box -->
                <rect x="310" y="80" width="70" height="60" rx="10" fill="white" fill-opacity="0.1"/>
                <text x="345" y="105" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">M365</text>
                <text x="345" y="118" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Apps</text>
                <!-- CIS badge bottom -->
                <rect x="148" y="172" width="104" height="22" rx="8" fill="white" fill-opacity="0.08"/>
                <text x="200" y="186" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">CIS Benchmark · Zero Trust</text>
                <defs>
                    <linearGradient id="ca-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0f172a"/>
                        <stop offset="100%" stop-color="#1e3a5f"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    provisioning_hh: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#hh-bg)"/>
                <!-- Request form left -->
                <rect x="25" y="55" width="100" height="110" rx="10" fill="white" fill-opacity="0.1"/>
                <text x="75" y="78" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.5" font-family="sans-serif">Aanvraag</text>
                <rect x="38" y="88" width="74" height="7" rx="3" fill="white" fill-opacity="0.15"/>
                <rect x="38" y="103" width="60" height="7" rx="3" fill="white" fill-opacity="0.1"/>
                <rect x="38" y="118" width="68" height="7" rx="3" fill="white" fill-opacity="0.1"/>
                <rect x="38" y="140" width="74" height="18" rx="6" fill="white" fill-opacity="0.2"/>
                <text x="75" y="152" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="sans-serif">Aanvragen</text>
                <!-- Arrow -->
                <line x1="128" y1="110" x2="158" y2="110" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <polyline points="152,104 160,110 152,116" fill="none" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <!-- Provisioning engine -->
                <rect x="162" y="70" width="90" height="80" rx="12" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.15" stroke-width="1.5"/>
                <text x="207" y="100" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Governance</text>
                <text x="207" y="115" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Engine</text>
                <circle cx="207" cy="132" r="8" fill="none" stroke="white" stroke-opacity="0.25" stroke-width="1.5"/>
                <path d="M203 132 L207 128 L211 132 L207 136 Z" fill="white" fill-opacity="0.3"/>
                <!-- Arrow right -->
                <line x1="254" y1="110" x2="284" y2="110" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <polyline points="278,104 286,110 278,116" fill="none" stroke="white" stroke-opacity="0.35" stroke-width="1.5"/>
                <!-- Teams + SP result -->
                <rect x="288" y="65" width="85" height="38" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="330" y="82" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Teams</text>
                <text x="330" y="95" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Workspace</text>
                <rect x="288" y="112" width="85" height="38" rx="8" fill="white" fill-opacity="0.1"/>
                <text x="330" y="129" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">SharePoint</text>
                <text x="330" y="142" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Site</text>
                <defs>
                    <linearGradient id="hh-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0a1628"/>
                        <stop offset="100%" stop-color="#1a2f45"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`,

    powerplatform: `
        <div class="placeholder-image" style="width:100%;height:100%;">
            <svg viewBox="0 0 400 220" fill="none" style="width:100%;height:100%;">
                <rect width="400" height="220" fill="url(#pp-bg)"/>
                <!-- OTAP boxes -->
                <rect x="25" y="70" width="70" height="80" rx="10" fill="white" fill-opacity="0.12"/>
                <text x="60" y="105" font-size="22" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="monospace">O</text>
                <text x="60" y="123" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Ontwikkel</text>
                <rect x="110" y="70" width="70" height="80" rx="10" fill="white" fill-opacity="0.1"/>
                <text x="145" y="105" font-size="22" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="monospace">T</text>
                <text x="145" y="123" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Test</text>
                <rect x="195" y="70" width="70" height="80" rx="10" fill="white" fill-opacity="0.1"/>
                <text x="230" y="105" font-size="22" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="monospace">A</text>
                <text x="230" y="123" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Acceptatie</text>
                <rect x="280" y="70" width="70" height="80" rx="10" fill="white" fill-opacity="0.12"/>
                <text x="315" y="105" font-size="22" font-weight="bold" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="monospace">P</text>
                <text x="315" y="123" font-size="8" text-anchor="middle" fill="white" fill-opacity="0.4" font-family="sans-serif">Productie</text>
                <!-- Arrows between -->
                <line x1="97" y1="110" x2="108" y2="110" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <line x1="182" y1="110" x2="193" y2="110" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <line x1="267" y1="110" x2="278" y2="110" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
                <!-- Copilot Studio label -->
                <rect x="100" y="170" width="200" height="24" rx="8" fill="white" fill-opacity="0.08"/>
                <text x="200" y="186" font-size="9" text-anchor="middle" fill="white" fill-opacity="0.6" font-family="sans-serif">Power Platform · Copilot Studio · NJI</text>
                <defs>
                    <linearGradient id="pp-bg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#742774"/>
                        <stop offset="100%" stop-color="#4a0a4a"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>`
};

// ─── BUG FIX: image, linkIcon en linkText worden nu correct bepaald ───────────
function buildProjectCard(project) {
    const image      = PROJECT_IMAGES[project.image] || '<div class="placeholder-image" style="background:var(--bg-secondary);width:100%;height:100%;"></div>';
    
    // Projecten zonder link krijgen geen klikbare knop
    if (!project.link || project.linkType === 'none') {
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
                </div>
            </article>`;
    }
 
    const linkTarget = project.linkType === 'repo' ? ' target="_blank" rel="noopener noreferrer"' : '';
    const linkIcon   = project.linkType === 'repo'
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    const linkText   = project.linkType === 'repo' ? 'Bekijk repo' : 'Bekijk project';
 
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
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
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
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
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
        { label: 'Ervaring',     sub: 'Werkervaring',                href: '#timeline',     icon: '04' },
        { label: 'Blog',         sub: 'Recente posts',               href: '#blog',         icon: '05' },
        { label: 'Contact',      sub: 'Neem contact op',             href: '#contact',      icon: '06' },
        { label: 'GitHub',       sub: 'github.com/NielsKok-Labs',    href: 'https://github.com/NielsKok-Labs', icon: 'GH' },
        { label: 'LinkedIn',     sub: 'linkedin.com/in/nielskoknl',  href: 'https://www.linkedin.com/in/nielskoknl', icon: 'IN' },
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
  [3] Provision Assist              — PowerShell, Power Platform, Azure`,
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
