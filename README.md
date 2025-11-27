# TikTok Video Extractor Bot 🎵

Bot d'extraction de vidéos TikTok avec interface web et API REST.

## 📋 Fonctionnalités

- ✅ Interface web moderne et responsive
- ✅ Extraction d'informations de vidéos TikTok via URL
- ✅ API REST pour l'intégration
- ✅ Historique des extractions
- ✅ Design moderne avec animations

## 🚀 Installation

1. **Installer les dépendances:**
```bash
npm install
```

2. **Démarrer le serveur:**
```bash
npm start
```

Ou en mode développement avec auto-reload:
```bash
npm run dev
```

3. **Ouvrir l'application:**
```
http://localhost:3000
```

## 📡 API Endpoints

### POST /api/extract
Extrait les informations d'une vidéo TikTok

**Body:**
```json
{
  "url": "https://www.tiktok.com/@user/video/123456789"
}
```

**Réponse:**
```json
{
  "success": true,
  "videoId": "123456789",
  "url": "...",
  "title": "Titre de la vidéo",
  "author": "@utilisateur",
  "description": "Description",
  "downloadUrl": "...",
  "thumbnail": "...",
  "duration": "00:30",
  "likes": "1.2K",
  "comments": "45",
  "shares": "89"
}
```

### GET /api/history
Récupère l'historique des extractions

**Réponse:**
```json
{
  "success": true,
  "history": [
    {
      "url": "...",
      "videoId": "...",
      "timestamp": "2025-11-27T...",
      "success": true
    }
  ]
}
```

## ⚙️ Configuration

### Intégration d'une vraie API TikTok

Cette version utilise des données simulées. Pour une implémentation réelle:

1. **Obtenir une clé API** (RapidAPI, TikTok API officielle, etc.)

2. **Modifier `server.js`:**
```javascript
const options = {
    method: 'GET',
    url: 'https://tiktok-download-video1.p.rapidapi.com/getVideo',
    params: { url: url },
    headers: {
        'X-RapidAPI-Key': 'VOTRE_CLE_API',
        'X-RapidAPI-Host': 'tiktok-download-video1.p.rapidapi.com'
    }
};

const response = await axios.request(options);
```

3. **Services recommandés:**
   - RapidAPI TikTok Downloader
   - TikTok Official API
   - TikTok-Scraper (npm package)

## 📁 Structure du projet

```
testtiktok/
├── index.html      # Page principale
├── styles.css      # Styles CSS
├── app.js          # JavaScript frontend
├── server.js       # Serveur Express API
├── package.json    # Dépendances
└── README.md       # Documentation
```

## 🔧 Technologies utilisées

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** Node.js, Express
- **API:** Axios pour les requêtes HTTP

## 📝 Notes importantes

- Cette version est une démo avec des données simulées
- Pour la production, intégrez une vraie API TikTok
- Respectez les conditions d'utilisation de TikTok
- Ajoutez une base de données pour l'historique en production
- Implémentez l'authentification si nécessaire

## 🚨 Limitations

- Les données affichées sont simulées
- Pas de téléchargement réel de vidéos sans API externe
- L'historique est stocké en mémoire (perdu au redémarrage)

## 📄 Licence

MIT
# tiktoktestextract
