# 🚀 GUIDE DE DÉPLOIEMENT - VERCEL

**Projet** : ERP SENEGEL  
**Client** : IMPULCIA  
**Date** : 13 octobre 2025

---

## 📋 PRÉREQUIS

1. **Compte Vercel** (gratuit)
   - Créer un compte sur : https://vercel.com/signup
   - Connecter avec GitHub (recommandé)

2. **Vercel CLI** (optionnel)
   ```bash
   npm i -g vercel
   ```

---

## 🚀 OPTION 1 : DÉPLOIEMENT VIA L'INTERFACE WEB (Recommandé)

### Étape 1 : Push sur GitHub

Si le code n'est pas déjà sur GitHub :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: Livraison ERP SENEGEL pour IMPULCIA"

# Créer un repository sur GitHub
# Puis :
git remote add origin [URL_REPOSITORY]
git branch -M main
git push -u origin main
```

### Étape 2 : Importer sur Vercel

1. Aller sur https://vercel.com/new
2. Cliquer sur **"Import Git Repository"**
3. Sélectionner le repository **SENEGEL-WorkFlow**
4. Configurer le projet :

**Configuration** :
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Variables d'environnement** :
```
VITE_APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68e54e9c002cb568cfec
VITE_APPWRITE_DATABASE_ID=68e56de100267007af6a
VITE_APPWRITE_STORAGE_BUCKET_ID=files
VITE_GEMINI_API_KEY=[si_disponible]
```

5. Cliquer sur **"Deploy"**

### Étape 3 : Attendre le déploiement

⏱️ Durée estimée : 2-3 minutes

Vous obtiendrez une URL du type :
```
https://senegel-workflow.vercel.app
```

ou un domaine personnalisé si configuré :
```
https://ecosystia.vercel.app
```

---

## 🚀 OPTION 2 : DÉPLOIEMENT VIA CLI

### Étape 1 : Installer Vercel CLI

```bash
npm i -g vercel
```

### Étape 2 : Se connecter à Vercel

```bash
vercel login
```

### Étape 3 : Déployer

```bash
# Déploiement de production
vercel --prod
```

Suivre les instructions :

```
? Set up and deploy "C:\Users\HP\Desktop\SENEGEL-WorkFlow"? [Y/n] Y
? Which scope do you want to deploy to? [Votre compte]
? Link to existing project? [N]
? What's your project's name? ecosystia
? In which directory is your code located? ./
? Want to override the settings? [N]
```

### Étape 4 : Configurer les variables d'environnement

```bash
# Ajouter les variables une par une
vercel env add VITE_APPWRITE_ENDPOINT production
# Valeur : https://sfo.cloud.appwrite.io/v1

vercel env add VITE_APPWRITE_PROJECT_ID production
# Valeur : 68e54e9c002cb568cfec

vercel env add VITE_APPWRITE_DATABASE_ID production
# Valeur : 68e56de100267007af6a

