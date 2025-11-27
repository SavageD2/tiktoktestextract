# Configuration des APIs - VidGrasp

## 🔐 Variables d'environnement requises

Créez un fichier `.env` à la racine du projet avec les informations suivantes :

```bash
# Facebook App
FACEBOOK_APP_ID=votre_app_id
FACEBOOK_APP_SECRET=votre_app_secret
FACEBOOK_REDIRECT_URI=https://vidgrasp.xyz/auth/facebook/callback

# TikTok App
TIKTOK_CLIENT_KEY=votre_client_key
TIKTOK_CLIENT_SECRET=votre_client_secret
TIKTOK_REDIRECT_URI=https://vidgrasp.xyz/auth/tiktok/callback

# Server
NODE_ENV=production
PORT=3000
```

## 📱 Configuration Facebook App

### 1. URLs à configurer dans Facebook Developers :

- **App Domains** : `vidgrasp.xyz`
- **Site URL** : `https://vidgrasp.xyz`
- **Privacy Policy URL** : `https://vidgrasp.xyz/privacy`
- **Terms of Service URL** : `https://vidgrasp.xyz/terms`
- **User Data Deletion URL** : `https://vidgrasp.xyz/data-deletion`
- **Valid OAuth Redirect URIs** : `https://vidgrasp.xyz/auth/facebook/callback`

### 2. Permissions requises :

- `public_profile`
- `email`
- Ajoutez d'autres permissions selon vos besoins

### 3. Vérification du domaine :

Si Facebook demande une vérification, ajoutez la balise meta dans `index.html` :
```html
<meta property="fb:app_id" content="VOTRE_APP_ID" />
```

## 🎵 Configuration TikTok App

### 1. URLs à configurer dans TikTok Developers :

- **Website URL** : `https://vidgrasp.xyz`
- **Privacy Policy URL** : `https://vidgrasp.xyz/privacy`
- **Terms of Service URL** : `https://vidgrasp.xyz/terms`
- **Redirect URI** : `https://vidgrasp.xyz/auth/tiktok/callback`

### 2. Scopes requis :

- `user.info.basic`
- `video.list`
- Ajoutez d'autres scopes selon vos besoins

### 3. Fichiers de vérification :

✅ Déjà configurés :
- `tiktokbngmKt14oERoWad8foVPMkNIBAP5LMlr.txt`
- `tiktokHeAB0yIckVmtuBsDvJ0a2c34KJD5QgAs.txt`

## 🚀 Déploiement sur Vercel

### Configurer les variables d'environnement :

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Ajoutez toutes les variables du fichier `.env`

### Redéployer :

```bash
git add .
git commit -m "Add Facebook/TikTok integration"
git push
```

Vercel redéploiera automatiquement.

## 📝 Checklist de configuration

### Facebook :
- [ ] App créée sur developers.facebook.com
- [ ] App ID et Secret récupérés
- [ ] URLs configurées (Privacy, Terms, Data Deletion)
- [ ] Redirect URI configuré
- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] Domaine vérifié

### TikTok :
- [ ] App créée sur developers.tiktok.com
- [ ] Client Key et Secret récupérés
- [ ] URLs configurées (Privacy, Terms)
- [ ] Redirect URI configuré
- [ ] Fichiers de vérification déployés
- [ ] Variables d'environnement ajoutées sur Vercel

## 🔧 Test de l'intégration

Une fois tout configuré, testez :

1. **Facebook Login** : `https://vidgrasp.xyz` → Bouton Facebook Login
2. **TikTok Auth** : `https://vidgrasp.xyz` → Bouton TikTok Login
3. **Data Deletion** : `https://vidgrasp.xyz/data-deletion`
4. **Privacy Policy** : `https://vidgrasp.xyz/privacy`
5. **Terms of Service** : `https://vidgrasp.xyz/terms`

## 📚 Ressources

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [TikTok Login Kit](https://developers.tiktok.com/doc/login-kit-web)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
