// Utilities
const selectAll = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const select = (sel, ctx = document) => ctx.querySelector(sel);

// Set current year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

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

// Smooth scroll focus management for accessibility
selectAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus after the scroll
    setTimeout(() => { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }, 500);
  });
});

// Animate skill bars when visible
const animateSkills = () => {
  selectAll('.skill-fill').forEach((bar) => {
    const value = Number(bar.getAttribute('data-skill-value') || '0');
    // clamp
    const clamped = Math.max(0, Math.min(100, value));
    bar.style.width = clamped + '%';
  });
};

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateSkills();
      skillsObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('competences');
if (skillsSection) skillsObserver.observe(skillsSection);

// Mobile nav toggle
const navToggle = select('.nav-toggle');
const siteNav = select('#site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close on link click (mobile)
  selectAll('#site-nav a').forEach((link) => link.addEventListener('click', () => {
    if (siteNav.classList.contains('is-open')) {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }));
}