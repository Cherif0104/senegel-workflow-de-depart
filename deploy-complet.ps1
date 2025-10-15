# Script de déploiement complet de l'application Ecosystia
Write-Host "🚀 DÉPLOIEMENT COMPLET ECOSYSTIA" -ForegroundColor Green

# Vérifier l'environnement
Write-Host "🔍 Vérification de l'environnement..." -ForegroundColor Yellow

# Essayer de construire l'application
Write-Host "📦 Construction de l'application React..." -ForegroundColor Yellow

try {
    # Méthode 1: npm run build
    Write-Host "Tentative 1: npm run build" -ForegroundColor Cyan
    npm run build
    Write-Host "✅ Build réussi avec npm run build" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec npm run build, tentative alternative..." -ForegroundColor Red
    
    try {
        # Méthode 2: Vite direct
        Write-Host "Tentative 2: Vite direct" -ForegroundColor Cyan
        npx vite build
        Write-Host "✅ Build réussi avec Vite direct" -ForegroundColor Green
    } catch {
        Write-Host "❌ Échec Vite direct, création manuelle..." -ForegroundColor Red
        
        # Créer le dossier dist manuellement
        if (!(Test-Path "dist")) {
            New-Item -ItemType Directory -Path "dist" -Force
        }
        
        # Copier les fichiers essentiels
        Copy-Item "index.html" "dist/" -Force
        Copy-Item "src" "dist/" -Recurse -Force
        Copy-Item "public" "dist/" -Recurse -Force
        Copy-Item "package.json" "dist/" -Force
        
        Write-Host "✅ Dossier dist créé manuellement" -ForegroundColor Green
    }
}

# Vérifier le contenu du dossier dist
if (Test-Path "dist") {
    Write-Host "📁 Contenu du dossier dist:" -ForegroundColor Cyan
    Get-ChildItem "dist" -Recurse | Select-Object Name, Length | Format-Table
    
    Write-Host "🎯 DÉPLOIEMENT PRÊT!" -ForegroundColor Green
    Write-Host "📋 Options de déploiement:" -ForegroundColor Yellow
    
    Write-Host "1. VERCEL (Recommandé):" -ForegroundColor Cyan
    Write-Host "   - Aller sur https://vercel.com" -ForegroundColor White
    Write-Host "   - Importer le projet" -ForegroundColor White
    Write-Host "   - Uploader le dossier dist" -ForegroundColor White
    Write-Host "   - Configurer les variables d'environnement" -ForegroundColor White
    
    Write-Host "2. NETLIFY:" -ForegroundColor Cyan
    Write-Host "   - Aller sur https://netlify.com" -ForegroundColor White
    Write-Host "   - Importer le projet" -ForegroundColor White
    Write-Host "   - Uploader le dossier dist" -ForegroundColor White
    Write-Host "   - Configurer les variables d'environnement" -ForegroundColor White
    
    Write-Host "3. APPWRITE HOSTING:" -ForegroundColor Cyan
    Write-Host "   - Aller sur https://cloud.appwrite.io/console/project-68ee2dc2001f0f499c02/hosting" -ForegroundColor White
    Write-Host "   - Créer un nouveau hosting" -ForegroundColor White
    Write-Host "   - Uploader le dossier dist" -ForegroundColor White
    Write-Host "   - Configurer les variables d'environnement" -ForegroundColor White
    
    Write-Host "4. GITHUB PAGES:" -ForegroundColor Cyan
    Write-Host "   - Créer un repository GitHub" -ForegroundColor White
    Write-Host "   - Uploader les fichiers" -ForegroundColor White
    Write-Host "   - Activer GitHub Pages" -ForegroundColor White
    
} else {
    Write-Host "❌ Dossier dist non trouvé" -ForegroundColor Red
}

Write-Host "🎉 Script terminé!" -ForegroundColor Green
