// ========================================
// MODULE PARTAGÉ — fonctionne en Node.js (build.js) et dans le navigateur
// ========================================

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) module.exports = factory();
    else root.renderHelpers = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {

    function esc(s) {
        return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Supprime les scripts et handlers d'événements d'un SVG avant injection innerHTML
    function sanitizeSvg(svg) {
        if (!svg || typeof svg !== 'string') return '';
        return svg
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
            .replace(/javascript\s*:/gi, '');
    }

    function buildSkillsHTML(skills) {
        return skills.map(s => `
    <div class="skill">
        ${s.svg_icon ? `<div class="skill-icon">${sanitizeSvg(s.svg_icon)}</div>` : ''}
        <span class="skill-name">${esc(s.name)}</span>
        ${s.description ? `<p class="skill-description">${esc(s.description)}</p>` : ''}
    </div>`).join('');
    }

    function buildExperienceHTML(experience) {
        return experience.map(e => {
            const company     = e.company || e.entreprise || e.organization || e.organisation || e.employer || '';
            const type        = e.type || e.contract || '';
            const companyLine = company
                ? `${esc(company)}${type ? ` <span class="accent">—</span> ${esc(type)}` : ''}`
                : esc(e.title);
            const lines    = e.description ? e.description.split('\n').map(l => l.trim()).filter(Boolean) : [];
            const descHtml = lines.length > 1
                ? `<ul class="exp-list">${lines.map(l => `<li><span>${esc(l)}</span></li>`).join('')}</ul>`
                : (lines.length === 1 ? `<p class="exp-desc">${esc(lines[0])}</p>` : '');
            return `
    <div class="exp-card">
        <div class="exp-header">
            <div>
                <div class="exp-company">${companyLine}</div>
                ${company ? `<div class="exp-role">${esc(e.title)}</div>` : ''}
            </div>
            <div class="exp-date">${esc(e.period || e.date || '')}</div>
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
        <div class="form-year">${esc(e.period || e.date || '')}</div>
        <h3>${esc(e.title)}</h3>
        ${institution ? `<p>${esc(institution)}</p>` : ''}
        ${e.description ? `<p>${esc(e.description)}</p>` : ''}
    </div>`;
        }).join('');
    }

    // resolveImageUrl(filename) → string url ou ''
    // resolvePdfLink(project)  → string url

    function safeLinkHref(url) {
        if (!url || url === '#') return '#';
        const s = String(url).trim().toLowerCase();
        return (s.startsWith('https://') || s.startsWith('http://') || s.startsWith('mailto:') || s.startsWith('tel:')) ? url : '#';
    }

    function buildProjectsHTML(projects, resolveImageUrl, resolvePdfLink) {
        return projects.map(p => {
            const imageLink = resolveImageUrl(p.image_url);
            const pdfLink   = safeLinkHref(resolvePdfLink(p));
            const tagsHTML  = Array.isArray(p.tags) ? p.tags.map(t => `<span class="pill">${esc(t)}</span>`).join('') : '';
            return `
    <article class="card">
        <a class="card-link" href="${esc(pdfLink)}" target="_blank" rel="noopener">
            <div class="card-media">
                ${imageLink ? `<img src="${esc(imageLink)}" alt="${esc(p.title)}" class="card-media-img">` : ''}
            </div>
            <div class="card-body">
                <h3>${esc(p.title)}</h3>
                ${p.description ? `<p class="card-description">${esc(p.description)}</p>` : ''}
                ${tagsHTML ? `<div class="card-tags">${tagsHTML}</div>` : ''}
            </div>
        </a>
    </article>`;
        }).join('');
    }

    return { esc, buildSkillsHTML, buildExperienceHTML, buildEducationHTML, buildProjectsHTML };
});
