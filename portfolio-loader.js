// ========================================
// CLIENT SUPABASE UNIQUE - VERSION ULTIME
// ========================================

function getSupabaseClient() {
    return (window.supabase && typeof window.supabase.from === 'function')
        ? window.supabase : null;
}

// ========================================
// CHARGEMENT DU PORTFOLIO
// ========================================

const _loaderStart = Date.now();

function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    const elapsed = Date.now() - _loaderStart;
    const remaining = Math.max(0, 800 - elapsed);
    setTimeout(() => loader.classList.add('hidden'), remaining);
}

(async function loadPortfolio() {
    try {
        const client = getSupabaseClient();
        if (!client) { hideLoader(); return; }

        const results = await Promise.allSettled([
            client.from('hero').select('*').single(),
            client.from('projects').select('*').order('order_index'),
            client.from('skills').select('*').order('order_index', { ascending: true }),
            client.from('about').select('*').single(),
            client.from('experience').select('*').order('order_index'),
            client.from('education').select('*').order('order_index'),
            client.from('contact').select('*').single()
        ]);
        const [hero, projects, skills, about, experience, education, contact] = results.map(r =>
            r.status === 'fulfilled' ? r.value : { data: null, error: r.reason }
        );

        const publicUrl = (bucket, name) =>
            client.storage.from(bucket).getPublicUrl(name).data.publicUrl;

        const resolveImageUrl = (filename) => {
            if (!filename) return '';
            if (filename.startsWith('http') || filename.startsWith('data:')) return filename;
            if (filename.length > 200) return '';
            return publicUrl('project-images', filename);
        };

        const supabaseOrigin = (() => { try { return new URL(window.SUPABASE_URL).origin; } catch { return null; } })();
        const resolvePdfLink = (p) => {
            if (p.pdf_url) {
                if (p.pdf_url.startsWith('http')) {
                    try { return new URL(p.pdf_url).origin === supabaseOrigin ? p.pdf_url : '#'; } catch { return '#'; }
                }
                return publicUrl('project-pdfs', p.pdf_url);
            }
            return p.link || '#';
        };

        // HERO
        if (hero.data) {
            const t = document.getElementById('heroTitle');
            const s = document.getElementById('heroSubtitle');
            if (t) t.textContent = hero.data.title;
            if (s) s.textContent = hero.data.subtitle;
        }

        // PROJETS
        if (projects.data?.length) {
            const grid = document.getElementById('projectsGrid');
            if (grid) grid.innerHTML = renderHelpers.buildProjectsHTML(projects.data, resolveImageUrl, resolvePdfLink);
        }

        // COMPÉTENCES
        if (skills.data?.length) {
            const grid = document.getElementById('skillsGrid');
            if (grid) grid.innerHTML = renderHelpers.buildSkillsHTML(skills.data);
        }

        // À PROPOS
        if (about.data) {
            const desc   = document.getElementById('aboutDescription');
            const tags   = document.getElementById('aboutTags');
            const avatar = document.getElementById('aboutAvatar');
            if (desc && about.data.description) desc.textContent = about.data.description;
            if (tags && Array.isArray(about.data.tags)) tags.innerHTML = about.data.tags.map(t => `<li>${renderHelpers.esc(t)}</li>`).join('');
            if (avatar && about.data.image_url) {
                avatar.innerHTML = `<img src="${publicUrl('project-images', about.data.image_url)}" alt="Photo de profil" class="avatar-img">`;
            }
        }

        // EXPÉRIENCE
        if (experience.data?.length) {
            const timeline = document.getElementById('experienceTimeline');
            if (timeline) timeline.innerHTML = renderHelpers.buildExperienceHTML(experience.data);
        }

        // FORMATION
        if (education.data?.length) {
            const timeline = document.getElementById('educationTimeline');
            if (timeline) timeline.innerHTML = renderHelpers.buildEducationHTML(education.data);
        }
        
        // CONTACT
        if (contact.data) {
            const btns = document.getElementById('contactButtons');
            if (btns) {
                const CONTACT_SVGS = {
                    email:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>`,
                    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
                    github:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`,
                    phone:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`,
                };

                const escAttr = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const safeHref = url => {
                    if (!url) return '#';
                    const s = String(url).trim().toLowerCase();
                    return (s.startsWith('https://') || s.startsWith('http://') || s.startsWith('mailto:') || s.startsWith('tel:')) ? url : '#';
                };

                const contactBtn = (href, label, svgKey, external = false) =>
                    `<a href="${escAttr(safeHref(href))}" class="contact-link"${external ? ' target="_blank" rel="noopener"' : ''} aria-label="${escAttr(label)}">${CONTACT_SVGS[svgKey]} ${escAttr(label)}</a>`;

                const d = contact.data;
                btns.innerHTML = [
                    d.email    && contactBtn(`mailto:${d.email}`,                  'Email',     'email'),
                    d.linkedin && contactBtn(d.linkedin,                           'LinkedIn',  'linkedin', true),
                    d.github   && contactBtn(d.github,                             'GitHub',    'github',   true),
                    d.phone    && contactBtn(`tel:${d.phone.replace(/\s/g, '')}`,  'Téléphone', 'phone'),
                ].filter(Boolean).join('');
            }
        }
        
        hideLoader();

    } catch (error) {
        console.error('Portfolio load error:', error);
        hideLoader();
    }
})();
