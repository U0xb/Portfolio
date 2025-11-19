# 🚀 Portfolio avec Administration Supabase

Portfolio dynamique de Redouane avec interface d'administration sécurisée propulsée par Supabase.

## ✨ Fonctionnalités

- ✅ **Authentification sécurisée** avec Supabase Auth
- ✅ **Interface d'administration** complète
- ✅ **Modification en temps réel** de tout le contenu
- ✅ **Base de données PostgreSQL** gratuite et hébergée
- ✅ **Pas de serveur à gérer** - tout est dans le cloud
- ✅ **Responsive** - fonctionne sur mobile, tablette et desktop

## 📁 Structure des fichiers

```
portfolio/
├── index.html                  # Portfolio public (existant)
├── styles.css                  # Styles (existant)
├── script.js                   # Scripts portfolio (existant)
│
├── supabase-config.js          # 🆕 Configuration Supabase
├── portfolio-loader.js         # 🆕 Charge les données depuis Supabase
│
├── admin-login.html            # 🆕 Page de connexion admin
├── admin-dashboard.html        # 🆕 Interface d'administration
├── admin-dashboard.js          # 🆕 Logique du dashboard
│
└── README.md                   # 📖 Ce fichier
```

## 🎯 Installation rapide (15 minutes)

### Étape 1 : Configuration Supabase (5 min)

1. **Créer un compte** sur https://supabase.com
2. **Créer un projet** :
   - Nom : `portfolio-redouane`
   - Région : `Europe (West)`
   - Mot de passe DB : (générez-en un fort)
3. **Attendre 2-3 minutes** que le projet soit créé

### Étape 2 : Créer la base de données (3 min)

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez le contenu du fichier `supabase-setup.sql` (fourni dans le guide)
4. Cliquez sur **Run**
5. Vérifiez qu'il n'y a pas d'erreur

### Étape 3 : Créer votre compte admin (1 min)

1. Dans Supabase, allez dans **Authentication** > **Users**
2. Cliquez sur **Add user** > **Create new user**
3. Remplissez :
   - Email : `redouane@saraoui.fr`
   - Password : (votre mot de passe sécurisé)
   - ✅ **Auto Confirm User** (important !)
4. Cliquez sur **Create user**

### Étape 4 : Récupérer vos clés API (2 min)

1. Dans Supabase, allez dans **Project Settings** (⚙️) > **API**
2. Copiez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGci...` (longue chaîne)

### Étape 5 : Configurer votre site (3 min)

1. Ouvrez `supabase-config.js`
2. Remplacez les valeurs :

```javascript
const SUPABASE_URL = 'VOTRE_PROJECT_URL_ICI';
const SUPABASE_ANON_KEY = 'VOTRE_ANON_KEY_ICI';
```

3. Sauvegardez le fichier

### Étape 6 : Modifier index.html (2 min)

Dans votre `index.html`, ajoutez ces lignes **AVANT** `<script src="script.js" defer></script>` :

```html
<!-- Supabase JS -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="portfolio-loader.js"></script>
```

Résultat final dans index.html :
```html
    <!-- ... fin du footer ... -->
    
    <!-- Supabase JS -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="supabase-config.js"></script>
    <script src="portfolio-loader.js"></script>
    
    <script src="script.js" defer></script>
  </body>
</html>
```

## 🎉 C'est terminé !

Ouvrez `admin-login.html` dans votre navigateur :
1. Connectez-vous avec vos identifiants
2. Modifiez votre portfolio
3. Actualisez `index.html` pour voir les changements !

## 🔐 Sécurité

### ✅ Ce qui est sécurisé :

- Authentification par email + mot de passe
- Seuls les utilisateurs connectés peuvent modifier
- Données chiffrées en transit (HTTPS)
- Row Level Security (RLS) activé
- Clé `anon public` limitée par les politiques RLS

### ⚠️ Important :

- ✅ La clé `anon public` PEUT être publique (elle est limitée par RLS)
- ❌ Ne partagez JAMAIS la clé `service_role`
- ✅ Utilisez un mot de passe fort pour votre compte admin
- ✅ Activez l'authentification 2FA sur Supabase (recommandé)

## 📊 Déploiement

### Option 1 : Netlify (Recommandé - Gratuit)

1. Créez un compte sur https://netlify.com
2. Glissez-déposez votre dossier
3. Votre site est en ligne !

### Option 2 : Vercel (Aussi gratuit)

```bash
npm i -g vercel
vercel
```

### Option 3 : GitHub Pages

1. Créez un repo GitHub
2. Poussez vos fichiers
3. Activez GitHub Pages dans les settings
4. Votre site sera sur `https://username.github.io/portfolio`

