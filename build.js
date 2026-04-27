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

async function build() {
    console.log('🔄 Récupération des données Supabase...');

    const [skills, experience, education, projects, aboutArr] = await Promise.all([
        fetchTable('skills', 'order_index'),
        fetchTable('experience', 'order_index'),
        fetchTable('education', 'order_index'),
        fetchTable('projects', 'order_index'),
        fetchTable('about')
    ]);

    const about = Array.isArray(aboutArr) ? aboutArr[0] : aboutArr;

    console.log(`   ${skills.length} compétences · ${experience.length} expériences · ${education.length} formations · ${projects.length} projets`);

    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

    html = inject(html, 'skillsGrid', buildSkillsHTML(skills));
    html = inject(html, 'experienceTimeline', buildExperienceHTML(experience));
    html = inject(html, 'educationTimeline', buildEducationHTML(education));
    html = inject(html, 'projectsGrid', buildProjectsHTML(projects, resolveImageUrl, resolvePdfLink));

    if (about) {
        if (about.description) html = inject(html, 'aboutDescription', esc(about.description));
        if (about.tags && Array.isArray(about.tags)) {
            html = inject(html, 'aboutTags', about.tags.map(t => `<li>${esc(t)}</li>`).join(''));
        }
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
