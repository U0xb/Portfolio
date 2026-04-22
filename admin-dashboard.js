// ========================================
// STATE
// ========================================

let currentSection = null;
let currentProjectTags = [];
let currentAboutTags = [];

// ========================================
// ICONS
// ========================================

const icons = {
    edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>`,
    delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`,
    save: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
    </svg>`,
    close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`
};

// ========================================
// SECTIONS CONFIG
// ========================================

const sections = {
    hero: {
        title: 'Accueil',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
        </svg>`,
        hasAddButton: false,
        render: renderHeroSection
    },
    projects: {
        title: 'Projets',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
        </svg>`,
        hasAddButton: true,
        addText: 'Ajouter un projet',
        onAdd: () => openProjectModal(),
        render: renderProjectsSection
    },
    skills: {
        title: 'Compétences',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>`,
        hasAddButton: true,
        addText: 'Ajouter une compétence',
        onAdd: () => openSkillModal(),
        render: renderSkillsSection
    },
    about: {
        title: 'À propos',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>`,
        hasAddButton: false,
        render: renderAboutSection
    },
    experience: {
        title: 'Expériences',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>`,
        hasAddButton: true,
        addText: 'Ajouter une expérience',
        onAdd: () => openExperienceModal(),
        render: renderExperienceSection
    },
    education: {
        title: 'Formation',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
        </svg>`,
        hasAddButton: true,
        addText: 'Ajouter une formation',
        onAdd: () => openEducationModal(),
        render: renderEducationSection
    },
    contact: {
        title: 'Contact',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>`,
        hasAddButton: false,
        render: renderContactSection
    }
};

// ========================================
// NAVIGATION
// ========================================

function showSection(sectionKey) {
    const section = sections[sectionKey];
    if (!section) return;

    currentSection = sectionKey;
    document.getElementById('navigationView').style.display = 'none';
    document.getElementById('sectionView').classList.add('active');
    document.getElementById('sectionIcon').innerHTML = section.icon;
    document.getElementById('sectionTitle').textContent = section.title;

    const addButton = document.getElementById('addButton');
    if (section.hasAddButton) {
        addButton.style.display = 'inline-flex';
        document.getElementById('addButtonText').textContent = section.addText;
        addButton.onclick = section.onAdd;
    } else {
        addButton.style.display = 'none';
    }

    section.render();
}

function showNavigation() {
    currentSection = null;
    document.getElementById('navigationView').style.display = 'grid';
    document.getElementById('sectionView').classList.remove('active');
    updateCounters();
}

async function updateCounters() {
    try {
        const [projects, skills, experience, education] = await Promise.all([
            portfolioAPI.getProjects(),
            portfolioAPI.getSkills(),
            portfolioAPI.getExperience(),
            portfolioAPI.getEducation()
        ]);

        document.getElementById('projectsCount').textContent  = `${projects.length} projet${projects.length > 1 ? 's' : ''}`;
        document.getElementById('skillsCount').textContent    = `${skills.length} compétence${skills.length > 1 ? 's' : ''}`;
        document.getElementById('experienceCount').textContent = `${experience.length} expérience${experience.length > 1 ? 's' : ''}`;
        document.getElementById('educationCount').textContent  = `${education.length} formation${education.length > 1 ? 's' : ''}`;
    } catch (error) {
        console.error('Erreur mise à jour des compteurs:', error);
    }
}

// ========================================
// UTILITIES
// ========================================

function showNotification(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function showSuccess(msg) { showNotification('successMessage', msg); }
function showError(msg)   { showNotification('errorMessage', msg); }

// ========================================
// DATA LOADING
// ========================================

async function loadData(apiFn, errorMsg, fallback = null) {
    try { return await apiFn(); }
    catch (e) { showError(errorMsg + e.message); return fallback; }
}

const loadHero       = () => loadData(portfolioAPI.getHero,       'Erreur chargement hero: ');
const loadProjects   = () => loadData(portfolioAPI.getProjects,   'Erreur chargement projets: ', []);
const loadSkills     = () => loadData(portfolioAPI.getSkills,     'Erreur chargement compétences: ', []);
const loadAbout      = () => loadData(portfolioAPI.getAbout,      'Erreur chargement à propos: ');
const loadExperience = () => loadData(portfolioAPI.getExperience, 'Erreur chargement expériences: ', []);
const loadEducation  = () => loadData(portfolioAPI.getEducation,  'Erreur chargement formations: ', []);
const loadContact    = () => loadData(portfolioAPI.getContact,    'Erreur chargement contact: ');

// ========================================
// EMPTY STATE
// ========================================

function emptyStateHTML(svgInner, title, desc) {
    return `<div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${svgInner}</svg>
        <h3>${title}</h3>
        <p>${desc}</p>
    </div>`;
}

// ========================================
// RENDER SECTIONS
// ========================================

function renderHeroSection() {
    loadHero().then(hero => {
        document.getElementById('sectionContent').innerHTML = `
            <form id="heroForm" onsubmit="saveHero(event)">
                <input type="hidden" id="heroId" value="${hero?.id || ''}">
                <div class="form-group">
                    <label>Titre</label>
                    <input type="text" id="heroTitle" value="${hero?.title || ''}" placeholder="Créons des expériences web...">
                </div>
                <div class="form-group">
                    <label>Sous-titre</label>
                    <textarea id="heroSubtitle" rows="3" placeholder="Étudiant en BTS SIO...">${hero?.subtitle || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">${icons.save} Enregistrer</button>
                </div>
            </form>
        `;
    });
}

function renderProjectsSection() {
    loadProjects().then(projects => {
        const container = document.getElementById('sectionContent');

        if (!projects.length) {
            container.innerHTML = emptyStateHTML(
                `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>`,
                'Aucun projet', 'Commencez par ajouter votre premier projet'
            );
            return;
        }

        container.innerHTML = `<div class="item-list">${projects.map(project => `
            <div class="item-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.tags?.length ? `<div style="display:flex;gap:.3rem;flex-wrap:wrap;margin:.5rem 0;">${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
                <div class="item-actions">
                    <button class="btn" onclick='editProject(${JSON.stringify(project).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteProject('${project.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('')}</div>`;
    });
}

function renderSkillsSection() {
    loadSkills().then(skills => {
        const container = document.getElementById('sectionContent');

        if (!skills.length) {
            container.innerHTML = emptyStateHTML(
                `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>`,
                'Aucune compétence', 'Ajoutez vos compétences et savoir-faire'
            );
            return;
        }

        container.innerHTML = `<div class="item-list">${skills.map(skill => `
            <div class="item-card">
                ${skill.svg_icon ? `<div style="width:32px;height:32px;color:var(--accent-primary);margin-bottom:.5rem;">${skill.svg_icon}</div>` : ''}
                <h3>${skill.name}</h3>
                ${skill.description ? `<p>${skill.description}</p>` : ''}
                <div class="item-actions">
                    <button class="btn" onclick='editSkill(${JSON.stringify(skill).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteSkill('${skill.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('')}</div>`;
    });
}

function renderAboutSection() {
    loadAbout().then(about => {
        document.getElementById('sectionContent').innerHTML = `
            <form id="aboutForm" onsubmit="saveAbout(event)">
                <input type="hidden" id="aboutId" value="${about?.id || ''}">
                <input type="hidden" id="aboutImageUrl" value="${about?.image_url || ''}">
                <div class="form-group">
                    <label>Photo de profil</label>
                    <label for="aboutImageFile" class="upload-field">
                        <span class="upload-field-top">
                            <span class="upload-field-icon">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </span>
                            <span>
                                <strong>Importer une photo</strong>
                                <small>PNG, JPG, WEBP…</small>
                            </span>
                        </span>
                        <span class="upload-field-button">Choisir une image</span>
                    </label>
                    <input type="file" id="aboutImageFile" accept="image/*" class="upload-input-hidden">
                    <div class="upload-status" id="aboutImageUploadStatus"></div>
                    <div id="aboutImageDisplay" class="media-preview-card" style="display:none;">
                        <div class="media-preview-main">
                            <img id="aboutImagePreview" alt="Photo de profil" style="width:60px;height:60px;object-fit:cover;border-radius:50%;">
                            <div class="media-preview-meta">
                                <span class="media-preview-label">Photo actuelle</span>
                                <span id="aboutImageName" class="media-preview-name"></span>
                            </div>
                        </div>
                        <button type="button" id="deleteAboutImageBtn" class="btn btn-danger media-delete-btn">
                            ${icons.delete} Supprimer
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="aboutDescription" rows="5" placeholder="Parlez de vous...">${about?.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Tags (Entrée pour ajouter)</label>
                    <div class="tags-input" id="aboutTagsContainer" onclick="focusAboutTagInput()">
                        <input type="text" id="aboutTagInput" placeholder="Ex: Passionné, Créatif..." style="border:none;flex:1;outline:none;background:transparent;color:var(--text-primary);" onkeypress="addAboutTag(event)">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">${icons.save} Enregistrer</button>
                </div>
            </form>
        `;

        if (about?.image_url) updateAboutImageDisplay(about.image_url);

        setupFileInput('aboutImageFile', f => f.type.startsWith('image/'), uploadAboutImage, 'aboutImageUploadStatus', 'Veuillez sélectionner un fichier image valide');
        document.getElementById('deleteAboutImageBtn').addEventListener('click', deleteAboutImage);

        currentAboutTags = about?.tags || [];
        renderAboutTags();
    });
}

function renderExperienceSection() {
    loadExperience().then(experiences => {
        const container = document.getElementById('sectionContent');

        if (!experiences.length) {
            container.innerHTML = emptyStateHTML(
                `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>`,
                'Aucune expérience', 'Ajoutez vos expériences professionnelles'
            );
            return;
        }

        container.innerHTML = `<div class="item-list">${experiences.map(exp => `
            <div class="item-card">
                <h3>${exp.title}</h3>
                <p><strong>${exp.company}</strong>${exp.location ? ' | ' + exp.location : ''}</p>
                <span class="item-date">${exp.date}</span>
                ${exp.description ? `<p style="margin-top:.5rem;">${exp.description}</p>` : ''}
                <div class="item-actions">
                    <button class="btn" onclick='editExperience(${JSON.stringify(exp).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteExperience('${exp.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('')}</div>`;
    });
}

function renderEducationSection() {
    loadEducation().then(education => {
        const container = document.getElementById('sectionContent');

        if (!education.length) {
            container.innerHTML = emptyStateHTML(
                `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>`,
                'Aucune formation', 'Ajoutez votre parcours académique'
            );
            return;
        }

        container.innerHTML = `<div class="item-list">${education.map(edu => `
            <div class="item-card">
                <h3>${edu.title}</h3>
                <p><strong>${edu.institution}</strong></p>
                <span class="item-date">${edu.date}</span>
                ${edu.description ? `<p style="margin-top:.5rem;">${edu.description}</p>` : ''}
                <div class="item-actions">
                    <button class="btn" onclick='editEducation(${JSON.stringify(edu).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteEducation('${edu.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('')}</div>`;
    });
}

function renderContactSection() {
    loadContact().then(contact => {
        document.getElementById('sectionContent').innerHTML = `
            <form id="contactForm" onsubmit="saveContact(event)">
                <input type="hidden" id="contactId" value="${contact?.id || ''}">
                <div class="form-group">
                    <label>Téléphone</label>
                    <input type="tel" id="contactPhone" value="${contact?.phone || ''}" placeholder="06 00 00 00 00">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="contactEmail" value="${contact?.email || ''}" placeholder="votre@email.com">
                </div>
                <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="url" id="contactLinkedin" value="${contact?.linkedin || ''}" placeholder="https://www.linkedin.com/in/...">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">${icons.save} Enregistrer</button>
                </div>
            </form>
        `;
    });
}

// ========================================
// SAVE FUNCTIONS
// ========================================

async function saveHero(event) {
    event.preventDefault();
    try {
        await portfolioAPI.updateHero(document.getElementById('heroId').value, {
            title:      document.getElementById('heroTitle').value,
            subtitle:   document.getElementById('heroSubtitle').value,
            updated_at: new Date().toISOString()
        });
        showSuccess('Section Accueil mise à jour avec succès !');
    } catch (e) { showError('Erreur lors de la sauvegarde: ' + e.message); }
}

async function saveAbout(event) {
    event.preventDefault();
    try {
        await portfolioAPI.updateAbout(document.getElementById('aboutId').value, {
            description: document.getElementById('aboutDescription').value,
            tags:        currentAboutTags,
            image_url:   document.getElementById('aboutImageUrl').value || null,
            updated_at:  new Date().toISOString()
        });
        showSuccess('Section À propos mise à jour !');
    } catch (e) { showError('Erreur lors de la sauvegarde: ' + e.message); }
}

async function saveContact(event) {
    event.preventDefault();
    try {
        await portfolioAPI.updateContact(document.getElementById('contactId').value, {
            phone:      document.getElementById('contactPhone').value,
            email:      document.getElementById('contactEmail').value,
            linkedin:   document.getElementById('contactLinkedin').value,
            updated_at: new Date().toISOString()
        });
        showSuccess('Informations de contact mises à jour !');
    } catch (e) { showError('Erreur lors de la sauvegarde: ' + e.message); }
}

// ========================================
// STORAGE HELPERS
// ========================================

function sanitizeFileName(originalName) {
    const normalized = originalName.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const safe = normalized
        .replace(/[^a-zA-Z0-9.\-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    const lastDot = safe.lastIndexOf('.');
    const base = lastDot > 0 ? safe.slice(0, lastDot) : safe || 'file';
    const ext  = lastDot > 0 ? safe.slice(lastDot) : '';
    return `${base.slice(0, 80)}${ext}` || `file${ext || '.pdf'}`;
}

function getStoragePublicUrl(bucket, fileName) {
    if (!fileName) return '';
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) return fileName;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data?.publicUrl || '';
}

function getDisplayFileName(fileName) {
    if (!fileName) return '';
    return fileName.includes('-') && /^\d+-/.test(fileName)
        ? fileName.substring(fileName.indexOf('-') + 1)
        : fileName;
}

async function uploadFile(file, bucket, statusId, inputId, displayFn, successMsg) {
    const statusDiv = document.getElementById(statusId);
    try {
        statusDiv.textContent = '⏳ Upload en cours...';
        statusDiv.classList.add('show', 'loading');
        statusDiv.classList.remove('success', 'error');

        const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
        const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
            cacheControl: '3600', upsert: false, contentType: file.type
        });
        if (error) throw error;

        if (inputId)   document.getElementById(inputId).value = fileName;
        if (displayFn) displayFn(fileName);

        statusDiv.textContent = `✅ ${successMsg}`;
        statusDiv.classList.remove('loading');
        statusDiv.classList.add('success');
        return fileName;
    } catch (error) {
        statusDiv.textContent = '❌ Erreur: ' + error.message;
        statusDiv.classList.remove('loading');
        statusDiv.classList.add('error');
        throw error;
    }
}

async function deleteStorageFile(bucket, urlInputId, fileInputId, statusId, hideFn, confirmMsg, successMsg) {
    const fileUrl = document.getElementById(urlInputId).value;
    if (!fileUrl || !confirm(confirmMsg)) return;
    try {
        let fileName = fileUrl;
        if (fileUrl.startsWith('http')) {
            const parts = fileUrl.split('/');
            fileName = parts[parts.length - 1];
        }
        const { error } = await supabase.storage.from(bucket).remove([fileName]);
        if (error) console.warn('Erreur suppression fichier:', error);

        document.getElementById(urlInputId).value = '';
        document.getElementById(fileInputId).value = '';
        hideFn();

        const statusDiv = document.getElementById(statusId);
        if (statusDiv) {
            statusDiv.textContent = '';
            statusDiv.classList.remove('show', 'success', 'error', 'loading');
        }
        showSuccess(successMsg);
    } catch (error) {
        showError('Erreur lors de la suppression: ' + error.message);
    }
}

function setupFileInput(inputId, typeCheck, uploadFn, statusId, errorMsg) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file && typeCheck(file)) {
            await uploadFn(file);
        } else if (file) {
            const statusDiv = document.getElementById(statusId);
            statusDiv.textContent = `❌ ${errorMsg}`;
            statusDiv.classList.add('show', 'error');
        }
    });
}

// ========================================
// IMAGE / PDF UPLOAD & DISPLAY
// ========================================

async function uploadProjectImage(file) {
    return uploadFile(file, 'project-images', 'imageUploadStatus', 'projectImageUrl', updateImageDisplay, 'Image uploadée avec succès !');
}

async function uploadPDF(file) {
    return uploadFile(file, 'project-pdfs', 'pdfUploadStatus', 'projectPdfUrl', updatePdfDisplay, 'PDF uploadé avec succès !');
}

async function uploadAboutImage(file) {
    return uploadFile(file, 'project-images', 'aboutImageUploadStatus', 'aboutImageUrl', updateAboutImageDisplay, 'Photo uploadée avec succès !');
}

function updateImageDisplay(fileName) {
    const display  = document.getElementById('currentImageDisplay');
    const nameSpan = document.getElementById('currentImageName');
    const preview  = document.getElementById('currentImagePreview');
    if (display && nameSpan && preview) {
        nameSpan.textContent = getDisplayFileName(fileName);
        preview.src = getStoragePublicUrl('project-images', fileName);
        display.style.display = 'flex';
    }
}

function updatePdfDisplay(fileName) {
    const display  = document.getElementById('currentPdfDisplay');
    const nameSpan = document.getElementById('currentPdfName');
    if (display && nameSpan) {
        nameSpan.textContent = getDisplayFileName(fileName);
        display.style.display = 'flex';
    }
}

function updateAboutImageDisplay(fileName) {
    const display  = document.getElementById('aboutImageDisplay');
    const nameSpan = document.getElementById('aboutImageName');
    const preview  = document.getElementById('aboutImagePreview');
    if (display && nameSpan && preview) {
        nameSpan.textContent = getDisplayFileName(fileName);
        preview.src = getStoragePublicUrl('project-images', fileName);
        display.style.display = 'flex';
    }
}

function hideImageDisplay() {
    const display  = document.getElementById('currentImageDisplay');
    const preview  = document.getElementById('currentImagePreview');
    if (display) display.style.display = 'none';
    if (preview) preview.removeAttribute('src');
}

function hidePdfDisplay() {
    const display = document.getElementById('currentPdfDisplay');
    if (display) display.style.display = 'none';
}

function hideAboutImageDisplay() {
    const display  = document.getElementById('aboutImageDisplay');
    const preview  = document.getElementById('aboutImagePreview');
    if (display) display.style.display = 'none';
    if (preview) preview.removeAttribute('src');
}

async function deleteProjectImage() {
    return deleteStorageFile('project-images', 'projectImageUrl', 'projectImageFile', 'imageUploadStatus', hideImageDisplay, 'Êtes-vous sûr de vouloir supprimer cette image ?', 'Image supprimée avec succès !');
}

async function deletePDF() {
    return deleteStorageFile('project-pdfs', 'projectPdfUrl', 'projectPdfFile', 'pdfUploadStatus', hidePdfDisplay, 'Êtes-vous sûr de vouloir supprimer ce PDF ?', 'PDF supprimé avec succès !');
}

async function deleteAboutImage() {
    return deleteStorageFile('project-images', 'aboutImageUrl', 'aboutImageFile', 'aboutImageUploadStatus', hideAboutImageDisplay, 'Êtes-vous sûr de vouloir supprimer cette photo ?', 'Photo supprimée avec succès !');
}

// ========================================
// TAGS MANAGEMENT
// ========================================

function renderTags(tags, containerId, inputId, removeFnName) {
    const container = document.getElementById(containerId);
    const input     = document.getElementById(inputId);
    container.innerHTML = tags.map((tag, i) => `
        <span class="tag">${tag}<button type="button" onclick="${removeFnName}(${i})">${icons.close}</button></span>
    `).join('') + input.outerHTML;
}

function addTag(event, tags, inputId, renderFn) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    if (val && !tags.includes(val)) { tags.push(val); renderFn(); input.value = ''; }
}

function renderProjectTags() { renderTags(currentProjectTags, 'projectTagsContainer', 'projectTagInput', 'removeProjectTag'); }
function renderAboutTags()   { renderTags(currentAboutTags,   'aboutTagsContainer',   'aboutTagInput',   'removeAboutTag'); }
function addProjectTag(e)    { addTag(e, currentProjectTags, 'projectTagInput', renderProjectTags); }
function addAboutTag(e)      { addTag(e, currentAboutTags,   'aboutTagInput',   renderAboutTags); }
function removeProjectTag(i) { currentProjectTags.splice(i, 1); renderProjectTags(); }
function removeAboutTag(i)   { currentAboutTags.splice(i, 1);   renderAboutTags(); }
function focusTagInput()     { document.getElementById('projectTagInput').focus(); }
function focusAboutTagInput(){ document.getElementById('aboutTagInput').focus(); }

// ========================================
// MODALS - PROJECTS
// ========================================

function openProjectModal(project = null) {
    const modal = document.getElementById('projectModal');
    document.getElementById('projectModalTitle').textContent = project ? 'Modifier le projet' : 'Ajouter un projet';

    if (project) {
        document.getElementById('projectId').value          = project.id;
        document.getElementById('projectTitle').value       = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectLink').value        = project.link || '';
        document.getElementById('projectImageUrl').value    = project.image_url || '';
        document.getElementById('projectPdfUrl').value      = project.pdf_url || '';
        document.getElementById('projectOrder').value       = project.order_index || 0;
        currentProjectTags = project.tags || [];
        renderProjectTags();
        project.image_url ? updateImageDisplay(project.image_url) : hideImageDisplay();
        project.pdf_url   ? updatePdfDisplay(project.pdf_url)     : hidePdfDisplay();
    } else {
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value       = '';
        document.getElementById('projectImageUrl').value = '';
        document.getElementById('projectPdfUrl').value   = '';
        currentProjectTags = [];
        renderProjectTags();
        hideImageDisplay();
        hidePdfDisplay();
    }

    modal.classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    hideImageDisplay();
    hidePdfDisplay();
}

function editProject(project) { openProjectModal(project); }

async function deleteProject(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    try {
        await portfolioAPI.deleteProject(id);
        showSuccess('Projet supprimé !');
        renderProjectsSection();
    } catch (e) { showError('Erreur lors de la suppression: ' + e.message); }
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const projectData = {
            title:       document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            link:        document.getElementById('projectLink').value || null,
            image_url:   document.getElementById('projectImageUrl').value || null,
            pdf_url:     document.getElementById('projectPdfUrl').value || null,
            tags:        currentProjectTags,
            order_index: parseInt(document.getElementById('projectOrder').value) || 0
        };
        const id = document.getElementById('projectId').value;
        if (id) {
            await portfolioAPI.updateProject(id, projectData);
            showSuccess('Projet modifié !');
        } else {
            await portfolioAPI.createProject(projectData);
            showSuccess('Projet créé !');
        }
        closeProjectModal();
        renderProjectsSection();
    } catch (e) { showError('Erreur: ' + e.message); }
});

