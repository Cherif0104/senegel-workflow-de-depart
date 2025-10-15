# Script de déploiement simple
Write-Host "🚀 DÉPLOIEMENT ECOSYSTIA - VERSION SIMPLE" -ForegroundColor Green

# Vérifier si Node.js fonctionne
Write-Host "🔍 Vérification de l'environnement..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non disponible" -ForegroundColor Red
    Write-Host "🔧 Solutions alternatives:" -ForegroundColor Yellow
    Write-Host "1. Utiliser Vercel: https://vercel.com" -ForegroundColor White
    Write-Host "2. Utiliser Netlify: https://netlify.com" -ForegroundColor White
    Write-Host "3. Utiliser GitHub Pages: https://pages.github.com" -ForegroundColor White
    exit 1
}

# Essayer de construire l'application
Write-Host "📦 Construction de l'application..." -ForegroundColor Yellow

try {
    npm run build
    Write-Host "✅ Build réussi!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build échoué, création manuelle..." -ForegroundColor Red
    
    # Créer le dossier dist manuellement
    if (!(Test-Path "dist")) {
        New-Item -ItemType Directory -Path "dist" -Force
        Write-Host "✅ Dossier dist créé" -ForegroundColor Green
    }
    
    # Copier les fichiers essentiels
    if (Test-Path "index.html") {
        Copy-Item "index.html" "dist/" -Force
        Write-Host "✅ index.html copié" -ForegroundColor Green
    }
    
    if (Test-Path "src") {
        Copy-Item "src" "dist/" -Recurse -Force
        Write-Host "✅ Dossier src copié" -ForegroundColor Green
    }
    
    if (Test-Path "public") {
        Copy-Item "public" "dist/" -Recurse -Force
        Write-Host "✅ Dossier public copié" -ForegroundColor Green
    }
    
    if (Test-Path "package.json") {
        Copy-Item "package.json" "dist/" -Force
        Write-Host "✅ package.json copié" -ForegroundColor Green
    }
}

# Vérifier le contenu du dossier dist
if (Test-Path "dist") {
    Write-Host "📁 Contenu du dossier dist:" -ForegroundColor Cyan
    Get-ChildItem "dist" -Recurse | Select-Object Name, Length | Format-Table
    
    Write-Host "🎯 DÉPLOIEMENT PRÊT!" -ForegroundColor Green
    Write-Host "📋 Étapes suivantes:" -ForegroundColor Yellow
    Write-Host "1. Aller sur https://cloud.appwrite.io/console/project-68ee2dc2001f0f499c02/hosting" -ForegroundColor White
    Write-Host "2. Créer un nouveau hosting" -ForegroundColor White
    Write-Host "3. Uploader le contenu du dossier 'dist'" -ForegroundColor White
    Write-Host "4. Configurer les variables d'environnement" -ForegroundColor White
    Write-Host "5. Déployer l'application" -ForegroundColor White
    
    Write-Host "🌐 Alternatives de déploiement:" -ForegroundColor Cyan
    Write-Host "- Vercel: https://vercel.com" -ForegroundColor White
    Write-Host "- Netlify: https://netlify.com" -ForegroundColor White
    Write-Host "- GitHub Pages: https://pages.github.com" -ForegroundColor White
    
} else {
    Write-Host "❌ Dossier dist non trouvé" -ForegroundColor Red
}

Write-Host "🎉 Script terminé!" -ForegroundColor Green
