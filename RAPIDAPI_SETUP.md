# ⚙️ Configuration de RapidAPI

## 1. Créer un fichier `.env` à la racine du projet

Copiez ce modèle et remplacez par vos vraies valeurs :

```env
# RapidAPI Configuration
RAPIDAPI_KEY=votre_cle_rapidapi_ici
RAPIDAPI_HOST=tiktok-download-video1.p.rapidapi.com

# Server Configuration
PORT=3000
NODE_ENV=production
```

## 2. Obtenir votre clé RapidAPI

1. Allez sur https://rapidapi.com
2. Connectez-vous à votre compte
3. Recherchez "TikTok Downloader" ou "TikTok Video Download"
4. Abonnez-vous à une API (il y a des plans gratuits)
5. Copiez votre **X-RapidAPI-Key**

## 3. APIs TikTok recommandées sur RapidAPI

- **TikTok Download Video** - https://rapidapi.com/yi005/api/tiktok-download-video1
- **TikTok Video No Watermark** - Plusieurs options disponibles
- **Social Media Downloader** - APIs multi-plateformes

## 4. Tester localement

```bash
# Créez votre fichier .env avec vos clés
echo "RAPIDAPI_KEY=votre_cle" > .env
echo "RAPIDAPI_HOST=tiktok-download-video1.p.rapidapi.com" >> .env

# Démarrez le serveur
npm start
```

## 5. Configurer sur Vercel

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet `tiktoktestextract`
3. Settings → Environment Variables
4. Ajoutez :
   - `RAPIDAPI_KEY` = votre clé
   - `RAPIDAPI_HOST` = tiktok-download-video1.p.rapidapi.com

## 6. Redéployer

```bash
git add .
git commit -m "Add RapidAPI integration"
git push
vercel --prod
```

## ⚠️ Important

- **Ne commitez JAMAIS le fichier `.env`** sur Git (déjà dans `.gitignore`)
- L'application fonctionne en mode démo sans clé API
- Avec la clé API, vous aurez les vraies données TikTok
- Surveillez vos quotas sur RapidAPI

## 📊 Réponse API attendue

L'API doit retourner un objet avec au minimum :
```json
{
  "data": {
    "title": "Titre de la vidéo",
    "author": { "nickname": "@user" },
    "desc": "Description",
    "play": "URL de téléchargement",
    "cover": "URL thumbnail",
    "duration": "30",
    "digg_count": 1000,
    "comment_count": 50,
    "share_count": 100
  }
}
```