// ========================================
// MODALS - SKILLS
// ========================================

function openSkillModal(skill = null) {
    const modal = document.getElementById('skillModal');
    document.getElementById('skillModalTitle').textContent = skill ? 'Modifier la compétence' : 'Ajouter une compétence';

    if (skill) {
        document.getElementById('skillId').value          = skill.id;
        document.getElementById('skillName').value        = skill.name;
        document.getElementById('skillDescription').value = skill.description || '';
        document.getElementById('skillSvg').value         = skill.svg_icon || '';
        document.getElementById('skillOrder').value       = skill.order_index || 0;
        previewSkillSvg();
    } else {
        document.getElementById('skillForm').reset();
        document.getElementById('skillId').value = '';
        document.getElementById('skillSvgPreview').innerHTML = '';
    }

    modal.classList.add('active');
}

function closeSkillModal() { document.getElementById('skillModal').classList.remove('active'); }

function previewSkillSvg() {
    const svg     = document.getElementById('skillSvg').value.trim();
    const preview = document.getElementById('skillSvgPreview');
    preview.innerHTML = '';
    if (!svg.startsWith('<svg')) return;
    const doc   = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (svgEl && !doc.querySelector('parsererror')) {
        svgEl.style.width = svgEl.style.height = '100%';
        preview.appendChild(document.importNode(svgEl, true));
    }
}

