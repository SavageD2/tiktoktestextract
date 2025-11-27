# 📡 Routes API - VidGrasp

## 🎯 Routes Frontend

### Pages HTML
- `GET /` → Page d'accueil (index.html)
- `GET /privacy` → Politique de confidentialité
- `GET /terms` → Conditions d'utilisation
- `GET /data-deletion` → Page de suppression de données

### Fichiers Statiques
- `GET /app.js` → JavaScript frontend
- `GET /styles.css` → Styles CSS
- Tous les autres fichiers statiques via express.static

### Vérification TikTok
- `GET /tiktokbngmKt14oERoWad8foVPMkNIBAP5LMlr.txt` → Vérification domaine 1
- `GET /tiktokHeAB0yIckVmtuBsDvJ0a2c34KJD5QgAs.txt` → Vérification domaine 2
- `GET /.well-known/tiktok-developers-site-verification` → Vérification DNS

---

## 🚀 Routes API Backend

### 1. Extraction d'une vidéo unique
**Endpoint:** `POST /api/extract`

**Body:**
```json
{
  "url": "https://www.tiktok.com/@user/video/123456789"
}
```

**Formats d'URL supportés:**
- `https://www.tiktok.com/@username/video/1234567890`
- `https://vm.tiktok.com/ABC123/` (liens courts)
- `https://www.tiktok.com/t/ABC123/`

**Réponse (succès):**
```json
{
  "success": true,
  "videoId": "123456789",
  "url": "https://www.tiktok.com/@user/video/123456789",
  "title": "Titre de la vidéo",
  "author": "@username",
  "description": "Description de la vidéo",
  "downloadUrl": "https://...",
  "thumbnail": "https://...",
  "duration": "00:30",
  "likes": "1000",
  "comments": "50",
  "shares": "100",
  "timestamp": "2025-11-28T..."
}
```

**Réponse (erreur):**
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

---

### 2. Extraction des vidéos d'un créateur
**Endpoint:** `POST /api/extract-user`

**Body:**
```json
{
  "username": "charlidamelio"
}
```
ou
```json
{
  "username": "@charlidamelio"
}
```

**Réponse (succès):**
```json
{
  "success": true,
  "username": "charlidamelio",
  "count": 30,
  "videos": [
    {
      "videoId": "123456789",
      "url": "https://www.tiktok.com/@charlidamelio/video/123456789",
      "title": "Titre de la vidéo",
      "description": "Description",
      "thumbnail": "https://...",
      "downloadUrl": "https://...",
      "duration": "00:30",
      "likes": 1000,
      "comments": 50,
      "shares": 100,
      "views": 50000,
      "createTime": "2025-11-28"
    },
    // ... jusqu'à 30 vidéos
  ]
}
```

**Réponse (mode démo sans clé API):**
```json
{
  "success": true,
  "username": "charlidamelio",
  "count": 5,
  "videos": [...],
  "demo": true
}
```

---

### 3. Historique des extractions
**Endpoint:** `GET /api/history`

**Réponse:**
```json
{
  "success": true,
  "history": [
    {
      "url": "https://www.tiktok.com/@user/video/123",
      "videoId": "123",
      "timestamp": "2025-11-28T...",
      "success": true
    }
  ]
}
```

---

### 4. Demande de suppression de données
**Endpoint:** `POST /api/data-deletion-request`

**Body:**
```json
{
  "email": "user@example.com",
  "userId": "optional",
  "reason": "Raison de la suppression",
  "timestamp": "2025-11-28T..."
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Votre demande a été enregistrée",
  "confirmationId": "DEL-1234567890"
}
```

---

## 🔐 Routes OAuth (TODO)

### Facebook
- `GET /auth/facebook/callback?code=...` → Callback OAuth Facebook

### TikTok
- `GET /auth/tiktok/callback?code=...` → Callback OAuth TikTok

---

## ⚙️ Configuration RapidAPI

### Variables d'environnement requises:
```env
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=tiktok-download-video1.p.rapidapi.com
```

### APIs RapidAPI compatibles:
1. **TikTok Download Video** (par yi005)
   - Host: `tiktok-download-video1.p.rapidapi.com`
   - Endpoints utilisés:
     - `/getVideo` → Extraction vidéo unique
     - `/getUserVideos` → Vidéos d'un créateur

2. **Alternatives:**
   - TikTok Scraper
   - Social Media Downloader
   - TikTok Video No Watermark

**Note:** Adaptez `RAPIDAPI_HOST` selon l'API choisie.

---

## 🧪 Mode Démo

Sans clé API configurée, l'application fonctionne en **mode démo** avec:
- Données simulées
- 5 vidéos pour la recherche par créateur
- Toutes les fonctionnalités UI actives
- Message indiquant le mode démo

---

## 📊 Codes de statut HTTP

- **200** - Succès
- **400** - Requête invalide (URL/username manquant ou invalide)
- **500** - Erreur serveur (erreur API, erreur interne)

---

## 🔒 CORS

CORS activé pour toutes les origines (à restreindre en production si nécessaire)

---

## 💡 Exemples d'utilisation

### Extraction vidéo unique (JavaScript)
```javascript
const response = await fetch('https://vidgrasp.xyz/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://www.tiktok.com/@user/video/123' 
  })
});
const data = await response.json();
```

### Extraction par créateur (JavaScript)
```javascript
const response = await fetch('https://vidgrasp.xyz/api/extract-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    username: 'charlidamelio' 
  })
});
const data = await response.json();
```
