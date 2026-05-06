const fs = require('fs');
const path = require('path');
const { buildSkillsHTML, buildExperienceHTML, buildEducationHTML, buildProjectsHTML } = require('./render-helpers');

const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('./supabase-credentials');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
};

function storageUrl(bucket, filename) {
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;
}

async function fetchTable(table, order = null) {
    let url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
    if (order) url += `&order=${order}.asc`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`Erreur Supabase sur "${table}": ${res.status}`);
    return res.json();
}

async function fetchSingle(table) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`;
    const res = await fetch(url, { headers: { ...HEADERS, 'Accept': 'application/vnd.pgrst.object+json' } });
    if (!res.ok) {
        if (res.status === 406) return null;
        throw new Error(`Erreur Supabase sur "${table}": ${res.status}`);
    }
    return res.json();
}

function inject(html, markerId, content) {
    const start = `<!-- BUILD:${markerId}:START -->`;
    const end = `<!-- BUILD:${markerId}:END -->`;
    const escaped = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escaped(start)}[\\s\\S]*?${escaped(end)}`);
    if (!regex.test(html)) {
        console.warn(`⚠️  Marqueur BUILD:${markerId} introuvable dans index.html`);
        return html;
    }
    return html.replace(regex, () => `${start}\n${content}\n${end}`);
}

function resolveImageUrl(filename) {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('data:')) return filename;
    if (filename.length > 200 || /^[A-Za-z0-9+/]+=*$/.test(filename)) return '';
    return storageUrl('project-images', filename);
}

function resolvePdfLink(p) {
    if (p.pdf_url) return p.pdf_url.startsWith('http') ? p.pdf_url : storageUrl('project-pdfs', p.pdf_url);
    return p.link || '#';
}

// ─── Contact HTML ────────────────────────────────────────────────────────────

const CONTACT_SVGS = {
    email:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    github:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`,
    phone:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`,
};

function safeLinkHref(url) {
    if (!url) return '#';
    const s = String(url).trim().toLowerCase();
    return (s.startsWith('https://') || s.startsWith('http://') || s.startsWith('mailto:') || s.startsWith('tel:')) ? url : '#';
}

function buildContactHTML(contact) {
    if (!contact) return '';
    const btn = (href, label, svgKey, external = false) =>
        `<a href="${esc(safeLinkHref(href))}" class="contact-link"${external ? ' target="_blank" rel="noopener"' : ''} aria-label="${esc(label)}">${CONTACT_SVGS[svgKey]} ${esc(label)}</a>`;
    return [
        contact.email    && btn(`mailto:${contact.email}`,                  'Email',     'email'),
        contact.linkedin && btn(contact.linkedin,                           'LinkedIn',  'linkedin', true),
        contact.github   && btn(contact.github,                             'GitHub',    'github',   true),
        contact.phone    && btn(`tel:${contact.phone.replace(/\s/g, '')}`, 'Téléphone', 'phone'),
    ].filter(Boolean).join('\n');
}

// ─── Build principal ──────────────────────────────────────────────────────────

async function build() {
    console.log('🔄 Récupération des données Supabase...');

    const [skills, experience, education, projects, aboutArr, hero, contact] = await Promise.all([
        fetchTable('skills', 'order_index'),
        fetchTable('experience', 'order_index'),
        fetchTable('education', 'order_index'),
        fetchTable('projects', 'order_index'),
        fetchTable('about'),
        fetchSingle('hero'),
        fetchSingle('contact'),
    ]);

    const about = Array.isArray(aboutArr) ? aboutArr[0] : aboutArr;

    console.log(`   ${skills.length} compétences · ${experience.length} expériences · ${education.length} formations · ${projects.length} projets`);

    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

    // Sections dynamiques (listes)
    html = inject(html, 'skillsGrid',         buildSkillsHTML(skills));
    html = inject(html, 'experienceTimeline', buildExperienceHTML(experience));
    html = inject(html, 'educationTimeline',  buildEducationHTML(education));
    html = inject(html, 'projectsGrid',       buildProjectsHTML(projects, resolveImageUrl, resolvePdfLink));

    // À propos
    if (about) {
        if (about.description) html = inject(html, 'aboutDescription', esc(about.description));
        if (Array.isArray(about.tags)) {
            html = inject(html, 'aboutTags', about.tags.map(t => `<li>${esc(t)}</li>`).join(''));
        }
    }

    // Hero
    if (hero) {
        if (hero.title)    html = inject(html, 'heroTitle',    esc(hero.title));
        if (hero.subtitle) html = inject(html, 'heroSubtitle', esc(hero.subtitle));
    }

    // Contact
    if (contact) {
        const contactHtml = buildContactHTML(contact);
        if (contactHtml) html = inject(html, 'contactButtons', contactHtml);
    }

    fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
    console.log('✅ index.html mis à jour');

    const today = new Date().toISOString().split('T')[0];
    let sitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
    sitemap = sitemap.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
    console.log(`✅ Sitemap mis à jour : ${today}`);

    console.log('🚀 Prêt à déployer !');
}

build().catch(err => {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
});
