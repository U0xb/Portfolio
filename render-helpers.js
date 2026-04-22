// ========================================
// MODULE PARTAGÉ — fonctionne en Node.js (build.js) et dans le navigateur
// ========================================

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) module.exports = factory();
    else root.renderHelpers = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {

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
            const company     = e.company || e.entreprise || e.organization || e.organisation || e.employer || '';
            const type        = e.type || e.contract || '';
            const companyLine = company
                ? `${company}${type ? ` <span class="accent">—</span> ${type}` : ''}`
                : e.title;
            const lines    = e.description ? e.description.split('\n').map(l => l.trim()).filter(Boolean) : [];
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

    // resolveImageUrl(filename) → string url ou ''
    // resolvePdfLink(project)  → string url
    function esc(s) {
        return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function buildProjectsHTML(projects, resolveImageUrl, resolvePdfLink) {
        return projects.map(p => {
            const imageLink = resolveImageUrl(p.image_url);
            const pdfLink   = resolvePdfLink(p);
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

    return { buildSkillsHTML, buildExperienceHTML, buildEducationHTML, buildProjectsHTML };
});
