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
    // Mettre à jour le Contact - AVEC SVG
// ===== CONTACT - CORRECTION =====
// ===== CONTACT - SEULEMENT ICÔNES SVG =====
if (contact) {
    console.log('✅ Contact chargé:', contact);
    const contactButtons = document.getElementById('contactButtons');
    
    if (contactButtons) {
        const buttons = [];
        
        if (contact.phone) {
            buttons.push(`
                <a href="tel:${contact.phone.replace(/\s/g, '')}" class="btn primary" aria-label="Téléphone">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                </a>
            `);
        }
        
        if (contact.email) {
            buttons.push(`
                <a href="mailto:${contact.email}" class="btn ghost" aria-label="Email">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                </a>
            `);
        }
        
        if (contact.linkedin) {
            buttons.push(`
                <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer" class="btn ghost" aria-label="LinkedIn">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
            `);
        }
        
        contactButtons.innerHTML = buttons.join('');
        
        // Réactiver l'animation reveal
        reinitRevealObserver();
    }
}

  
      console.log('✅ Portfolio chargé depuis Supabase');
  
    } catch (error) {
      console.error('❌ Erreur chargement portfolio:', error);
      // En cas d'erreur, le contenu HTML par défaut reste affiché
    }
  })();
  
  // Écouter les changements en temps réel (optionnel mais cool !)
  const setupRealtimeSubscription = () => {
    // Écouter les changements sur la table projects
    supabase
      .channel('portfolio-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        (payload) => {
          console.log('🔄 Projets mis à jour en temps réel');
          // Recharger automatiquement après 1 seconde
          setTimeout(() => window.location.reload(), 1000);
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'skills' }, 
        (payload) => {
          console.log('🔄 Compétences mises à jour en temps réel');
          setTimeout(() => window.location.reload(), 1000);
        }
      )
      .subscribe();
  };

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