function editSkill(skill) { openSkillModal(skill); }

async function deleteSkill(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;
    try {
        await portfolioAPI.deleteSkill(id);
        showSuccess('Compétence supprimée !');
        renderSkillsSection();
    } catch (e) { showError('Erreur lors de la suppression: ' + e.message); }
}

document.getElementById('skillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const skillData = {
            name:        document.getElementById('skillName').value,
            description: document.getElementById('skillDescription').value || null,
            svg_icon:    document.getElementById('skillSvg').value || null,
            order_index: parseInt(document.getElementById('skillOrder').value) || 0
        };
        const id = document.getElementById('skillId').value;
        if (id) {
            await portfolioAPI.updateSkill(id, skillData);
            showSuccess('Compétence modifiée !');
        } else {
            await portfolioAPI.createSkill(skillData);
            showSuccess('Compétence créée !');
        }
        closeSkillModal();
        renderSkillsSection();
    } catch (e) { showError('Erreur: ' + e.message); }
});

// ========================================
// MODALS - EXPERIENCE
// ========================================

function openExperienceModal(experience = null) {
    const modal = document.getElementById('experienceModal');
    document.getElementById('experienceModalTitle').textContent = experience ? 'Modifier l\'expérience' : 'Ajouter une expérience';

    if (experience) {
        document.getElementById('experienceId').value          = experience.id;
        document.getElementById('experienceTitle').value       = experience.title;
        document.getElementById('experienceCompany').value     = experience.company;
        document.getElementById('experienceDate').value        = experience.date;
        document.getElementById('experienceLocation').value    = experience.location || '';
        document.getElementById('experienceDescription').value = experience.description || '';
        document.getElementById('experienceOrder').value       = experience.order_index || 0;
    } else {
        document.getElementById('experienceForm').reset();
        document.getElementById('experienceId').value = '';
    }

    modal.classList.add('active');
}

