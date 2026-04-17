// ========================================
// CLIENT SUPABASE UNIQUE - VERSION ULTIME
// ========================================

function getSupabaseClient() {
    try {
      // Si un client est déjà mis en cache, on le réutilise
      if (window.__portfolioSupabaseClient) {
        return window.__portfolioSupabaseClient;
      }
  
      // Si "supabase" global est déjà un client (créé dans supabase-config.js)
      if (window.supabase && typeof window.supabase.from === 'function') {
        window.__portfolioSupabaseClient = window.supabase;
        return window.supabase;
      }
  
      const createClient = window.supabase && window.supabase.createClient;
      if (!createClient) {
        return null;
      }
  
      // Créer avec une clé de stockage unique pour éviter les conflits
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storageKey: 'portfolio-auth-unique-key', // Clé unique
          persistSession: false, // Pas de persistance
          autoRefreshToken: false, // Pas de refresh auto
          detectSessionInUrl: false // Pas de détection d'URL
        }
      });
  
      // Stocker globalement
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
            client.from('skills').select('*').order('order_index', { ascending: true }),
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
                // Construire le HTML de manière asynchrone pour gérer les URLs
                const projectsHTML = await Promise.all(projects.data.map(async p => {
                    // Même logique que pdfLink
                    let imageLink = '';

                    if (p.image_url) {
                        if (p.image_url.startsWith('http://') || p.image_url.startsWith('https://') || p.image_url.startsWith('data:')) {
                            imageLink = p.image_url;
                        } else if (p.image_url.length > 200 || /^[A-Za-z0-9+/]+=*$/.test(p.image_url)) {
                            // Base64 brute sans préfixe data: → invalide comme chemin Supabase, on ignore
                            imageLink = '';
                        } else {
                            const { data: imgData } = client.storage
                                .from('project-images')
                                .getPublicUrl(p.image_url);
                            imageLink = imgData.publicUrl;
                        }
                    }
                    let pdfLink = '#';
                    
                    // Si un PDF existe
                    if (p.pdf_url) {
                        // Vérifier si c'est déjà une URL complète (pour compatibilité avec les anciennes données)
                        if (p.pdf_url.startsWith('http://') || p.pdf_url.startsWith('https://')) {
                            pdfLink = p.pdf_url;
                        } else {
                            // Sinon, c'est un nom de fichier, générer l'URL publique
                            const { data: urlData } = client.storage
                                .from('project-pdfs')
                                .getPublicUrl(p.pdf_url);
                            pdfLink = urlData.publicUrl;
                        }
                    } 
                    // Sinon, utiliser le lien normal s'il existe
                    else if (p.link) {
                        pdfLink = p.link;
                    }
                    
                    const tagsHTML = p.tags && Array.isArray(p.tags) ? p.tags.map(t => `<span class="pill">${t}</span>`).join('') : '';
                    return `
                    <article class="card">
                        <div class="card-description">
                            ${p.description}
                        </div>
                        <a class="card-link" href="${pdfLink}" target="_blank" rel="noopener">
                            <div class="card-media">
                                ${imageLink
                                    ? `<img src="${imageLink}" alt="${p.title}" class="card-media-img">`
                                    : ''}
                            </div>
                            <div class="card-body">
                                <h3>${p.title}</h3>
                                ${tagsHTML ? `<div class="card-tags">${tagsHTML}</div>` : ''}
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
                        ${s.svg_icon ? `<div class="skill-icon">${s.svg_icon}</div>` : ''}
                        <span class="skill-name">${s.name}</span>
                        ${s.description ? `<p class="skill-description">${s.description}</p>` : ''}
                    </div>
                `).join('');

            }
        }
        
        // À PROPOS
        if (about.data) {
            const desc = document.getElementById('aboutDescription');
            const tags = document.getElementById('aboutTags');
            const avatar = document.getElementById('aboutAvatar');

            if (desc && about.data.description) desc.innerHTML = about.data.description;
            if (tags && about.data.tags && Array.isArray(about.data.tags)) {
                tags.innerHTML = about.data.tags.map(t => `<li>${t}</li>`).join('');
            }
            if (avatar && about.data.image_url) {
                const { data: imgData } = client.storage
                    .from('project-images')
                    .getPublicUrl(about.data.image_url);
                avatar.innerHTML = `<img src="${imgData.publicUrl}" alt="Photo de profil" style="width:100%;height:100%;object-fit:cover;display:block;">`;
            }
        }
        
        // EXPÉRIENCE
        if (experience.data && experience.data.length > 0) {
            const timeline = document.getElementById('experienceTimeline');
            if (timeline) {
                timeline.innerHTML = experience.data.map(e => {
                    const company = e.company || e.entreprise || e.organization || e.organisation || e.employer || '';
                    const type = e.type || e.contract || '';

                    // Titre de l'entreprise avec type de contrat si disponible
                    const companyLine = company
                        ? `${company}${type ? ` <span class="accent">—</span> ${type}` : ''}`
                        : e.title;

                    // Description : si multiligne → liste à puces, sinon paragraphe
                    const lines = e.description ? e.description.split('\n').map(l => l.trim()).filter(Boolean) : [];
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

                    return `
                    <div class="form-card">
                        <div class="form-year">${e.period || e.date || ''}</div>
                        <h3>${e.title}</h3>
                        ${institution ? `<p>${institution}</p>` : ''}
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

                if (contact.data.email) {
                    buttons.push(`
                        <a href="mailto:${contact.data.email}" class="contact-link" aria-label="Email">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="M2 7l10 7 10-7"/>
                            </svg>
                            Email
                        </a>
                    `);
                }

                if (contact.data.linkedin) {
                    buttons.push(`
                        <a href="${contact.data.linkedin}" target="_blank" rel="noopener" class="contact-link" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" fill="#0F0F0F"></path> <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" fill="#0F0F0F"></path> <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="#0F0F0F"></path> </g></svg>
                            LinkedIn
                        </a>
                    `);
                }

                if (contact.data.github) {
                    buttons.push(`
                        <a href="${contact.data.github}" target="_blank" rel="noopener" class="contact-link" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                            GitHub
                        </a>
                    `);
                }

                if (contact.data.phone) {
                    buttons.push(`
                        <a href="tel:${contact.data.phone.replace(/\s/g, '')}" class="contact-link" aria-label="Téléphone">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                            Téléphone
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