vercel env add VITE_APPWRITE_STORAGE_BUCKET_ID production
# Valeur : files
```

### Étape 5 : Redéployer avec les variables

```bash
vercel --prod
```

---

## 🌐 DOMAINE PERSONNALISÉ (Optionnel)

### Ajouter un domaine personnalisé

1. Aller dans le dashboard Vercel
2. Sélectionner le projet
3. Aller dans **Settings** → **Domains**
4. Cliquer sur **"Add"**
5. Entrer votre domaine : `ecosystia.com` ou `erp.impulcia-afrique.com`
6. Suivre les instructions DNS

**Configuration DNS** :

```
Type: CNAME
Name: @ (ou www)
Value: cname.vercel-dns.com
```

---

## ✅ VÉRIFICATION DU DÉPLOIEMENT

### 1. Vérifier l'URL

Accéder à : https://[votre-projet].vercel.app

### 2. Tester la connexion

1. Se connecter avec : `admin@ecosystia.com` / `Admin123!`
2. Vérifier que le Dashboard s'affiche
3. Créer un projet de test
4. Rafraîchir la page (F5)
5. ✅ Le projet doit rester présent

### 3. Vérifier les performances

Utiliser Lighthouse (Chrome DevTools) :
- Performance : > 80
- Accessibility : > 90
- Best Practices : > 90
- SEO : > 90

### 4. Tester sur mobile

- Ouvrir sur un smartphone
- Vérifier la responsivité
- Tester la navigation

---

## 🔧 CONFIGURATION AVANCÉE

### 1. Redéploiement automatique

Vercel redéploie automatiquement à chaque push sur GitHub (branche `main`)

### 2. Preview deployments

Chaque pull request crée automatiquement un déploiement de prévisualisation

### 3. Monitoring

Accéder aux analytics Vercel :
- **Analytics** : Trafic, performance, erreurs
- **Logs** : Logs de build et runtime
- **Speed Insights** : Métriques de performance

### 4. Rollback

En cas de problème, revenir à une version précédente :
1. Aller dans **Deployments**
2. Sélectionner une version précédente
3. Cliquer sur **"Promote to Production"**

---

## 🔐 SÉCURITÉ

### Headers de sécurité (déjà configurés dans vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### HTTPS

✅ HTTPS activé automatiquement par Vercel (certificat SSL gratuit)

---

## 📊 MÉTRIQUES POST-DÉPLOIEMENT

### Performance attendue

| Métrique | Valeur cible | Mesure |
|----------|--------------|--------|
| **First Contentful Paint (FCP)** | < 1.8s | [À mesurer] |
| **Largest Contentful Paint (LCP)** | < 2.5s | [À mesurer] |
| **Time to Interactive (TTI)** | < 3.8s | [À mesurer] |
| **Cumulative Layout Shift (CLS)** | < 0.1 | [À mesurer] |

### Monitoring

Activer les outils de monitoring :
- **Vercel Analytics** (inclus)
- **Sentry** (erreurs - optionnel)
- **LogRocket** (sessions - optionnel)

---

## 🆘 DÉPANNAGE

### Problème 1 : Build failed

**Symptôme** : Erreur pendant le build

**Solutions** :
1. Vérifier les logs de build
2. Tester le build localement : `npm run build`
3. Vérifier les dépendances : `npm install`
4. Vérifier Node.js version (18+)

### Problème 2 : Page blanche après déploiement

**Symptôme** : Page blanche, erreurs console

**Solutions** :
1. Vérifier les variables d'environnement
2. Vérifier `vercel.json` (rewrites configurés)
3. Vérifier la console navigateur (F12)
4. Vérifier les CORS Appwrite

### Problème 3 : Erreur Appwrite

**Symptôme** : "Failed to connect to Appwrite"

**Solutions** :
1. Vérifier les variables d'environnement Appwrite
2. Vérifier que le domaine Vercel est autorisé dans Appwrite :
   - Aller sur https://cloud.appwrite.io/console
   - Projet → Settings → Platforms
   - Ajouter : `https://[votre-projet].vercel.app`

### Problème 4 : Erreur 404 sur les routes

**Symptôme** : 404 sur les URLs directes

**Solution** :
Vérifier que `vercel.json` contient :
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT

### Avant le déploiement

- [x] Build de production réussi localement
- [x] Tests fonctionnels validés
- [x] Variables d'environnement préparées
- [x] `vercel.json` configuré
- [x] Git repository prêt (si déploiement via GitHub)

### Pendant le déploiement

- [ ] Projet créé sur Vercel
- [ ] Repository connecté (ou CLI utilisée)
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] URL de production générée

### Après le déploiement

- [ ] Application accessible
- [ ] Connexion fonctionnelle
- [ ] Persistance validée
- [ ] Performance testée (Lighthouse)
- [ ] Tests sur mobile
- [ ] Domaine Vercel autorisé dans Appwrite

---

## 🎯 URL DE PRODUCTION

Une fois déployé, l'application sera accessible sur :

```
https://ecosystia.vercel.app
```

Ou votre domaine personnalisé :

```
https://erp.impulcia-afrique.com
```

---

## 📞 SUPPORT VERCEL

### Documentation

- **Vercel Docs** : https://vercel.com/docs
- **Vite Deployment** : https://vitejs.dev/guide/static-deploy.html#vercel

### Support

- **Vercel Support** : https://vercel.com/support
- **Community** : https://github.com/vercel/vercel/discussions

---

## 🎉 FÉLICITATIONS !

Votre application est maintenant **déployée en production sur Vercel** ! 🚀

**Prochaines étapes** :
1. ✅ Tester l'application en production
2. ✅ Partager l'URL avec IMPULCIA
3. ✅ Configurer un domaine personnalisé (optionnel)
4. ✅ Activer le monitoring

---

**Date** : 13 octobre 2025  
**Projet** : ERP SENEGEL  
**Client** : IMPULCIA  
**Statut** : ✅ **PRÊT POUR LE DÉPLOIEMENT**

