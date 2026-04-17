// ========================================
// NAVIGATION SYSTEM
// ========================================

let currentSection = null;
let currentProjectTags = [];
let currentAboutTags = [];

// Configuration des sections
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

// Afficher une section spécifique
function showSection(sectionKey) {
    const section = sections[sectionKey];
    if (!section) return;
    
    currentSection = sectionKey;
    
    // Masquer navigation, afficher section view
    document.getElementById('navigationView').style.display = 'none';
    document.getElementById('sectionView').classList.add('active');
    
    // Mettre à jour le header
    document.getElementById('sectionIcon').innerHTML = section.icon;
    document.getElementById('sectionTitle').textContent = section.title;
    
    // Gérer le bouton "Ajouter"
    const addButton = document.getElementById('addButton');
    if (section.hasAddButton) {
        addButton.style.display = 'inline-flex';
        document.getElementById('addButtonText').textContent = section.addText;
        addButton.onclick = section.onAdd;
    } else {
        addButton.style.display = 'none';
    }
    
    // Rendre le contenu de la section
    section.render();
}

// Retour à la navigation
function showNavigation() {
    currentSection = null;
    document.getElementById('navigationView').style.display = 'grid';
    document.getElementById('sectionView').classList.remove('active');
    
    // Recharger les compteurs
    updateCounters();
}

// Mettre à jour les compteurs sur les cartes
async function updateCounters() {
    try {
        const [projects, skills, experience, education] = await Promise.all([
            portfolioAPI.getProjects(),
            portfolioAPI.getSkills(),
            portfolioAPI.getExperience(),
            portfolioAPI.getEducation()
        ]);
        
        document.getElementById('projectsCount').textContent = `${projects.length} projet${projects.length > 1 ? 's' : ''}`;
        document.getElementById('skillsCount').textContent = `${skills.length} compétence${skills.length > 1 ? 's' : ''}`;
        document.getElementById('experienceCount').textContent = `${experience.length} expérience${experience.length > 1 ? 's' : ''}`;
        document.getElementById('educationCount').textContent = `${education.length} formation${education.length > 1 ? 's' : ''}`;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des compteurs:', error);
    }
}

