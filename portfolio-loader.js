// Ce fichier charge les données depuis Supabase et met à jour le portfolio
// Adapté à la structure HTML de index.html

(async function loadPortfolio() {
    try {
        console.log('🔄 Chargement du portfolio depuis Supabase...');

        // Charger toutes les données en parallèle
        const [hero, projects, skills, about, experience, education, contact] = await Promise.all([
            portfolioAPI.getHero(),
            portfolioAPI.getProjects(),
            portfolioAPI.getSkills(),
            portfolioAPI.getAbout(),
            portfolioAPI.getExperience(),
            portfolioAPI.getEducation(),
            portfolioAPI.getContact()
        ]);

        // ===== HERO SECTION =====
        if (hero) {
            console.log('✅ Hero chargé:', hero);
            const titleEl = document.querySelector('.hero .title');
            const subtitleEl = document.querySelector('.hero .subtitle');
            
            if (titleEl && hero.title) {
                // Mettre les mots clés en accent
                const words = hero.title.split(' ');
                const accentWords = ['rapides', 'élégantes', 'utiles'];
                titleEl.innerHTML = words.map(word => {
                    const cleanWord = word.toLowerCase().replace(/[.,]/g, '');
                    return accentWords.includes(cleanWord) 
                        ? `<span class="accent">${word}</span>` 
                        : word;
                }).join(' ');
            }
            
            if (subtitleEl && hero.subtitle) {
                subtitleEl.textContent = hero.subtitle;
            }
        }

        // ===== PROJETS =====
        if (projects && projects.length > 0) {
            console.log('✅ Projets chargés:', projects.length);
            const projectsGrid = document.querySelector('#projets .grid');
            
            if (projectsGrid) {
                projectsGrid.innerHTML = projects.map(project => `
                    <article class="card" data-reveal>
                        <a class="card-link" href="${project.link || '#'}" target="_blank" rel="noopener">
                            ${project.image_url ? `<div class="card-media" style="background-image: url('${project.image_url}');" aria-hidden="true"></div>` : '<div class="card-media" aria-hidden="true"></div>'}
                            <div class="card-body">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                ${project.tags && project.tags.length > 0 ? project.tags.map(tag => `<span class="pill">${tag}</span>`).join(' ') : ''}
                            </div>
                        </a>
                    </article>
                `).join('');
                
                // Réactiver l'animation reveal pour les nouveaux éléments
                reinitRevealObserver();
            }
        }

        // ===== COMPÉTENCES =====
        if (skills && skills.length > 0) {
            console.log('✅ Compétences chargées:', skills.length);
            const skillsGrid = document.querySelector('#competences .skills-grid');
            
            if (skillsGrid) {
                skillsGrid.innerHTML = skills.map(skill => `
                    <div class="skill" data-reveal>
                        <div class="skill-header">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-value">${skill.value}%</span>
                        </div>
                        <div class="skill-bar" aria-hidden="true">
                            <div class="skill-fill" data-skill-value="${skill.value}"></div>
                        </div>
                    </div>
                `).join('');
                
                reinitRevealObserver();
            }
        }

        // ===== À PROPOS =====
        if (about) {
            console.log('✅ À propos chargé:', about);
            const aboutContent = document.querySelector('#apropos .about-content p');
            const aboutTags = document.querySelector('#apropos .about-content .tags');
            
            if (aboutContent && about.description) {
                aboutContent.innerHTML = about.description;
            }
            
            if (aboutTags && about.tags && about.tags.length > 0) {
                aboutTags.innerHTML = about.tags.map(tag => `<li>${tag}</li>`).join('');
            }
        }

        // ===== EXPÉRIENCE =====
        if (experience && experience.length > 0) {
            console.log('✅ Expériences chargées:', experience.length);
            const experienceTimeline = document.querySelector('#experience .timeline');
            
            if (experienceTimeline) {
                experienceTimeline.innerHTML = experience.map(exp => `
                    <div class="timeline-item" data-reveal>
                        <div class="timeline-meta">${exp.date}${exp.location ? ' · ' + exp.location : ''}</div>
                        <h3 class="timeline-title">${exp.title} · ${exp.company}</h3>
                        ${exp.description ? `<p class="muted">${exp.description}</p>` : ''}
                    </div>
                `).join('');
                
                reinitRevealObserver();
            }
        }

        // ===== FORMATION =====
        if (education && education.length > 0) {
            console.log('✅ Formations chargées:', education.length);
            const educationTimeline = document.querySelector('#formation .timeline');
            
            if (educationTimeline) {
                educationTimeline.innerHTML = education.map(edu => `
                    <div class="timeline-item" data-reveal>
                        <div class="timeline-meta">${edu.date}</div>
                        <h3 class="timeline-title">${edu.title} · ${edu.institution}</h3>
                        ${edu.description ? `<p class="muted">${edu.description}</p>` : ''}
                    </div>
                `).join('');
                
                reinitRevealObserver();
            }
        }

        // ===== CONTACT =====
        if (contact) {
            console.log('✅ Contact chargé:', contact);
            
            // Téléphone
            const phoneLink = document.querySelector('#contact a[href^="tel:"]');
            if (phoneLink && contact.phone) {
                phoneLink.href = `tel:${contact.phone.replace(/\s/g, '')}`;
                phoneLink.textContent = contact.phone;
            }
            
            // Email
            const emailLink = document.querySelector('#contact a[href^="mailto:"]');
            if (emailLink && contact.email) {
                emailLink.href = `mailto:${contact.email}`;
                emailLink.textContent = contact.email;
            }
            
            // LinkedIn
            const linkedinLink = document.querySelector('#contact a[href*="linkedin"]');
            if (linkedinLink && contact.linkedin) {
                linkedinLink.href = contact.linkedin;
            }
        }

        console.log('✅ Portfolio chargé avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors du chargement du portfolio:', error);
        console.error('Détails:', error.message);
    }
})();

// Fonction pour réinitialiser l'observateur d'animation reveal
function reinitRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Observer tous les nouveaux éléments avec data-reveal
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => {
        observer.observe(el);
    });
}
