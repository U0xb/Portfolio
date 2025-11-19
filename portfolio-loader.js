// Ce fichier charge les données depuis Supabase et met à jour le portfolio
// À ajouter dans index.html après supabase-config.js

(async function loadPortfolio() {
    try {
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
  
      // Mettre à jour le Hero
      if (hero) {
        const titleEl = document.querySelector('.hero .title');
        const subtitleEl = document.querySelector('.hero .subtitle');
        
        if (titleEl) {
          // Séparer le texte pour trouver les mots à mettre en accent
          const words = hero.title.split(' ');
          const accentWords = ['rapides', 'élégantes', 'utiles']; // Mots à mettre en accent
          
          titleEl.innerHTML = words.map(word => {
            const cleanWord = word.toLowerCase().replace(/[.,]/g, '');
            return accentWords.includes(cleanWord) 
              ? `<span class="accent">${word}</span>`
              : word;
          }).join(' ');
        }
        
        if (subtitleEl) subtitleEl.textContent = hero.subtitle;
      }
  
      // Mettre à jour les Projets
      if (projects && projects.length > 0) {
        const projectsGrid = document.querySelector('.projects .grid');
        if (projectsGrid) {
          projectsGrid.innerHTML = projects.map(project => `
            <article class="card" data-reveal>
              <a class="card-link" href="${project.link || '#'}" target="_blank" rel="noopener">
                <div class="card-media" aria-hidden="true"></div>
                <div class="card-body">
                  <h3>${project.title}</h3>
                  <p>${project.description}</p>
                  ${project.tags && project.tags.length > 0 
                    ? project.tags.map(tag => `<span class="pill">${tag}</span>`).join('')
                    : ''}
                </div>
              </a>
            </article>
          `).join('');
          
          // Réappliquer l'observer pour les animations
          document.querySelectorAll('.projects .card').forEach(el => {
            if (window.observer) window.observer.observe(el);
          });
        }
      }
  
      // Mettre à jour les Compétences
      if (skills && skills.length > 0) {
        const skillsGrid = document.querySelector('.skills .skills-grid');
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
          
          // Réappliquer l'observer
          document.querySelectorAll('.skills .skill').forEach(el => {
            if (window.observer) window.observer.observe(el);
          });
        }
      }
  
      // Mettre à jour À propos
      if (about) {
        const aboutContent = document.querySelector('.about-content p');
        const aboutTags = document.querySelector('.about-content .tags');
        
        if (aboutContent) {
          aboutContent.innerHTML = about.description;
        }
        
        if (aboutTags && about.tags) {
          aboutTags.innerHTML = about.tags.map(tag => `<li>${tag}</li>`).join('');
        }
      }
  
      // Mettre à jour l'Expérience
      if (experience && experience.length > 0) {
        const experienceTimeline = document.querySelector('.experience .timeline');
        if (experienceTimeline) {
          experienceTimeline.innerHTML = experience.map(exp => `
            <div class="timeline-item" data-reveal>
              <div class="timeline-meta">${exp.date}${exp.location ? ' · ' + exp.location : ''}</div>
              <h3 class="timeline-title">${exp.title} · ${exp.company}</h3>
              ${exp.description ? `<p class="muted">${exp.description}</p>` : ''}
            </div>
          `).join('');
          
          // Réappliquer l'observer
          document.querySelectorAll('.experience .timeline-item').forEach(el => {
            if (window.observer) window.observer.observe(el);
          });
        }
      }
  
      // Mettre à jour la Formation
      if (education && education.length > 0) {
        const educationTimeline = document.querySelector('.education .timeline');
        if (educationTimeline) {
          educationTimeline.innerHTML = education.map(edu => `
            <div class="timeline-item" data-reveal>
              <div class="timeline-meta">${edu.date}</div>
              <h3 class="timeline-title">${edu.title} · ${edu.institution}</h3>
              ${edu.description ? `<p class="muted">${edu.description}</p>` : ''}
            </div>
          `).join('');
          
          // Réappliquer l'observer
          document.querySelectorAll('.education .timeline-item').forEach(el => {
            if (window.observer) window.observer.observe(el);
          });
        }
      }
  
      // Mettre à jour le Contact
      if (contact) {
        const phoneLink = document.querySelector('.contact-actions a[href^="tel:"]');
        const emailLink = document.querySelector('.contact-actions a[href^="mailto:"]');
        const linkedinLink = document.querySelector('.contact-actions a[href*="linkedin"]');
        
        if (phoneLink && contact.phone) {
          phoneLink.href = `tel:${contact.phone.replace(/\s/g, '')}`;
          phoneLink.textContent = contact.phone;
        }
        
        if (emailLink && contact.email) {
          emailLink.href = `mailto:${contact.email}`;
          emailLink.textContent = contact.email;
        }
        
        if (linkedinLink && contact.linkedin) {
          linkedinLink.href = contact.linkedin;
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        console.log('🔄 Projets mis à jour en temps réel');
        // Recharger automatiquement après 1 seconde
        setTimeout(() => window.location.reload(), 1000);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        console.log('🔄 Compétences mises à jour en temps réel');
        setTimeout(() => window.location.reload(), 1000);
      })
      .subscribe();
  };
  
  // Activer le temps réel (commentez si vous ne voulez pas cette fonctionnalité)
  // setupRealtimeSubscription();