// Vérifier si l'utilisateur est déjà connecté
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

// Fonction de vérification de l'authentification
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  // Si on est sur admin-login.html et qu'on est déjà connecté
  if (session && window.location.pathname.includes('admin-login.html')) {
    window.location.href = 'admin-dashboard.html';
  }
  
  // Si on est sur admin-dashboard.html et qu'on n'est PAS connecté
  if (!session && window.location.pathname.includes('admin-dashboard.html')) {
    window.location.href = 'admin-login.html';
  }
}

// Fonction pour créer un SVG loader (spinner)
function createLoaderSVG() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;">
    <circle cx="12" cy="12" r="10" opacity="0.25"/>
    <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75"/>
  </svg>`;
}

// Fonction pour créer un SVG d'erreur (X dans un cercle)
function createErrorSVG() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>`;
}

// Gestion du formulaire de connexion
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Désactiver le bouton pendant la connexion
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = createLoaderSVG() + 'Connexion...';
    submitBtn.disabled = true;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) throw error;
      
      // Connexion réussie
      console.log('Connexion réussie !', data);
      window.location.href = 'admin-dashboard.html';
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Afficher le message d'erreur avec SVG
      errorMessage.innerHTML = createErrorSVG() + 'Email ou mot de passe incorrect';
      errorMessage.classList.add('show');
      
      // Réactiver le bouton
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Masquer le message après 5 secondes
      setTimeout(() => {
        errorMessage.classList.remove('show');
      }, 5000);
    }
  });
}

// Fonction de déconnexion
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    window.location.href = 'admin-login.html';
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    alert('Erreur lors de la déconnexion');
  }
}
