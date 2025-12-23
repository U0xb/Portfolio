// ========================================
// CLIENT SUPABASE UNIQUE - VERSION ULTIME
// ========================================

function getSupabaseClient() {
    try {
      if (window.__portfolioSupabaseClient) {
        return window.__portfolioSupabaseClient;
      }
  
      if (window.supabase && typeof window.supabase.from === 'function') {
        window.__portfolioSupabaseClient = window.supabase;
        return window.supabase;
      }
  
      const createClient = window.supabase && window.supabase.createClient;
      if (!createClient) {
        return null;
      }
  
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storageKey: 'portfolio-auth-unique-key',
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
  
      window.__portfolioSupabaseClient = client;
      window.supabase = client;
  
      return client;
    } catch (error) {
      return null;
    }
}

// ========================================
// CHARGEMENT DU PORTFOLIO
// ========================================

(async function loadPortfolio() {
    try {
        const client = getSupabaseClient();
        
        if (!client) {
            return;
        }
        
        const [hero, projects, skills, about, experience, education, contact] = await Promise.all([
            client.from('hero').select('*').single(),
            client.from('projects').select('*').order('order_index'),
            client.from('skills').select('*').order('value', { ascending: false }),
            client.from('about').select('*').single(),
            client.from('experience').select('*').order('order_index'),
            client.from('education').select('*').order('order_index'),
            client.from('contact').select('*').single()
        ]);
        
        // HERO
        if (hero.data) {
            const t = document.getElementById('heroTitle');
            const s = document.getElementById('heroSubtitle');
            if (t) t.textContent = hero.data.title;
            if (s) s.textContent = hero.data.subtitle;
        }
        
        // PROJETS
        if (projects.data && projects.data.length > 0) {
            const grid = document.getElementById('projectsGrid');
            if (grid) {
                const projectsHTML = await Promise.all(projects.data.map(async p => {
                    let pdfLink = '#';
                    
                    // Si un PDF existe, créer lien masqué via pdf.php
                    if (p.pdf_url) {
                        const fileName = p.pdf_url.replace(/^\d+-/, '');
                        pdfLink = `/pdf.php?f=${fileName}`;
                    } 
                    else if (p.link) {
                        pdfLink = p.link;
                    }
                    
                    return `
                    <article class="card">
                        <a class="card-link" href="${pdfLink}" target="_blank" rel="noopener">
                            <div class="card-media" style="background-image: url('${p.image_url || ''}');"></div>
                            <div class="card-body">
                                <h3>${p.title}</h3>
                                <p>${p.description}</p>
                                ${p.tags && Array.isArray(p.tags) ? p.tags.map(t => `<span class="pill">${t}</span>`).join('') : ''}
                            </div>
                        </a>
                    </article>
                    `;
                }));
                
                grid.innerHTML = projectsHTML.join('');
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
                            <div class="skill-fill" data-skill-value="${s.value}" style="width: 0; transition: width 1s ease;"></div>
                        </div>
                    </div>
                `).join('');
                
                setTimeout(() => {
                    document.querySelectorAll('.skill-fill').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-skill-value') + '%';
                    });
                }, 100);
            }
        }
        
        // À PROPOS
        if (about.data) {
            const desc = document.getElementById('aboutDescription');
            const tags = document.getElementById('aboutTags');
            
            if (desc && about.data.description) desc.innerHTML = about.data.description;
            if (tags && about.data.tags && Array.isArray(about.data.tags)) {
                tags.innerHTML = about.data.tags.map(t => `<li>${t}</li>`).join('');
            }
        }
        
        // EXPÉRIENCE
        if (experience.data && experience.data.length > 0) {
            const timeline = document.getElementById('experienceTimeline');
            if (timeline) {
                timeline.innerHTML = experience.data.map(e => {
                    const company = e.company || e.entreprise || e.organization || e.organisation || e.employer || '';
                    const titleText = company ? `${e.title} · ${company}` : e.title;
                    
                    return `
                    <div class="timeline-item">
                        <p class="timeline-meta">${e.period || e.date || ''}</p>
                        <h3 class="timeline-title">${titleText}</h3>
                        ${e.description ? `<p>${e.description}</p>` : ''}
                    </div>
                `;
                }).join('');
            }
        }
        
        // FORMATION
        if (education.data && education.data.length > 0) {
            const timeline = document.getElementById('educationTimeline');
            if (timeline) {
                timeline.innerHTML = education.data.map(e => {
                    const institution = e.institution || e.school || e.ecole || e.etablissement || e.établissement || e.establishment || e.university || e.universite || '';
                    const titleText = institution ? `${e.title} · ${institution}` : e.title;
                    
                    return `
                    <div class="timeline-item">
                        <p class="timeline-meta">${e.period || e.date || ''}</p>
                        <h3 class="timeline-title">${titleText}</h3>
                        ${e.description ? `<p>${e.description}</p>` : ''}
                    </div>
                `;
                }).join('');
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
            }
        }
        
    } catch (error) {
        // Erreur silencieuse
    }
})();
