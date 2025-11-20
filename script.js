// Utilities
const selectAll = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const select = (sel, ctx = document) => ctx.querySelector(sel);

// Set current year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  
  // Initialiser le thème
  initTheme();
  
  // Créer le bouton admin secret
  createAdminButton();
});

// ===== THÈME CLAIR/SOMBRE =====
function initTheme() {
  // Récupérer le thème sauvegardé ou utiliser la préférence système
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', theme);
  
  // Créer le bouton de toggle
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Changer de thème');
  
  // Icônes améliorées et plus visibles
  const sunIcon = `<svg fill="white" viewBox="0 0 24 24" stroke="white" stroke-width="2">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>`;
  
  const moonIcon = `<svg fill="white" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  
  themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  
  themeToggle.addEventListener('click', toggleTheme);
  
  const nav = document.querySelector('.site-nav');
  if (nav) {
    nav.appendChild(themeToggle);
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  
  // Icônes améliorées
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    const sunIcon = `<svg fill="white" viewBox="0 0 24 24" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>`;
    
    const moonIcon = `<svg fill="white" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    
    toggle.innerHTML = next === 'dark' ? sunIcon : moonIcon;
  }
}

// ===== BOUTON ADMIN SECRET =====
function createAdminButton() {
  // Zone de déclenchement invisible
  const trigger = document.createElement('div');
  trigger.className = 'admin-secret-trigger';
  
  // Bouton admin
  const button = document.createElement('button');
  button.className = 'admin-secret';
  button.setAttribute('aria-label', 'Admin');
  button.innerHTML = '<svg fill="white" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>';
  
  button.addEventListener('click', () => {
    window.location.href = 'admin-login.html';
  });
  
  document.body.appendChild(trigger);
  document.body.appendChild(button);
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

selectAll('[data-reveal]').forEach((el) => observer.observe(el));

// Smooth scroll
selectAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