// ========================================
// RENDER SECTIONS
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
                    <button type="submit" class="btn btn-success">
                        ${icons.save} Enregistrer
                    </button>
                </div>
            </form>
        `;
    });
}

function renderProjectsSection() {
    loadProjects().then(projects => {
        const container = document.getElementById('sectionContent');
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <h3>Aucun projet</h3>
                    <p>Commencez par ajouter votre premier projet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="item-list">
                ${projects.map(project => `
                    <div class="item-card">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        ${project.tags && project.tags.length > 0 ? `
                            <div style="display: flex; gap: 0.3rem; flex-wrap: wrap; margin: 0.5rem 0;">
                                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="item-actions">
                            <button class="btn" onclick='editProject(${JSON.stringify(project).replace(/'/g, "&apos;")})'>
                                ${icons.edit} Modifier
                            </button>
                            <button class="btn btn-danger" onclick="deleteProject('${project.id}')">
                                ${icons.delete} Supprimer
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });
}

function renderSkillsSection() {
    loadSkills().then(skills => {
        const container = document.getElementById('sectionContent');
        
        if (skills.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                    <h3>Aucune compétence</h3>
                    <p>Ajoutez vos compétences et savoir-faire</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="item-list">
                ${skills.map(skill => `
                    <div class="item-card">
                        ${skill.svg_icon ? `<div style="width:32px;height:32px;color:var(--accent-primary);margin-bottom:0.5rem;">${skill.svg_icon}</div>` : ''}
                        <h3>${skill.name}</h3>
                        ${skill.description ? `<p>${skill.description}</p>` : ''}
                        <div class="item-actions">
                            <button class="btn" onclick='editSkill(${JSON.stringify(skill).replace(/'/g, "&apos;")})'>                                ${icons.edit} Modifier
                            </button>
                            <button class="btn btn-danger" onclick="deleteSkill('${skill.id}')">
                                ${icons.delete} Supprimer
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
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
                    <div id="aboutImageDisplay" class="media-preview-card" style="display: none;">
                        <div class="media-preview-main">
                            <img id="aboutImagePreview" alt="Photo de profil" style="width:60px;height:60px;object-fit:cover;border-radius:50%;">
                            <div class="media-preview-meta">
                                <span class="media-preview-label">Photo actuelle</span>
                                <span id="aboutImageName" class="media-preview-name"></span>
                            </div>
                        </div>
                        <button type="button" id="deleteAboutImageBtn" class="btn btn-danger media-delete-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Supprimer
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
                    <button type="submit" class="btn btn-success">
                        ${icons.save} Enregistrer
                    </button>
                </div>
            </form>
        `;

        if (about?.image_url) {
            updateAboutImageDisplay(about.image_url);
        }

        document.getElementById('aboutImageFile').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                await uploadAboutImage(file);
            } else if (file) {
                const statusDiv = document.getElementById('aboutImageUploadStatus');
                statusDiv.textContent = '❌ Veuillez sélectionner un fichier image valide';
                statusDiv.classList.add('show', 'error');
            }
        });

        document.getElementById('deleteAboutImageBtn').addEventListener('click', deleteAboutImage);

        currentAboutTags = about?.tags || [];
        renderAboutTags();
    });
}

function renderExperienceSection() {
    loadExperience().then(experiences => {
        const container = document.getElementById('sectionContent');
        
        if (experiences.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <h3>Aucune expérience</h3>
                    <p>Ajoutez vos expériences professionnelles</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="item-list">
                ${experiences.map(exp => `
                    <div class="item-card">
                        <h3>${exp.title}</h3>
                        <p><strong>${exp.company}</strong>${exp.location ? ' | ' + exp.location : ''}</p>
                        <span style="display:inline-block;background:rgba(255,106,0,.08);border:1px solid rgba(255,106,0,.2);color:var(--accent-primary);font-family:'JetBrains Mono',monospace;font-size:.75rem;font-weight:700;padding:.28rem .75rem;border-radius:6px;margin-bottom:.35rem;">${exp.date}</span>
                        ${exp.description ? `<p style="margin-top: 0.5rem;">${exp.description}</p>` : ''}
                        <div class="item-actions">
                            <button class="btn" onclick='editExperience(${JSON.stringify(exp).replace(/'/g, "&apos;")})'>                                ${icons.edit} Modifier
                            </button>
                            <button class="btn btn-danger" onclick="deleteExperience('${exp.id}')">
                                ${icons.delete} Supprimer
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });
}

