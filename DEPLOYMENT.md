# 🚀 Guide de Déploiement - TikTok Video Extractor

Ce guide vous explique comment mettre en ligne votre application pour pouvoir créer votre app TikTok officielle.

## ⚡ Option 1: Vercel (Recommandé - Le plus simple)

**Avantages:** Gratuit, rapide, domaine HTTPS automatique

### Étapes:

1. **Créer un compte sur [Vercel](https://vercel.com)**

2. **Installer Vercel CLI:**
```bash
npm install -g vercel
```

3. **Déployer:**
```bash
vercel
```

4. **Suivre les instructions:**
   - Connectez votre compte
   - Confirmez le projet
   - Votre URL sera: `https://votre-projet.vercel.app`

### Configuration automatique:
Le fichier `vercel.json` est déjà configuré! ✅

---

## 🎯 Option 2: Render

**Avantages:** Gratuit, supporte Node.js, facile

### Étapes:

1. **Créer un compte sur [Render](https://render.com)**

2. **Nouveau Web Service:**
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repo GitHub/GitLab
   - Ou utilisez le déploiement manuel

3. **Configuration:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Ou utilisez le fichier `render.yaml` fourni

4. **Déployer:**
   - Cliquez sur "Create Web Service"
   - Votre URL: `https://votre-app.onrender.com`

---

## 🌐 Option 3: Railway

**Avantages:** Simple, gratuit pour commencer

### Étapes:

1. **Créer un compte sur [Railway](https://railway.app)**

2. **New Project:**
   - "Deploy from GitHub repo"
   - Ou "Deploy from local"

3. **Configuration automatique:**
   - Railway détecte Node.js automatiquement
   - Il utilise `npm start` automatiquement

4. **Obtenir l'URL:**
   - Generate Domain dans les settings
   - Votre URL: `https://votre-app.railway.app`

---

## 📦 Option 4: Déploiement via GitHub + Vercel (Automatique)

**Le plus professionnel - Mises à jour automatiques**

### Étapes:

1. **Initialiser Git et pousser sur GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - TikTok Extractor"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/tiktok-extractor.git
git push -u origin main
```

2. **Connecter à Vercel:**
   - Allez sur [Vercel](https://vercel.com/new)
   - Importez votre repo GitHub
   - Déploiement automatique!

3. **Mises à jour automatiques:**
   - Chaque `git push` redéploie automatiquement

---

## 🔧 Option 5: Heroku

### Étapes:

1. **Créer un fichier `Procfile`:**
```bash
echo "web: node server.js" > Procfile
```

2. **Installer Heroku CLI:**
```bash
npm install -g heroku
```

3. **Déployer:**
```bash
heroku login
heroku create votre-app-tiktok
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

---

## 📋 Checklist pour TikTok Developer

Une fois votre app en ligne, vous aurez besoin de:

### ✅ URLs requises pour TikTok:

- **Privacy Policy URL:** `https://votre-app.com/privacy`
- **Terms of Service URL:** `https://votre-app.com/terms`
- **Redirect URI:** `https://votre-app.com/callback`

### Créer ces pages:

```bash
# Je peux vous créer ces pages si besoin!
```

---

## 🎯 Méthode Express (5 minutes)

### Utiliser Vercel (Le plus rapide):

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel --prod
```

**C'est tout!** Vous aurez votre URL en 2 minutes! 🚀

---

## 🔐 Après le déploiement

1. **Testez votre URL:** `https://votre-app.vercel.app`

2. **Configurez les variables d'environnement:**
   - Sur Vercel/Render/Railway: Settings → Environment Variables
   - Ajoutez votre clé API TikTok quand vous l'aurez

3. **Créez votre TikTok App:**
   - Allez sur [TikTok Developers](https://developers.tiktok.com)
   - Créez une nouvelle app
   - Utilisez votre URL de déploiement

---

## 💡 Recommandation

**Pour une mise en ligne rapide:** Utilisez **Vercel** avec les 3 commandes ci-dessus.

**Pour un projet sérieux:** Mettez sur GitHub puis connectez à Vercel pour les déploiements automatiques.

---

## 🆘 Besoin d'aide?

Si vous voulez que je vous guide étape par étape avec une méthode spécifique, dites-moi laquelle vous préférez!
