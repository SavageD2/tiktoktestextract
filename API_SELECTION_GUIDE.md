# 🔧 Guide de sélection d'API RapidAPI pour TikTok

## ⚠️ Problème actuel

L'extraction par **créateur/utilisateur** ne fonctionne pas car l'API RapidAPI que vous utilisez ne supporte pas cette fonctionnalité.

**L'extraction par URL unique fonctionne toujours !** ✅

---

## 🎯 APIs RapidAPI recommandées

Voici les APIs qui supportent l'extraction par utilisateur :

### 1. **TikTok Scraper** ⭐ Recommandé
- **URL:** https://rapidapi.com/tikwm-tikwm-default/api/tiktok-scraper7
- **Endpoints:**
  - ✅ Extraction par URL
  - ✅ Extraction par utilisateur
  - ✅ Recherche de vidéos
- **Plans:** Gratuit jusqu'à 100 requêtes/mois
- **Host:** `tiktok-scraper7.p.rapidapi.com`

### 2. **TikTok API (by tikapi)**
- **URL:** https://rapidapi.com/tikapi/api/tiktok-api6
- **Endpoints:**
  - ✅ Extraction par URL
  - ✅ Profil utilisateur + vidéos
  - ✅ Hashtags et trends
- **Plans:** Gratuit jusqu'à 500 requêtes/mois
- **Host:** `tiktok-api6.p.rapidapi.com`

### 3. **Social Media Downloader**
- **URL:** https://rapidapi.com/social-media-download/api/social-media-video-downloader
- **Endpoints:**
  - ✅ Extraction multi-plateformes (TikTok, Instagram, YouTube, etc.)
  - ✅ Extraction par URL
  - ⚠️ Extraction par utilisateur limitée
- **Plans:** Gratuit jusqu'à 100 requêtes/mois

---

## 📝 Configuration étape par étape

### Option A : Changer d'API RapidAPI

1. **Désabonnez-vous** de votre API actuelle (si elle ne supporte pas l'extraction par user)

2. **Abonnez-vous** à une des APIs recommandées ci-dessus

3. **Copiez** votre nouvelle clé API

4. **Configurez sur Vercel** :
   - Dashboard → Projet → Settings → Environment Variables
   - Modifiez :
     ```
     RAPIDAPI_KEY = [votre_nouvelle_clé]
     RAPIDAPI_HOST = [nouveau_host comme tiktok-scraper7.p.rapidapi.com]
     ```

5. **Redéployez** :
   ```bash
   vercel --prod
   ```

### Option B : Utiliser uniquement l'extraction par URL

Si vous ne voulez pas changer d'API :

1. **Désactivez** le mode "Créateur" dans l'interface
2. **Utilisez uniquement** le mode "URL Unique"
3. Ça fonctionne avec **toutes** les APIs TikTok

---

## 🔍 Comment vérifier les endpoints de votre API

1. Allez sur votre API sur RapidAPI
2. Cliquez sur **"Endpoints"** dans le menu
3. Cherchez :
   - `getUserVideos`, `user/posts`, `profile`, `user/feed` → Extraction par utilisateur ✅
   - `getVideo`, `download`, `video/info` → Extraction par URL ✅

---

## 🧪 Test de l'API

Pour tester si votre API supporte l'extraction par utilisateur :

1. Sur RapidAPI, allez dans **"Test Endpoint"**
2. Cherchez un endpoint comme `getUserVideos` ou `user/posts`
3. Entrez un username test : `charlidamelio`
4. Cliquez sur **"Test Endpoint"**
5. Si ça retourne des vidéos → ✅ Compatible

---

## 💡 Solutions alternatives

### Si vous ne voulez pas payer pour une API :

1. **Mode démo** : L'app fonctionne sans clé API (données simulées)
2. **Scraping web** : Nécessite un serveur dédié (non compatible Vercel serverless)
3. **API TikTok officielle** : Gratuite mais nécessite validation d'app TikTok

---

## 📊 Comparaison des APIs

| API | Prix | Extraction URL | Extraction User | Watermark |
|-----|------|----------------|-----------------|-----------|
| TikTok Scraper7 | Gratuit (100/mois) | ✅ | ✅ | ❌ Sans |
| TikTok API6 | Gratuit (500/mois) | ✅ | ✅ | ❌ Sans |
| Social Media Downloader | Gratuit (100/mois) | ✅ | ⚠️ Limité | ⚠️ Dépend |
| Votre API actuelle | ? | ✅ | ❌ | ? |

---

## 🚀 Prochaines étapes

1. **Choisissez** une API dans la liste recommandée
2. **Abonnez-vous** (plan gratuit disponible)
3. **Configurez** sur Vercel avec la nouvelle clé et host
4. **Testez** l'extraction par créateur sur https://vidgrasp.xyz

---

## ❓ Questions fréquentes

**Q: Puis-je utiliser plusieurs APIs ?**
R: Oui, mais une seule à la fois. Changez `RAPIDAPI_KEY` et `RAPIDAPI_HOST` selon l'API.

**Q: L'extraction par URL fonctionne-t-elle toujours ?**
R: Oui ! Toutes les APIs TikTok supportent l'extraction par URL.

**Q: Combien coûte une bonne API ?**
R: Les plans gratuits offrent 100-500 requêtes/mois. Plans payants : ~10-50€/mois pour 10k+ requêtes.

**Q: Puis-je coder mon propre scraper ?**
R: Oui, mais TikTok bloque facilement. Les APIs sont plus fiables.

---

## 📞 Support

Si vous avez des questions sur la configuration, n'hésitez pas !