function closeExperienceModal() { document.getElementById('experienceModal').classList.remove('active'); }

function editExperience(experience) { openExperienceModal(experience); }

async function deleteExperience(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) return;
    try {
        await portfolioAPI.deleteExperience(id);
        showSuccess('Expérience supprimée !');
        renderExperienceSection();
    } catch (e) { showError('Erreur lors de la suppression: ' + e.message); }
}

document.getElementById('experienceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const experienceData = {
            title:       document.getElementById('experienceTitle').value,
            company:     document.getElementById('experienceCompany').value,
            date:        document.getElementById('experienceDate').value,
            location:    document.getElementById('experienceLocation').value || null,
            description: document.getElementById('experienceDescription').value || null,
            order_index: parseInt(document.getElementById('experienceOrder').value) || 0
        };
        const id = document.getElementById('experienceId').value;
        if (id) {
            await portfolioAPI.updateExperience(id, experienceData);
            showSuccess('Expérience modifiée !');
        } else {
            await portfolioAPI.createExperience(experienceData);
            showSuccess('Expérience créée !');
        }
        closeExperienceModal();
        renderExperienceSection();
    } catch (e) { showError('Erreur: ' + e.message); }
});

// ========================================
// MODALS - EDUCATION
// ========================================

function openEducationModal(education = null) {
    const modal = document.getElementById('educationModal');
    document.getElementById('educationModalTitle').textContent = education ? 'Modifier la formation' : 'Ajouter une formation';

    if (education) {
        document.getElementById('educationId').value          = education.id;
        document.getElementById('educationTitle').value       = education.title;
        document.getElementById('educationInstitution').value = education.institution;
        document.getElementById('educationDate').value        = education.date;
        document.getElementById('educationDescription').value = education.description || '';
        document.getElementById('educationOrder').value       = education.order_index || 0;
    } else {
        document.getElementById('educationForm').reset();
        document.getElementById('educationId').value = '';
    }

    modal.classList.add('active');
}

