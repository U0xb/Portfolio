// ========================================
// UTILITIES
// ========================================

const selectAll = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const select = (sel, ctx = document) => ctx.querySelector(sel);
// ========================================
// SET CURRENT YEAR
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  
  // Initialiser le thème
  initTheme();
});

// ========================================
// THÈME CLAIR/SOMBRE
// ========================================

const sunIcon = `<svg fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
</svg>`;

const moonIcon = `<svg fill="currentColor" viewBox="0 0 24 24">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);

  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Changer de thème');
  themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  themeToggle.addEventListener('click', toggleTheme);

  const nav = document.querySelector('.site-nav');
  if (nav) nav.appendChild(themeToggle);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  const toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.innerHTML = next === 'dark' ? sunIcon : moonIcon;
}

// ========================================
// REVEAL ON SCROLL
// ========================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

selectAll('[data-reveal]').forEach((el) => observer.observe(el));

// ========================================
// SMOOTH SCROLL
// ========================================

selectAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { 
      target.setAttribute('tabindex', '-1'); 
      target.focus({ preventScroll: true }); 
    }, 500);
  });
});


// ========================================
// ACTIVE NAV SECTION TRACKING
// ========================================

(function () {
  const sections = selectAll('section[id]');
  const navLinks = selectAll('.site-nav a[href^="#"]');
  let ticking = false;

  function updateActiveNav() {
    const trigger = window.scrollY + window.innerHeight * 0.4;
    let active = null;
    sections.forEach((section) => {
      if (section.offsetTop <= trigger) active = section;
    });
    const activeId = active ? active.id : null;
    navLinks.forEach((link) => {
      link.classList.toggle('nav-active', link.getAttribute('href') === `#${activeId}`);
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateActiveNav(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  updateActiveNav();
})();

// ========================================
// MOBILE NAV TOGGLE
// ========================================

const navToggle = select('.nav-toggle');
const siteNav = select('.site-nav');

if (navToggle && siteNav) {
  function closeNav() {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  selectAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => { if (siteNav.classList.contains('is-open')) closeNav(); });
  });

  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('is-open') && !siteNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('is-open')) closeNav();
  });
}
