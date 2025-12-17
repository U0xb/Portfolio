# Script PowerShell pour mettre à jour automatiquement la date dans sitemap.xml

$sitemapPath = Join-Path $PSScriptRoot "sitemap.xml"

# Obtenir la date actuelle au format YYYY-MM-DD
$today = Get-Date -Format "yyyy-MM-dd"

try {
    # Lire le fichier sitemap.xml
    $content = Get-Content -Path $sitemapPath -Raw -Encoding UTF8
    
    # Remplacer toutes les dates lastmod par la date actuelle
    # Format: <lastmod>YYYY-MM-DD</lastmod>
    $content = $content -replace '<lastmod>\d{4}-\d{2}-\d{2}</lastmod>', "<lastmod>$today</lastmod>"
    
    # Écrire le fichier mis à jour
    $content | Set-Content -Path $sitemapPath -Encoding UTF8 -NoNewline
    
    Write-Host "✅ Sitemap mis à jour avec la date: $today" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la mise à jour du sitemap: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
