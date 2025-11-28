// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Charger toutes les données
    await loadAllData();
});

// Variables globales pour les tags
let currentProjectTags = [];
let currentAboutTags = [];

// ===== SVG ICONS =====
const icons = {
    edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>`,
    delete: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`,
    link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>`,
    close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`
};

// ===== HERO =====
async function loadHero() {
    try {
        const hero = await portfolioAPI.getHero();
        if (hero) {
            document.getElementById('heroId').value = hero.id;
            document.getElementById('heroTitle').value = hero.title || '';
            document.getElementById('heroSubtitle').value = hero.subtitle || '';
        }
    } catch (error) {
        showError('Erreur lors du chargement du hero: ' + error.message);
    }
}

async function saveHero() {
    try {
        const id = document.getElementById('heroId').value;
        const updates = {
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value,
            updated_at: new Date().toISOString()
        };
        
        await portfolioAPI.updateHero(id, updates);
        showSuccess('Section Hero mise à jour avec succès !');
    } catch (error) {
        showError('Erreur lors de la sauvegarde: ' + error.message);
    }
}

// ===== PROJECTS =====
async function loadProjects() {
    try {
        const projects = await portfolioAPI.getProjects();
        const container = document.getElementById('projectsList');
        
        if (projects.length === 0) {
            container.innerHTML = '<p style="color: #999;">Aucun projet pour le moment.</p>';
            return;
        }
        
        container.innerHTML = projects.map(project => `
            <div class="item-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.link ? `<p><a href="${project.link}" target="_blank">${icons.link} Voir le projet</a></p>` : ''}
                ${project.tags && project.tags.length > 0 ? `
                    <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="item-actions">
                    <button class="btn" onclick='editProject(${JSON.stringify(project).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteProject('${project.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showError('Erreur lors du chargement des projets: ' + error.message);
    }
}

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
        document.getElementById('projectOrder').value = project.order_index || 0;
        currentProjectTags = project.tags || [];
        renderProjectTags();
    } else {
        title.textContent = 'Ajouter un projet';
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        currentProjectTags = [];
        renderProjectTags();
    }
    
    modal.classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

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

function editProject(project) {
    openProjectModal(project);
}

async function deleteProject(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    try {
        await portfolioAPI.deleteProject(id);
        showSuccess('Projet supprimé !');
        await loadProjects();
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
        await loadProjects();
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// ===== SKILLS =====
async function loadSkills() {
    try {
        const skills = await portfolioAPI.getSkills();
        const container = document.getElementById('skillsList');
        
        if (skills.length === 0) {
            container.innerHTML = '<p style="color: #999;">Aucune compétence pour le moment.</p>';
            return;
        }
        
        container.innerHTML = skills.map(skill => `
            <div class="item-card">
                <h3>${skill.name}</h3>
                <p>Valeur: ${skill.value}%</p>
                <div style="background: #f0f0f0; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: #667eea; height: 100%; width: ${skill.value}%;"></div>
                </div>
                <div class="item-actions" style="margin-top: 15px;">
                    <button class="btn" onclick='editSkill(${JSON.stringify(skill).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteSkill('${skill.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showError('Erreur lors du chargement des compétences: ' + error.message);
    }
}

function openSkillModal(skill = null) {
    const modal = document.getElementById('skillModal');
    const title = document.getElementById('skillModalTitle');
    
    if (skill) {
        title.textContent = 'Modifier la compétence';
        document.getElementById('skillId').value = skill.id;
        document.getElementById('skillName').value = skill.name;
        document.getElementById('skillValue').value = skill.value;
        document.getElementById('skillOrder').value = skill.order_index || 0;
    } else {
        title.textContent = 'Ajouter une compétence';
        document.getElementById('skillForm').reset();
        document.getElementById('skillId').value = '';
    }
    
    modal.classList.add('active');
}

function closeSkillModal() {
    document.getElementById('skillModal').classList.remove('active');
}

function editSkill(skill) {
    openSkillModal(skill);
}

async function deleteSkill(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;
    
    try {
        await portfolioAPI.deleteSkill(id);
        showSuccess('Compétence supprimée !');
        await loadSkills();
    } catch (error) {
        showError('Erreur lors de la suppression: ' + error.message);
    }
}

document.getElementById('skillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const skillData = {
            name: document.getElementById('skillName').value,
            value: parseInt(document.getElementById('skillValue').value),
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
        await loadSkills();
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// ===== ABOUT =====
async function loadAbout() {
    try {
        const about = await portfolioAPI.getAbout();
        if (about) {
            document.getElementById('aboutId').value = about.id;
            document.getElementById('aboutDescription').value = about.description || '';
            currentAboutTags = about.tags || [];
            renderAboutTags();
        }
    } catch (error) {
        showError('Erreur lors du chargement de la section À propos: ' + error.message);
    }
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

async function saveAbout() {
    try {
        const id = document.getElementById('aboutId').value;
        const updates = {
            description: document.getElementById('aboutDescription').value,
            tags: currentAboutTags,
            updated_at: new Date().toISOString()
        };
        
        await portfolioAPI.updateAbout(id, updates);
        showSuccess('Section À propos mise à jour !');
    } catch (error) {
        showError('Erreur lors de la sauvegarde: ' + error.message);
    }
}

// ===== EXPERIENCE =====
async function loadExperience() {
    try {
        const experiences = await portfolioAPI.getExperience();
        const container = document.getElementById('experienceList');
        
        if (experiences.length === 0) {
            container.innerHTML = '<p style="color: #999;">Aucune expérience pour le moment.</p>';
            return;
        }
        
        container.innerHTML = experiences.map(exp => `
            <div class="item-card">
                <h3>${exp.title} - ${exp.company}</h3>
                <p><strong>${exp.date}</strong>${exp.location ? ' | ' + exp.location : ''}</p>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
                <div class="item-actions">
                    <button class="btn" onclick='editExperience(${JSON.stringify(exp).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteExperience('${exp.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showError('Erreur lors du chargement des expériences: ' + error.message);
    }
}

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
        await loadExperience();
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
        await loadExperience();
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// ===== EDUCATION =====
async function loadEducation() {
    try {
        const education = await portfolioAPI.getEducation();
        const container = document.getElementById('educationList');
        
        if (education.length === 0) {
            container.innerHTML = '<p style="color: #999;">Aucune formation pour le moment.</p>';
            return;
        }
        
        container.innerHTML = education.map(edu => `
            <div class="item-card">
                <h3>${edu.title}</h3>
                <p><strong>${edu.institution}</strong></p>
                <p>${edu.date}</p>
                ${edu.description ? `<p>${edu.description}</p>` : ''}
                <div class="item-actions">
                    <button class="btn" onclick='editEducation(${JSON.stringify(edu).replace(/'/g, "&apos;")})'>${icons.edit} Modifier</button>
                    <button class="btn btn-danger" onclick="deleteEducation('${edu.id}')">${icons.delete} Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showError('Erreur lors du chargement des formations: ' + error.message);
    }
}

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
        await loadEducation();
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
        await loadEducation();
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
});

// ===== CONTACT =====
async function loadContact() {
    try {
        const contact = await portfolioAPI.getContact();
        if (contact) {
            document.getElementById('contactId').value = contact.id;
            document.getElementById('contactPhone').value = contact.phone || '';
            document.getElementById('contactEmail').value = contact.email || '';
            document.getElementById('contactLinkedin').value = contact.linkedin || '';
        }
    } catch (error) {
        showError('Erreur lors du chargement des informations de contact: ' + error.message);
    }
}

async function saveContact() {
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

// ===== UTILITIES =====
async function loadAllData() {
    await Promise.all([
        loadHero(),
        loadProjects(),
        loadSkills(),
        loadAbout(),
        loadExperience(),
        loadEducation(),
        loadContact()
    ]);
}

function showSuccess(message) {
    const el = document.getElementById('successMessage');
    el.textContent = message;
    el.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

function showError(message) {
    const el = document.getElementById('errorMessage');
    el.textContent = message;
    el.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
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
