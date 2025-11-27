# Formats d'API TikTok et Nomenclature

## Problèmes Courants

### 1. **Username vs ID utilisateur**

TikTok utilise plusieurs identifiants :
- **@username** : Le nom visible (ex: `@cleopatre_officielle`)
- **unique_id** : Identifiant unique texte
- **sec_uid** : ID sécurisé crypté (le plus fiable)
- **user_id** : ID numérique interne

**Solution** : Notre application essaie maintenant de récupérer d'abord les infos du créateur pour obtenir son `sec_uid`, puis utilise cet ID pour extraire les vidéos.

### 2. **Types de contenu**

TikTok héberge différents formats :
- **Vidéos** : Format standard
- **Photos** : Carrousels d'images (nouveau format 2024)
- **Lives** : Streams en direct
- **Stories** : Contenu éphémère

Certaines APIs ne supportent que les vidéos, pas les photos.

### 3. **Endpoints API disponibles**

Notre application essaie automatiquement ces endpoints dans l'ordre :

#### Pour récupérer les infos utilisateur :
```
GET /userInfo?username={username}
GET /user/info?username={username}
GET /api/user?uniqueId={username}
```

#### Pour récupérer les vidéos :
```
GET /getUserVideos?username={username}&count=30
GET /user/posts?username={username}&limit=30
GET /user/posts?secUid={sec_uid}&count=30
GET /api/user/posts?username={username}
GET /feed/user_posts?unique_id={username}&count=30
```

### 4. **Réponses API**

Les APIs retournent différents formats :

```json
// Format 1 (le plus courant)
{
  "data": {
    "videos": [...],
    "user": {...}
  }
}

// Format 2
{
  "videos": [...],
  "user": {...}
}

// Format 3 (avec pagination)
{
  "items": [...],
  "hasMore": true,
  "cursor": "..."
}
```

Notre application s'adapte automatiquement à ces formats.

### 5. **Informations créateur**

Quand disponibles, nous affichons :
- Avatar
- Nom d'affichage (nickname)
- Badge de vérification ✓
- Nombre d'abonnés
- Nombre total de vidéos
- Bio/Signature

## APIs RapidAPI recommandées

Ces APIs supportent l'extraction par utilisateur :

1. **TikTok Scraper7** (tiktok-scraper7.p.rapidapi.com)
   - Supporte : userInfo, getUserVideos
   - Fiabilité : ⭐⭐⭐⭐⭐

2. **TikTok API6** (tiktok-api6.p.rapidapi.com)
   - Supporte : user/info, user/posts
   - Fiabilité : ⭐⭐⭐⭐

3. **TikTok Full Info** (tiktok-full-info.p.rapidapi.com)
   - Supporte : api/user, feed/user_posts
   - Fiabilité : ⭐⭐⭐

## Diagnostic

Si l'extraction par utilisateur ne fonctionne pas :

1. **Vérifier les logs serveur** : Regardez quels endpoints sont essayés
2. **Tester l'API dans RapidAPI** : Utilisez le playground pour voir les endpoints disponibles
3. **Vérifier le nom d'utilisateur** : 
   - Essayez avec et sans `@`
   - Vérifiez les majuscules/minuscules
   - Testez sur le site TikTok directement
4. **Type de compte** :
   - Compte privé = pas d'accès
   - Compte business = endpoints différents possible
   - Compte avec contenu restreint = API peut bloquer

## Mode Démo

Sans clé API, l'application génère :
- 5 vidéos factices
- Profil créateur fictif
- Stats aléatoires

Cela permet de tester l'interface sans API configurée.