function renderEducationSection() {
    loadEducation().then(education => {
        const container = document.getElementById('sectionContent');
        
        if (education.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                    <h3>Aucune formation</h3>
                    <p>Ajoutez votre parcours académique</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="item-list">
                ${education.map(edu => `
                    <div class="item-card">
                        <h3>${edu.title}</h3>
                        <p><strong>${edu.institution}</strong></p>
                        <span style="display:inline-block;background:rgba(255,106,0,.08);border:1px solid rgba(255,106,0,.2);color:var(--accent-primary);font-family:'JetBrains Mono',monospace;font-size:.75rem;font-weight:700;padding:.28rem .75rem;border-radius:6px;margin-bottom:.35rem;">${edu.date}</span>
                        ${edu.description ? `<p style="margin-top: 0.5rem;">${edu.description}</p>` : ''}
                        <div class="item-actions">
                            <button class="btn" onclick='editEducation(${JSON.stringify(edu).replace(/'/g, "&apos;")})'>                                ${icons.edit} Modifier
                            </button>
                            <button class="btn btn-danger" onclick="deleteEducation('${edu.id}')">
                                ${icons.delete} Supprimer
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
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
                    <button type="submit" class="btn btn-success">
                        ${icons.save} Enregistrer
                    </button>
                </div>
            </form>
        `;
    });
}

// ========================================
// DATA LOADING
// ========================================

async function loadHero() {
    try {
        return await portfolioAPI.getHero();
    } catch (error) {
        showError('Erreur lors du chargement du hero: ' + error.message);
        return null;
    }
}

async function loadProjects() {
    try {
        return await portfolioAPI.getProjects();
    } catch (error) {
        showError('Erreur lors du chargement des projets: ' + error.message);
        return [];
    }
}

async function loadSkills() {
    try {
        return await portfolioAPI.getSkills();
    } catch (error) {
        showError('Erreur lors du chargement des compétences: ' + error.message);
        return [];
    }
}

async function loadAbout() {
    try {
        return await portfolioAPI.getAbout();
    } catch (error) {
        showError('Erreur lors du chargement de À propos: ' + error.message);
        return null;
    }
}

async function loadExperience() {
    try {
        return await portfolioAPI.getExperience();
    } catch (error) {
        showError('Erreur lors du chargement des expériences: ' + error.message);
        return [];
    }
}

async function loadEducation() {
    try {
        return await portfolioAPI.getEducation();
    } catch (error) {
        showError('Erreur lors du chargement des formations: ' + error.message);
        return [];
    }
}

async function loadContact() {
    try {
        return await portfolioAPI.getContact();
    } catch (error) {
        showError('Erreur lors du chargement du contact: ' + error.message);
        return null;
    }
}

// ========================================
// SAVE FUNCTIONS
// ========================================

async function saveHero(event) {
    event.preventDefault();
    try {
        const id = document.getElementById('heroId').value;
        const updates = {
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value,
            updated_at: new Date().toISOString()
        };
        
        await portfolioAPI.updateHero(id, updates);
        showSuccess('Section Accueil mise à jour avec succès !');
    } catch (error) {
        showError('Erreur lors de la sauvegarde: ' + error.message);
    }
}

async function saveAbout(event) {
    event.preventDefault();
    try {
        const id = document.getElementById('aboutId').value;
        const updates = {
            description: document.getElementById('aboutDescription').value,
            tags: currentAboutTags,
            image_url: document.getElementById('aboutImageUrl').value || null,
            updated_at: new Date().toISOString()
        };

        await portfolioAPI.updateAbout(id, updates);
        showSuccess('Section À propos mise à jour !');
    } catch (error) {
        showError('Erreur lors de la sauvegarde: ' + error.message);
    }
}

async function saveContact(event) {
    event.preventDefault();
    try {
        const id = document.getElementById('contactId').value;
        const updates = {
            phone: document.getElementById('contactPhone').value,
            email: document.getElementById('contactEmail').value,
            linkedin: document.getElementById('contactLinkedin').value,
            updated_at: new Date().toISOString()
        };
        
        await portfolioAPI.updateContact(id, updates);
        showSuccess('Informations de contact mises à jour !');
    } catch (error) {
        showError('Erreur lors de la sauvegarde: ' + error.message);
    }
}

// ========================================
// ABOUT IMAGE UPLOAD
// ========================================

async function uploadAboutImage(file) {
    const statusDiv = document.getElementById('aboutImageUploadStatus');

    try {
        statusDiv.textContent = '⏳ Upload image en cours...';
        statusDiv.classList.add('show', 'loading');
        statusDiv.classList.remove('success', 'error');

        const timestamp = Date.now();
        const fileName = `${timestamp}-${sanitizeFileName(file.name)}`;

        const { error } = await supabase.storage
            .from('project-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type || 'image/*'
            });

        if (error) throw error;

        document.getElementById('aboutImageUrl').value = fileName;
        updateAboutImageDisplay(fileName);

        statusDiv.textContent = '✅ Photo uploadée avec succès !';
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

function updateAboutImageDisplay(fileName) {
    const display = document.getElementById('aboutImageDisplay');
    const nameSpan = document.getElementById('aboutImageName');
    const preview = document.getElementById('aboutImagePreview');

    if (display && nameSpan && preview) {
        nameSpan.textContent = getDisplayFileName(fileName);
        preview.src = getStoragePublicUrl('project-images', fileName);
        display.style.display = 'flex';
    }
}

function hideAboutImageDisplay() {
    const display = document.getElementById('aboutImageDisplay');
    const preview = document.getElementById('aboutImagePreview');
    if (display) display.style.display = 'none';
    if (preview) preview.removeAttribute('src');
}

async function deleteAboutImage() {
    const imageUrl = document.getElementById('aboutImageUrl').value;

    if (!imageUrl) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;

    try {
        let fileName = imageUrl;
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            const urlParts = imageUrl.split('/');
            fileName = urlParts[urlParts.length - 1];
        }

        const { error } = await supabase.storage
            .from('project-images')
            .remove([fileName]);

        if (error) {
            console.warn('Erreur lors de la suppression du fichier:', error);
        }

        document.getElementById('aboutImageUrl').value = '';
        document.getElementById('aboutImageFile').value = '';
        hideAboutImageDisplay();

        const statusDiv = document.getElementById('aboutImageUploadStatus');
        if (statusDiv) {
            statusDiv.textContent = '';
            statusDiv.classList.remove('show', 'success', 'error', 'loading');
        }

        showSuccess('Photo supprimée avec succès !');
    } catch (error) {
        showError('Erreur lors de la suppression: ' + error.message);
    }
}

// ========================================
// TAGS MANAGEMENT
// ========================================

function renderProjectTags() {
    const container = document.getElementById('projectTagsContainer');
    const input = document.getElementById('projectTagInput');
    
    container.innerHTML = currentProjectTags.map((tag, index) => `
        <span class="tag">
            ${tag}
            <button type="button" onclick="removeProjectTag(${index})">${icons.close}</button>
        </span>
    `).join('') + input.outerHTML;
}

function addProjectTag(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = document.getElementById('projectTagInput');
        const value = input.value.trim();
        
        if (value && !currentProjectTags.includes(value)) {
            currentProjectTags.push(value);
            renderProjectTags();
            input.value = '';
        }
    }
}

function removeProjectTag(index) {
    currentProjectTags.splice(index, 1);
    renderProjectTags();
}

function focusTagInput() {
    document.getElementById('projectTagInput').focus();
}

function renderAboutTags() {
    const container = document.getElementById('aboutTagsContainer');
    const input = document.getElementById('aboutTagInput');
    
    container.innerHTML = currentAboutTags.map((tag, index) => `
        <span class="tag">
            ${tag}
            <button type="button" onclick="removeAboutTag(${index})">${icons.close}</button>
        </span>
    `).join('') + input.outerHTML;
}

function addAboutTag(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = document.getElementById('aboutTagInput');
        const value = input.value.trim();
        
        if (value && !currentAboutTags.includes(value)) {
            currentAboutTags.push(value);
            renderAboutTags();
            input.value = '';
        }
    }
}

function removeAboutTag(index) {
    currentAboutTags.splice(index, 1);
    renderAboutTags();
}

function focusAboutTagInput() {
    document.getElementById('aboutTagInput').focus();
}

// ========================================
// MODALS - PROJECTS
// ========================================

function openProjectModal(project = null) {
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('projectModalTitle');
    
    if (project) {
        title.textContent = 'Modifier le projet';
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectLink').value = project.link || '';
        document.getElementById('projectImageUrl').value = project.image_url || '';
        document.getElementById('projectPdfUrl').value = project.pdf_url || '';
        document.getElementById('projectOrder').value = project.order_index || 0;
        currentProjectTags = project.tags || [];
        renderProjectTags();
        
        if (project.image_url) {
            updateImageDisplay(project.image_url);
        } else {
            hideImageDisplay();
        }

        if (project.pdf_url) {
            updatePdfDisplay(project.pdf_url);
        } else {
            hidePdfDisplay();
        }
    } else {
        title.textContent = 'Ajouter un projet';
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        document.getElementById('projectImageUrl').value = '';
        document.getElementById('projectPdfUrl').value = '';
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

function editProject(project) {
    openProjectModal(project);
}

async function deleteProject(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    try {
        await portfolioAPI.deleteProject(id);
        showSuccess('Projet supprimé !');
        renderProjectsSection();
    } catch (error) {
        showError('Erreur lors de la suppression: ' + error.message);
    }
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const projectData = {
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            link: document.getElementById('projectLink').value || null,
            image_url: document.getElementById('projectImageUrl').value || null,
            pdf_url: document.getElementById('projectPdfUrl').value || null,
            tags: currentProjectTags,
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
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// Nettoyage des noms de fichiers pour Supabase Storage
function sanitizeFileName(originalName) {
    const normalized = originalName
        .normalize('NFD') // sépare les accents
        .replace(/[\u0300-\u036f]/g, ''); // supprime les accents
    
    const safe = normalized
        .replace(/[^a-zA-Z0-9.\-_]/g, '-') // remplace les caractères spéciaux
        .replace(/-+/g, '-') // évite les doubles tirets
        .replace(/^-+|-+$/g, ''); // supprime les tirets en bordure
    
    // Sépare nom / extension pour conserver l'extension
    const lastDot = safe.lastIndexOf('.');
    const base = lastDot > 0 ? safe.slice(0, lastDot) : safe || 'file';
    const ext = lastDot > 0 ? safe.slice(lastDot) : '';
    
    // Tronque pour éviter des clés trop longues
    const truncatedBase = base.slice(0, 80);
    return `${truncatedBase}${ext}` || `file${ext || '.pdf'}`;
}

// Upload PDF
async function uploadProjectImage(file) {
    const statusDiv = document.getElementById('imageUploadStatus');
    
    try {
        statusDiv.textContent = '⏳ Upload image en cours...';
        statusDiv.classList.add('show', 'loading');
        statusDiv.classList.remove('success', 'error');
        
        const timestamp = Date.now();
        const fileName = `${timestamp}-${sanitizeFileName(file.name)}`;
        
        const { error } = await supabase.storage
            .from('project-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type || 'image/*'
            });
        
        if (error) throw error;
        
        document.getElementById('projectImageUrl').value = fileName;
        updateImageDisplay(fileName);
        
        statusDiv.textContent = '✅ Image uploadée avec succès !';
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

// Upload PDF
async function uploadPDF(file) {
    const statusDiv = document.getElementById('pdfUploadStatus');
    
    try {
        statusDiv.textContent = '⏳ Upload en cours...';
        statusDiv.classList.add('show', 'loading');
        statusDiv.classList.remove('success', 'error');
        
        const timestamp = Date.now();
        const fileName = `${timestamp}-${sanitizeFileName(file.name)}`;
        
        const { data, error } = await supabase.storage
            .from('project-pdfs')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type || 'application/pdf'
            });
        
        if (error) throw error;
        
        // Stocker seulement le nom du fichier (pas l'URL complète)
        // L'URL sera générée côté client lors de l'affichage
        document.getElementById('projectPdfUrl').value = fileName;
        
        // Afficher le PDF uploadé
        updatePdfDisplay(fileName);
        
        statusDiv.textContent = '✅ PDF uploadé avec succès !';
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

// Fonction pour mettre à jour l'affichage du PDF
function getStoragePublicUrl(bucket, fileName) {
    if (!fileName) return '';
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
        return fileName;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data?.publicUrl || '';
}

function getDisplayFileName(fileName) {
    if (!fileName) return '';
    return fileName.includes('-') && /^\d+-/.test(fileName)
        ? fileName.substring(fileName.indexOf('-') + 1)
        : fileName;
}

function updateImageDisplay(fileName) {
    const display = document.getElementById('currentImageDisplay');
    const nameSpan = document.getElementById('currentImageName');
    const preview = document.getElementById('currentImagePreview');

    if (display && nameSpan && preview) {
        nameSpan.textContent = getDisplayFileName(fileName);
        preview.src = getStoragePublicUrl('project-images', fileName);
        display.style.display = 'flex';
    }
}

function updatePdfDisplay(fileName) {
    const display = document.getElementById('currentPdfDisplay');
    const nameSpan = document.getElementById('currentPdfName');
    
    if (display && nameSpan) {
        nameSpan.textContent = getDisplayFileName(fileName);
        display.style.display = 'flex';
    }
}

function hideImageDisplay() {
    const display = document.getElementById('currentImageDisplay');
    const preview = document.getElementById('currentImagePreview');
    if (display) {
        display.style.display = 'none';
    }
    if (preview) {
        preview.removeAttribute('src');
    }
}

// Fonction pour masquer l'affichage du PDF
function hidePdfDisplay() {
    const display = document.getElementById('currentPdfDisplay');
    if (display) {
        display.style.display = 'none';
    }
}

// Fonction pour supprimer l'image
async function deleteProjectImage() {
    const imageUrl = document.getElementById('projectImageUrl').value;
    
    if (!imageUrl) {
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
        return;
    }
    
    try {
        let fileName = imageUrl;
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            const urlParts = imageUrl.split('/');
            fileName = urlParts[urlParts.length - 1];
        }
        
        const { error } = await supabase.storage
            .from('project-images')
            .remove([fileName]);
        
        if (error) {
            console.warn('Erreur lors de la suppression du fichier image:', error);
        }
        
        document.getElementById('projectImageUrl').value = '';
        document.getElementById('projectImageFile').value = '';
        hideImageDisplay();
        
        const statusDiv = document.getElementById('imageUploadStatus');
        if (statusDiv) {
            statusDiv.textContent = '';
            statusDiv.classList.remove('show', 'success', 'error', 'loading');
        }
        
        showSuccess('Image supprimée avec succès !');
    } catch (error) {
        showError('Erreur lors de la suppression de l’image: ' + error.message);
    }
}

// Fonction pour supprimer le PDF
async function deletePDF() {
    const pdfUrl = document.getElementById('projectPdfUrl').value;
    
    if (!pdfUrl) {
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce PDF ?')) {
        return;
    }
    
    try {
        // Extraire le nom du fichier si c'est une URL complète
        let fileName = pdfUrl;
        if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
            // Extraire le nom du fichier de l'URL
            const urlParts = pdfUrl.split('/');
            fileName = urlParts[urlParts.length - 1];
        }
        
        // Supprimer le fichier du storage Supabase
        const { error } = await supabase.storage
            .from('project-pdfs')
            .remove([fileName]);
        
        if (error) {
            // Si le fichier n'existe pas, ce n'est pas grave, on continue
            console.warn('Erreur lors de la suppression du fichier:', error);
        }
        
        // Vider le champ et masquer l'affichage
        document.getElementById('projectPdfUrl').value = '';
        document.getElementById('projectPdfFile').value = '';
        hidePdfDisplay();
        
        // Réinitialiser le statut d'upload
        const statusDiv = document.getElementById('pdfUploadStatus');
        if (statusDiv) {
            statusDiv.textContent = '';
            statusDiv.classList.remove('show', 'success', 'error', 'loading');
        }
        
        showSuccess('PDF supprimé avec succès !');
    } catch (error) {
        showError('Erreur lors de la suppression du PDF: ' + error.message);
    }
}

// Écouter le clic sur le bouton de suppression
const deleteImageBtn = document.getElementById('deleteImageBtn');
if (deleteImageBtn) {
    deleteImageBtn.addEventListener('click', deleteProjectImage);
}

const imageInput = document.getElementById('projectImageFile');
if (imageInput) {
    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            await uploadProjectImage(file);
        } else if (file) {
            const statusDiv = document.getElementById('imageUploadStatus');
            statusDiv.textContent = '❌ Veuillez sélectionner un fichier image valide';
            statusDiv.classList.add('show', 'error');
        }
    });
}

const deletePdfBtn = document.getElementById('deletePdfBtn');
if (deletePdfBtn) {
    deletePdfBtn.addEventListener('click', deletePDF);
}

const pdfInput = document.getElementById('projectPdfFile');
if (pdfInput) {
    pdfInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            await uploadPDF(file);
        } else if (file) {
            const statusDiv = document.getElementById('pdfUploadStatus');
            statusDiv.textContent = '❌ Veuillez sélectionner un fichier PDF';
            statusDiv.classList.add('show', 'error');
        }
    });
}

// ========================================
// MODALS - SKILLS
// ========================================

function openSkillModal(skill = null) {
    const modal = document.getElementById('skillModal');
    const title = document.getElementById('skillModalTitle');
    
    if (skill) {
        title.textContent = 'Modifier la compétence';
        document.getElementById('skillId').value = skill.id;
        document.getElementById('skillName').value = skill.name;
        document.getElementById('skillDescription').value = skill.description || '';
        document.getElementById('skillSvg').value = skill.svg_icon || '';
        document.getElementById('skillOrder').value = skill.order_index || 0;
        previewSkillSvg();
    } else {
        title.textContent = 'Ajouter une compétence';
        document.getElementById('skillForm').reset();
        document.getElementById('skillId').value = '';
        document.getElementById('skillSvgPreview').innerHTML = '';
    }
    
    modal.classList.add('active');
}

function closeSkillModal() {
    document.getElementById('skillModal').classList.remove('active');
}

function previewSkillSvg() {
    const svg = document.getElementById('skillSvg').value.trim();
    const preview = document.getElementById('skillSvgPreview');
    preview.innerHTML = '';
    if (!svg.startsWith('<svg')) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (svgEl && !doc.querySelector('parsererror')) {
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        preview.appendChild(document.importNode(svgEl, true));
    }
}

function editSkill(skill) {
    openSkillModal(skill);
}

async function deleteSkill(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;
    
    try {
        await portfolioAPI.deleteSkill(id);
        showSuccess('Compétence supprimée !');
        renderSkillsSection();
    } catch (error) {
        showError('Erreur lors de la suppression: ' + error.message);
    }
}

document.getElementById('skillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const skillData = {
            name: document.getElementById('skillName').value,
            description: document.getElementById('skillDescription').value || null,
            svg_icon: document.getElementById('skillSvg').value || null,
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
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// ========================================
// MODALS - EXPERIENCE
// ========================================

function openExperienceModal(experience = null) {
    const modal = document.getElementById('experienceModal');
    const title = document.getElementById('experienceModalTitle');
    
    if (experience) {
        title.textContent = 'Modifier l\'expérience';
        document.getElementById('experienceId').value = experience.id;
        document.getElementById('experienceTitle').value = experience.title;
        document.getElementById('experienceCompany').value = experience.company;
        document.getElementById('experienceDate').value = experience.date;
        document.getElementById('experienceLocation').value = experience.location || '';
        document.getElementById('experienceDescription').value = experience.description || '';
        document.getElementById('experienceOrder').value = experience.order_index || 0;
    } else {
        title.textContent = 'Ajouter une expérience';
        document.getElementById('experienceForm').reset();
        document.getElementById('experienceId').value = '';
    }
    
    modal.classList.add('active');
}

function closeExperienceModal() {
    document.getElementById('experienceModal').classList.remove('active');
}

function editExperience(experience) {
    openExperienceModal(experience);
}

async function deleteExperience(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) return;
    
    try {
        await portfolioAPI.deleteExperience(id);
        showSuccess('Expérience supprimée !');
        renderExperienceSection();
    } catch (error) {
        showError('Erreur lors de la suppression: ' + error.message);
    }
}

document.getElementById('experienceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const experienceData = {
            title: document.getElementById('experienceTitle').value,
            company: document.getElementById('experienceCompany').value,
            date: document.getElementById('experienceDate').value,
            location: document.getElementById('experienceLocation').value || null,
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
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// ========================================
// MODALS - EDUCATION
// ========================================

function openEducationModal(education = null) {
    const modal = document.getElementById('educationModal');
    const title = document.getElementById('educationModalTitle');
    
    if (education) {
        title.textContent = 'Modifier la formation';
        document.getElementById('educationId').value = education.id;
        document.getElementById('educationTitle').value = education.title;
        document.getElementById('educationInstitution').value = education.institution;
        document.getElementById('educationDate').value = education.date;
        document.getElementById('educationDescription').value = education.description || '';
        document.getElementById('educationOrder').value = education.order_index || 0;
    } else {
        title.textContent = 'Ajouter une formation';
        document.getElementById('educationForm').reset();
        document.getElementById('educationId').value = '';
    }
    
    modal.classList.add('active');
}

function closeEducationModal() {
    document.getElementById('educationModal').classList.remove('active');
}

function editEducation(education) {
    openEducationModal(education);
}

async function deleteEducation(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;
    
    try {
        await portfolioAPI.deleteEducation(id);
        showSuccess('Formation supprimée !');
        renderEducationSection();
    } catch (error) {
        showError('Erreur lors de la suppression: ' + error.message);
    }
}

document.getElementById('educationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const educationData = {
            title: document.getElementById('educationTitle').value,
            institution: document.getElementById('educationInstitution').value,
            date: document.getElementById('educationDate').value,
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
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// ========================================
// UTILITIES
// ========================================

function showSuccess(message) {
    const el = document.getElementById('successMessage');
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function showError(message) {
    const el = document.getElementById('errorMessage');
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'admin-login.html';
}

// Fermer les modals en cliquant en dehors
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Mettre à jour les compteurs sur les cartes
    await updateCounters();
});