## 🛠️ Personnalisation

### Modifier les sections du portfolio

Connectez-vous à `admin-dashboard.html` et modifiez :
- **Hero** : Titre et sous-titre de la page d'accueil
- **Projets** : Ajoutez, modifiez ou supprimez des projets
- **Compétences** : Gérez vos compétences et niveaux
- **À propos** : Votre description et tags
- **Expérience** : Votre parcours professionnel
- **Formation** : Vos diplômes et formations
- **Contact** : Téléphone, email, LinkedIn

### Ajouter des images aux projets

1. Dans Supabase, allez dans **Storage**
2. Créez un bucket public `project-images`
3. Uploadez vos images
4. Copiez l'URL publique
5. Collez-la dans le champ "Image URL" du projet

## 🔧 Maintenance

### Sauvegardes

Supabase sauvegarde automatiquement vos données quotidiennement. Pour exporter manuellement :

1. Allez dans **Database** > **Backups**
2. Cliquez sur **Download backup**

### Mise à jour du contenu

Tout se fait depuis l'interface d'administration, aucune connaissance technique requise !

### Limites gratuites Supabase

- 500 Mo de base de données
- 1 Go de stockage fichiers
- 2 Go de bande passante / mois
- 50 000 utilisateurs actifs mensuels

**Largement suffisant pour un portfolio personnel !**

## ❓ FAQ

### Q : Les données sont-elles vraiment sauvegardées ?
**R :** Oui ! Contrairement à la solution Node.js, Supabase sauvegarde tout dans une vraie base de données PostgreSQL.

### Q : Puis-je avoir plusieurs administrateurs ?
**R :** Oui, créez simplement d'autres utilisateurs dans Supabase Auth.

### Q : Le portfolio sera-t-il lent à charger ?
**R :** Non, Supabase est très rapide. Le contenu se charge en quelques millisecondes.

### Q : Puis-je utiliser mon propre domaine ?
**R :** Oui, avec Netlify/Vercel, vous pouvez connecter votre domaine personnalisé gratuitement.

### Q : Que se passe-t-il si je dépasse les limites gratuites ?
**R :** Supabase propose un plan Pro à 25$/mois, mais pour un portfolio, vous ne dépasserez probablement jamais les limites gratuites.

### Q : Puis-je revenir au contenu statique HTML ?
**R :** Oui, supprimez simplement les 3 lignes de script Supabase de index.html et votre portfolio redevient statique.

## 🆘 Besoin d'aide ?

### Problèmes courants

**❌ "Failed to fetch" lors de la connexion**
- Vérifiez que `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont corrects dans `supabase-config.js`
- Vérifiez votre connexion internet

**❌ "Invalid login credentials"**
- Vérifiez votre email et mot de passe
- Vérifiez que l'utilisateur a été créé dans Supabase Auth
- Assurez-vous que "Auto Confirm User" était coché

**❌ Le portfolio ne charge pas les données**
- Ouvrez la console (F12) et regardez les erreurs
- Vérifiez que les scripts Supabase sont bien chargés avant `script.js`
- Vérifiez que les politiques RLS sont bien créées

**❌ Je ne peux pas modifier le contenu**
- Vérifiez que vous êtes bien connecté
- Vérifiez que les politiques de modification sont créées (voir le guide SQL)
- Reconnectez-vous

### Support

- 📚 Documentation Supabase : https://supabase.com/docs
- 💬 Discord Supabase : https://discord.supabase.com
- 📧 Email : support@supabase.com

## 🎓 Ressources utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'authentification](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [API JavaScript](https://supabase.com/docs/reference/javascript/introduction)

## 📝 Licence

Ce portfolio est libre d'utilisation. Créé par Redouane.

## 🎉 Améliorations futures possibles

- [ ] Upload d'images pour les projets
- [ ] Prévisualisation avant publication
- [ ] Thème clair/sombre
- [ ] Statistiques de visite
- [ ] Mode brouillon
- [ ] Historique des modifications
- [ ] Authentification Google/GitHub
- [ ] Export PDF du CV

---

**Fait avec ♥ et Supabase**