// Script pour mettre à jour automatiquement la date dans sitemap.xml
const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'sitemap.xml');

// Obtenir la date actuelle au format YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

try {
    // Lire le fichier sitemap.xml
    let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Remplacer toutes les dates lastmod par la date actuelle
    // Format: <lastmod>YYYY-MM-DD</lastmod>
    const dateRegex = /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g;
    const updatedContent = sitemapContent.replace(dateRegex, `<lastmod>${today}</lastmod>`);
    
    // Écrire le fichier mis à jour
    fs.writeFileSync(sitemapPath, updatedContent, 'utf8');
    
    console.log(`✅ Sitemap mis à jour avec la date: ${today}`);
} catch (error) {
    console.error('❌ Erreur lors de la mise à jour du sitemap:', error.message);
    process.exit(1);
}
