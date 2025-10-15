# Script de déploiement automatique sur Vercel
Write-Host "🚀 DÉPLOIEMENT AUTOMATIQUE VERCEL" -ForegroundColor Green

# Vérifier si Vercel CLI est installé
Write-Host "🔍 Vérification de Vercel CLI..." -ForegroundColor Yellow

try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI non installé, installation..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installé" -ForegroundColor Green
}

# Déployer sur Vercel
Write-Host "🌐 Déploiement sur Vercel..." -ForegroundColor Yellow

try {
    vercel --prod --yes
    Write-Host "✅ Déploiement réussi sur Vercel!" -ForegroundColor Green
    Write-Host "🎯 Votre application est maintenant accessible en ligne!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur de déploiement Vercel" -ForegroundColor Red
    Write-Host "🔧 Solutions alternatives:" -ForegroundColor Yellow
    Write-Host "1. Aller sur https://vercel.com et importer manuellement" -ForegroundColor White
    Write-Host "2. Utiliser Netlify: https://netlify.com" -ForegroundColor White
    Write-Host "3. Utiliser GitHub Pages" -ForegroundColor White
}

Write-Host "🎉 Script terminé!" -ForegroundColor Green