function closeEducationModal() { document.getElementById('educationModal').classList.remove('active'); }

function editEducation(education) { openEducationModal(education); }

async function deleteEducation(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;
    try {
        await portfolioAPI.deleteEducation(id);
        showSuccess('Formation supprimée !');
        renderEducationSection();
    } catch (e) { showError('Erreur lors de la suppression: ' + e.message); }
}

document.getElementById('educationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const educationData = {
            title:       document.getElementById('educationTitle').value,
            institution: document.getElementById('educationInstitution').value,
            date:        document.getElementById('educationDate').value,
            description: document.getElementById('educationDescription').value || null,
            order_index: parseInt(document.getElementById('educationOrder').value) || 0
        };
        const id = document.getElementById('educationId').value;
        if (id) {
            await portfolioAPI.updateEducation(id, educationData);
            showSuccess('Formation modifiée !');
        } else {
            await portfolioAPI.createEducation(educationData);
            showSuccess('Formation créée !');
        }
        closeEducationModal();
        renderEducationSection();
    } catch (e) { showError('Erreur: ' + e.message); }
});

// ========================================
// INITIALIZATION
// ========================================

document.getElementById('deleteImageBtn')?.addEventListener('click', deleteProjectImage);
document.getElementById('deletePdfBtn')?.addEventListener('click', deletePDF);

setupFileInput('projectImageFile', f => f.type.startsWith('image/'), uploadProjectImage, 'imageUploadStatus', 'Veuillez sélectionner un fichier image valide');
setupFileInput('projectPdfFile',   f => f.type === 'application/pdf', uploadPDF,          'pdfUploadStatus',   'Veuillez sélectionner un fichier PDF');

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = 'admin-login.html'; return; }
    await updateCounters();
});
