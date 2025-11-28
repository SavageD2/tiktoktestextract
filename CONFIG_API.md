# Configuration API TikTok video no watermark2

## Votre API RapidAPI

**Nom** : TikTok video no watermark2  
**Host** : `tiktok-video-no-watermark2.p.rapidapi.com`  
**Votre clé** : `58e5d9576fmshc44ab9c98b8aeaap13fb03jsn6b5292d93042`

## Configuration Vercel

1. Allez sur **Vercel Dashboard** → Votre projet `tiktoktestextract`
2. **Settings** → **Environment Variables**
3. Ajoutez :

```
RAPIDAPI_KEY = 58e5d9576fmshc44ab9c98b8aeaap13fb03jsn6b5292d93042
RAPIDAPI_HOST = tiktok-video-no-watermark2.p.rapidapi.com
```

4. **Redéployez** le projet (Settings → Deployments → Redeploy)

## Endpoints utilisés

### 1. Extraction par URL
```
GET https://tiktok-video-no-watermark2.p.rapidapi.com/
Params: url, hd (optionnel)
```

✅ **Déjà fonctionnel dans l'app**

### 2. Infos utilisateur
```
GET https://tiktok-video-no-watermark2.p.rapidapi.com/user/info
Params: unique_id (@username), user_id (optionnel)
```

✅ **Configuré**

### 3. Vidéos d'un utilisateur
```
GET https://tiktok-video-no-watermark2.p.rapidapi.com/user/posts
Params: 
  - unique_id: @username (obligatoire, avec @)
  - user_id: ID numérique (optionnel mais améliore la fiabilité)
  - count: nombre de vidéos (défaut: 30)
  - cursor: pagination (défaut: 0)
```

✅ **Configuré**

## Format de réponse attendu

### User Info
```json
{
  "data": {
    "user": {
      "user_id": "107955",
      "unique_id": "tiktok",
      "nickname": "TikTok",
      "avatar_thumb": "https://...",
      "signature": "Bio du compte",
      "custom_verify": "✓",
      "follower_count": 123456,
      "following_count": 100,
      "aweme_count": 500
    }
  }
}
```

### User Posts
```json
{
  "data": {
    "aweme_list": [
      {
        "aweme_id": "7231338487075638570",
        "desc": "Titre de la vidéo",
        "video": {
          "cover": "https://...",
          "play": "https://...",
          "duration": 30
        },
        "statistics": {
          "digg_count": 1000,
          "comment_count": 50,
          "share_count": 20,
          "play_count": 50000
        },
        "create_time": 1234567890
      }
    ]
  }
}
```

## Test

Une fois configuré sur Vercel, testez avec :
- **URL** : `https://www.tiktok.com/@tiktok/video/7231338487075638570`
- **Utilisateur** : `tiktok` ou `@tiktok`

## Notes importantes

1. **@username requis** : L'API nécessite le @ devant le username pour `/user/posts`
2. **user_id optionnel** : Si récupéré depuis `/user/info`, améliore la fiabilité
3. **Pagination** : L'API supporte la pagination avec `cursor` (pour plus tard)
4. **Limite** : Vérifiez votre quota RapidAPI (requests/month)

## Prochaines fonctionnalités possibles

Avec cette API, vous pourriez ajouter :
- ✅ Extraction par URL (déjà fait)
- ✅ Extraction par utilisateur (configuré)
- 🔄 Vidéos favorites d'un utilisateur (`/user/favorite`)
- 🔄 Liste d'abonnés (`/user/follower`)
- 🔄 Liste d'abonnements (`/user/following`)
- 🔄 Stories d'un utilisateur (`/user/story`)
- 🔄 Recherche de vidéos par mot-clé
- 🔄 Vidéos par hashtag/challenge
