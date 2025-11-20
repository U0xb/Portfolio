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
      submitBtn.textContent = '⏳ Connexion...';
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
        
        // Afficher le message d'erreur
        errorMessage.textContent = '❌ Email ou mot de passe incorrect';
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
  