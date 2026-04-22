const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bhfastbtpfqqggaukxmo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmFzdGJ0cGZxcWdnYXVreG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDU5NDcsImV4cCI6MjA3OTA4MTk0N30.k9IJSDLXLRGQZLhy-LlIkgiTm78JTYb_1_3LttBOuuc';

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
    return html.replace(
        new RegExp(`${escaped(start)}[\\s\\S]*?${escaped(end)}`),
        `${start}\n${content}\n${end}`
    );
}

function buildSkillsHTML(skills) {
    return skills.map(s => `
    <div class="skill">
        ${s.svg_icon ? `<div class="skill-icon">${s.svg_icon}</div>` : ''}
        <span class="skill-name">${s.name}</span>
        ${s.description ? `<p class="skill-description">${s.description}</p>` : ''}
    </div>`).join('');
}

function buildExperienceHTML(experience) {
    return experience.map(e => {
        const company = e.company || e.entreprise || e.organization || e.organisation || e.employer || '';
        const type = e.type || e.contract || '';
        const companyLine = company
            ? `${company}${type ? ` <span class="accent">—</span> ${type}` : ''}`
            : e.title;
        const lines = e.description ? e.description.split('\n').map(l => l.trim()).filter(Boolean) : [];
        const descHtml = lines.length > 1
            ? `<ul class="exp-list">${lines.map(l => `<li><span>${l}</span></li>`).join('')}</ul>`
            : (lines.length === 1 ? `<p class="exp-desc">${lines[0]}</p>` : '');
        return `
    <div class="exp-card">
        <div class="exp-header">
            <div>
                <div class="exp-company">${companyLine}</div>
                ${company ? `<div class="exp-role">${e.title}</div>` : ''}
            </div>
            <div class="exp-date">${e.period || e.date || ''}</div>
        </div>
        ${descHtml}
    </div>`;
    }).join('');
}

function buildEducationHTML(education) {
    return education.map(e => {
        const institution = e.institution || e.school || e.ecole || e.etablissement || e.établissement || e.establishment || e.university || e.universite || '';
        return `
    <div class="form-card">
        <div class="form-year">${e.period || e.date || ''}</div>
        <h3>${e.title}</h3>
        ${institution ? `<p>${institution}</p>` : ''}
        ${e.description ? `<p>${e.description}</p>` : ''}
    </div>`;
    }).join('');
}

function buildProjectsHTML(projects) {
    return projects.map(p => {
        let imageUrl = '';
        if (p.image_url) {
            if (p.image_url.startsWith('http://') || p.image_url.startsWith('https://') || p.image_url.startsWith('data:')) {
                imageUrl = p.image_url;
            } else if (!(p.image_url.length > 200 || /^[A-Za-z0-9+/]+=*$/.test(p.image_url))) {
                imageUrl = storageUrl('project-images', p.image_url);
            }
        }
        let link = '#';
        if (p.pdf_url) {
            link = p.pdf_url.startsWith('http') ? p.pdf_url : storageUrl('project-pdfs', p.pdf_url);
        } else if (p.link) {
            link = p.link;
        }
        const tagsHTML = p.tags && Array.isArray(p.tags)
            ? p.tags.map(t => `<span class="pill">${t}</span>`).join('')
            : '';
        return `
    <article class="card">
        <a class="card-link" href="${link}" target="_blank" rel="noopener">
            <div class="card-media">
                ${imageUrl ? `<img src="${imageUrl}" alt="${p.title}" class="card-media-img">` : ''}
            </div>
            <div class="card-body">
                <h3>${p.title}</h3>
                ${p.description ? `<p class="card-description">${p.description}</p>` : ''}
                ${tagsHTML ? `<div class="card-tags">${tagsHTML}</div>` : ''}
            </div>
        </a>
    </article>`;
    }).join('');
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
    html = inject(html, 'projectsGrid', buildProjectsHTML(projects));

    if (about) {
        if (about.description) html = inject(html, 'aboutDescription', about.description);
        if (about.tags && Array.isArray(about.tags)) {
            html = inject(html, 'aboutTags', about.tags.map(t => `<li>${t}</li>`).join(''));
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
