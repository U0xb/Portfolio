console.log('🚀 Démarrage...');

(async function() {
    try {
        // Utiliser window.supabase directement
        const createClient = window.supabase.createClient;
        
        if (!createClient) {
            console.error('❌ createClient non trouvé');
            return;
        }
        
        console.log('✅ createClient trouvé');
        
        // Créer le client
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Client Supabase créé');
        
        // ===========================================
        // RÉCUPÉRATION DES DONNÉES
        // ===========================================
        
        console.log('📡 Récupération des données...');
        
        const [hero, projects, skills, about, experience, education, contact] = await Promise.all([
            client.from('hero').select('*').single(),
            client.from('projects').select('*').order('order_index'),
            client.from('skills').select('*').order('value', { ascending: false }),
            client.from('about').select('*').single(),
            client.from('experience').select('*').order('order_index'),
            client.from('education').select('*').order('order_index'),
            client.from('contact').select('*').single()
        ]);
        
        console.log('📊 Données reçues:', {
            hero: !!hero.data,
            projects: projects.data?.length || 0,
            skills: skills.data?.length || 0,
            about: !!about.data,
            exp: experience.data?.length || 0,
            edu: education.data?.length || 0,
            contact: !!contact.data
        });
        
        // ===========================================
        // AFFICHAGE
        // ===========================================
        
        // HERO
        if (hero.data) {
            const t = document.getElementById('heroTitle');
            const s = document.getElementById('heroSubtitle');
            if (t) t.textContent = hero.data.title;
            if (s) s.textContent = hero.data.subtitle;
            console.log('✅ Hero affiché');
        }
        
        // PROJETS
        if (projects.data && projects.data.length > 0) {
            const grid = document.getElementById('projectsGrid');
            if (grid) {
                grid.innerHTML = projects.data.map(p => `
                    <article class="card">
                        <a class="card-link" href="${p.link || '#'}" target="_blank" rel="noopener">
                            <div class="card-media" style="background-image: url('${p.image_url || ''}');"></div>
                            <div class="card-body">
                                <h3>${p.title}</h3>
                                <p>${p.description}</p>
                                ${p.tags && Array.isArray(p.tags) ? p.tags.map(t => `<span class="pill">${t}</span>`).join('') : ''}
                            </div>
                        </a>
                    </article>
                `).join('');
                console.log('✅ Projets affichés:', projects.data.length);
            }
        }
        
        // COMPÉTENCES
        if (skills.data && skills.data.length > 0) {
            const grid = document.getElementById('skillsGrid');
            if (grid) {
                grid.innerHTML = skills.data.map(s => `
                    <div class="skill">
                        <div class="skill-header">
                            <span class="skill-name">${s.name}</span>
                            <span class="skill-value">${s.value}%</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-fill" style="width: ${s.value}%; transition: width 1s ease;"></div>
                        </div>
                    </div>
                `).join('');
                console.log('✅ Compétences affichées:', skills.data.length);
            }
        }
        
        // À PROPOS
        if (about.data) {
            const desc = document.getElementById('aboutDescription');
            const tags = document.getElementById('aboutTags');
            
            if (desc && about.data.description) {
                desc.innerHTML = about.data.description;
            }
            
            if (tags && about.data.tags && Array.isArray(about.data.tags)) {
                tags.innerHTML = about.data.tags.map(t => `<li>${t}</li>`).join('');
            }
            console.log('✅ À propos affiché');
        }
        
        // EXPÉRIENCE
        if (experience.data && experience.data.length > 0) {
            const timeline = document.getElementById('experienceTimeline');
            if (timeline) {
                timeline.innerHTML = experience.data.map(e => `
                    <div class="timeline-item">
                        <p class="timeline-meta">${e.period || e.date || ''}</p>
                        <h3 class="timeline-title">${e.title}</h3>
                        ${e.description ? `<p>${e.description}</p>` : ''}
                    </div>
                `).join('');
                console.log('✅ Expérience affichée:', experience.data.length);
            }
        }
        
        // FORMATION
        if (education.data && education.data.length > 0) {
            const timeline = document.getElementById('educationTimeline');
            if (timeline) {
                timeline.innerHTML = education.data.map(e => `
                    <div class="timeline-item">
                        <p class="timeline-meta">${e.period || e.date || ''}</p>
                        <h3 class="timeline-title">${e.title}</h3>
                        ${e.description ? `<p>${e.description}</p>` : ''}
                    </div>
                `).join('');
                console.log('✅ Formation affichée:', education.data.length);
            }
        }
        
        // CONTACT
        if (contact.data) {
            const btns = document.getElementById('contactButtons');
            if (btns) {
                const buttons = [];
                
                if (contact.data.phone) {
                    buttons.push(`
                        <a href="tel:${contact.data.phone.replace(/\s/g, '')}" class="btn primary" aria-label="Téléphone">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                        </a>
                    `);
                }
                
                if (contact.data.email) {
                    buttons.push(`
                        <a href="mailto:${contact.data.email}" class="btn primary" aria-label="Email">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </a>
                    `);
                }
                
                if (contact.data.linkedin) {
                    buttons.push(`
                        <a href="${contact.data.linkedin}" target="_blank" rel="noopener" class="btn primary" aria-label="LinkedIn">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    `);
                }
                
                btns.innerHTML = buttons.join('');
                console.log('✅ Contact affiché');
            }
        }
        
        console.log('🎉🎉🎉 PORTFOLIO CHARGÉ AVEC SUCCÈS !');
        
    } catch (error) {
        console.error('❌ ERREUR:', error);
    }
})();
