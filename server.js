require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques avec les bons MIME types
app.get('/app.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'app.js'));
});

app.get('/styles.css', (req, res) => {
    res.type('text/css');
    res.sendFile(path.join(__dirname, 'styles.css'));
});

// Autres fichiers statiques
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Stocker l'historique en mémoire (en production, utilisez une base de données)
let extractionHistory = [];

// Route principale - servir la page HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour la politique de confidentialité
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy.html'));
});

// Route pour les conditions d'utilisation
app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms.html'));
});

// Route pour la suppression des données (requis par Facebook)
app.get('/data-deletion', (req, res) => {
    res.sendFile(path.join(__dirname, 'data-deletion.html'));
});

// Route pour la vérification TikTok (fichier prefix 1)
app.get('/tiktokbngmKt14oERoWad8foVPMkNIBAP5LMlr.txt', (req, res) => {
    res.type('text/plain');
    res.send('tiktok-developers-site-verification=bngmKt14oERoWad8foVPMkNIBAP5LMlr');
});

// Route pour la vérification TikTok (fichier prefix 2 - vidgrasp.xyz)
app.get('/tiktokHeAB0yIckVmtuBsDvJ0a2c34KJD5QgAs.txt', (req, res) => {
    res.type('text/plain');
    res.send('tiktok-developers-site-verification=HeAB0yIckVmtuBsDvJ0a2c34KJD5QgAs');
});

// Route pour la vérification TikTok DNS (si nécessaire)
app.get('/.well-known/tiktok-developers-site-verification', (req, res) => {
    res.type('text/plain');
    res.send('tiktok-developers-site-verification=W2FaR8AQaqRSVsma7RbJ3V58aN9PnEhX');
});

// API pour les demandes de suppression de données
app.post('/api/data-deletion-request', async (req, res) => {
    try {
        const { email, userId, reason, timestamp } = req.body;
        
        // TODO: En production, stockez cela dans une base de données
        // et envoyez un email de confirmation
        console.log('Demande de suppression:', { email, userId, reason, timestamp });
        
        // Simuler l'envoi d'email
        res.json({
            success: true,
            message: 'Votre demande a été enregistrée',
            confirmationId: `DEL-${Date.now()}`
        });
    } catch (error) {
        console.error('Erreur demande suppression:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors du traitement de votre demande'
        });
    }
});

// Route callback pour Facebook OAuth
app.get('/auth/facebook/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        // TODO: Échangez le code contre un token d'accès Facebook
        // const accessToken = await exchangeCodeForToken(code);
        
        res.redirect('/?auth=success');
    } catch (error) {
        console.error('Erreur auth Facebook:', error);
        res.redirect('/?auth=error');
    }
});

// Route callback pour TikTok OAuth
app.get('/auth/tiktok/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        // TODO: Échangez le code contre un token d'accès TikTok
        // const accessToken = await exchangeCodeForToken(code);
        
        res.redirect('/?auth=success');
    } catch (error) {
        console.error('Erreur auth TikTok:', error);
        res.redirect('/?auth=error');
    }
});

// API pour extraire les vidéos d'un créateur TikTok
app.post('/api/extract-user', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'Nom d\'utilisateur requis'
            });
        }

        // Nettoyer le username (enlever @ si présent)
        const cleanUsername = username.replace('@', '').trim();

        if (process.env.RAPIDAPI_KEY) {
            try {
                // Essayer différents endpoints selon l'API RapidAPI utilisée
                let apiData;
                let endpoint;
                let userInfo = null;
                
                // D'abord essayer de récupérer les infos du créateur
                const userEndpoints = [
                    {
                        url: `https://${process.env.RAPIDAPI_HOST || 'tiktok-video-no-watermark2.p.rapidapi.com'}/user/info`,
                        params: { unique_id: cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}` }
                    }
                ];
                
                // Essayer de récupérer les infos utilisateur (non-bloquant)
                for (const ep of userEndpoints) {
                    try {
                        const options = {
                            method: 'GET',
                            url: ep.url,
                            params: ep.params,
                            headers: {
                                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'tiktok-download-video1.p.rapidapi.com'
                            },
                            timeout: 10000
                        };
                        const response = await axios.request(options);
                        console.log('📥 Réponse user/info:', JSON.stringify(response.data, null, 2));
                        userInfo = response.data?.data?.user || response.data?.user || response.data;
                        console.log(`✓ Infos utilisateur récupérées:`, userInfo?.unique_id || userInfo?.id);
                        break;
                    } catch (error) {
                        console.log(`✗ Endpoint user info échoué: ${ep.url}`);
                        continue;
                    }
                }
                
                // Liste des endpoints possibles pour différentes APIs TikTok
                // Utiliser user_id si disponible depuis userInfo
                const userId = userInfo?.user_id || userInfo?.uid || '';
                const uniqueId = cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}`;
                
                const endpoints = [
                    {
                        url: `https://${process.env.RAPIDAPI_HOST || 'tiktok-video-no-watermark2.p.rapidapi.com'}/user/posts`,
                        params: { 
                            unique_id: uniqueId,
                            ...(userId && { user_id: userId }),
                            count: 30,
                            cursor: 0
                        }
                    }
                ];

                // Essayer chaque endpoint jusqu'à ce qu'un fonctionne
                let lastError;
                for (const ep of endpoints) {
                    try {
                        const options = {
                            method: 'GET',
                            url: ep.url,
                            params: ep.params,
                            headers: {
                                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'tiktok-download-video1.p.rapidapi.com'
                            },
                            timeout: 15000
                        };

                        const response = await axios.request(options);
                        console.log('📥 Réponse user/posts:', JSON.stringify(response.data, null, 2));
                        apiData = response.data;
                        endpoint = ep.url;
                        console.log(`✓ Endpoint fonctionnel: ${endpoint}`);
                        break;
                    } catch (error) {
                        lastError = error;
                        console.log(`✗ Endpoint échoué: ${ep.url} - ${error.response?.status || error.message}`);
                        continue;
                    }
                }

                if (!apiData) {
                    throw new Error(`Aucun endpoint API disponible. L'API que vous utilisez ne supporte peut-être pas l'extraction par utilisateur. Dernière erreur: ${lastError.message}`);
                }
                
                // Adapter la réponse selon le format de l'API
                const videos = apiData.data?.videos || apiData.videos || apiData.data?.aweme_list || [];
                console.log(`📊 Nombre de vidéos extraites: ${videos.length}`);
                if (videos.length > 0) {
                    console.log('📹 Exemple de vidéo:', JSON.stringify(videos[0], null, 2));
                }
                
                const formattedVideos = videos.map(video => {
                    const videoId = video.aweme_id || video.video_id || video.id;
                    const author = video.author?.unique_id || video.author?.uniqueId || cleanUsername;
                    
                    return {
                        videoId: videoId,
                        // Essayer plusieurs formats d'URL
                        url: video.share_url || 
                             video.video_url || 
                             video.url ||
                             `https://www.tiktok.com/@${author}/video/${videoId}`,
                        title: video.desc || video.title || 'Sans titre',
                        description: video.desc || video.description || '',
                        thumbnail: video.video?.cover || video.cover || video.thumbnail || video.video?.origin_cover,
                        downloadUrl: video.video?.play || video.play || video.download_url || video.video?.download_addr,
                        duration: video.video?.duration || video.duration,
                        likes: video.statistics?.digg_count || video.digg_count || video.likes || 0,
                        comments: video.statistics?.comment_count || video.comment_count || video.comments || 0,
                        shares: video.statistics?.share_count || video.share_count || video.shares || 0,
                        views: video.statistics?.play_count || video.play_count || video.views || 0,
                        createTime: video.create_time || video.createTime
                    };
                });

                console.log(`✅ Envoi de ${formattedVideos.length} vidéos formatées`);
                if (formattedVideos.length > 0) {
                    console.log('📤 Exemple vidéo formatée:', JSON.stringify(formattedVideos[0], null, 2));
                }
                
                res.json({
                    success: true,
                    username: cleanUsername,
                    count: formattedVideos.length,
                    videos: formattedVideos,
                    creator: userInfo ? {
                        id: userInfo.user_id || userInfo.uid || userInfo.id,
                        uniqueId: userInfo.unique_id || userInfo.uniqueId || cleanUsername,
                        nickname: userInfo.nickname || userInfo.nick_name,
                        avatar: userInfo.avatar_thumb || userInfo.avatar || userInfo.avatarThumb,
                        signature: userInfo.signature || userInfo.bio,
                        verified: userInfo.custom_verify || userInfo.verified || false,
                        followers: userInfo.follower_count || userInfo.followerCount || userInfo.followers || 0,
                        following: userInfo.following_count || userInfo.followingCount || userInfo.following || 0,
                        totalVideos: userInfo.aweme_count || userInfo.videoCount || userInfo.video_count || formattedVideos.length
                    } : null
                });

            } catch (apiError) {
                console.error('Erreur RapidAPI User:', apiError.message);
                
                // Message d'erreur plus informatif
                let errorMessage = 'Erreur lors de la récupération des vidéos';
                
                if (apiError.response?.status === 404) {
                    errorMessage = 'L\'API RapidAPI que vous utilisez ne supporte pas l\'extraction par utilisateur. Essayez l\'extraction par URL unique ou changez d\'API RapidAPI.';
                } else if (apiError.response?.status === 403) {
                    errorMessage = 'Clé API invalide ou quota dépassé. Vérifiez votre abonnement RapidAPI.';
                } else if (apiError.response?.status === 429) {
                    errorMessage = 'Limite de requêtes atteinte. Attendez quelques minutes ou upgradez votre plan RapidAPI.';
                } else if (apiError.message.includes('Aucun endpoint')) {
                    errorMessage = apiError.message;
                }
                
                res.status(500).json({
                    success: false,
                    error: errorMessage,
                    details: apiError.response?.data || apiError.message,
                    suggestion: 'Utilisez l\'extraction par URL unique qui fonctionne avec toutes les APIs TikTok'
                });
            }
        } else {
            // Mode démo
            // Utiliser des data URIs pour éviter les problèmes avec via.placeholder
            const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect width="300" height="400" fill="%231e1e1e"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23fe2c55"%3ETikTok Vidéo%3C/text%3E%3C/svg%3E';
            const avatarPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Ccircle cx="48" cy="48" r="48" fill="%23fe2c55"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="white"%3E' + (cleanUsername[0] || 'U').toUpperCase() + '%3C/text%3E%3C/svg%3E';
            
            const demoVideos = Array.from({ length: 5 }, (_, i) => ({
                videoId: `demo_${Date.now()}_${i}`,
                url: `https://www.tiktok.com/@${cleanUsername}/video/demo${i}`,
                title: `Vidéo démo ${i + 1}`,
                description: 'Configurez RAPIDAPI_KEY pour voir les vraies vidéos',
                thumbnail: placeholderImage,
                downloadUrl: null,
                duration: '00:30',
                likes: Math.floor(Math.random() * 10000),
                comments: Math.floor(Math.random() * 500),
                shares: Math.floor(Math.random() * 200),
                views: Math.floor(Math.random() * 50000)
            }));

            res.json({
                success: true,
                username: cleanUsername,
                count: demoVideos.length,
                videos: demoVideos,
                creator: {
                    id: 'demo_id',
                    uniqueId: cleanUsername,
                    nickname: `Créateur Démo`,
                    avatar: avatarPlaceholder,
                    signature: 'Compte de démonstration - Configurez RapidAPI pour voir le vrai profil',
                    verified: false,
                    followers: Math.floor(Math.random() * 100000),
                    following: Math.floor(Math.random() * 1000),
                    totalVideos: demoVideos.length
                },
                demo: true
            });
        }

    } catch (error) {
        console.error('Erreur extraction user:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'extraction: ' + error.message
        });
    }
});

// API pour extraire les informations d'une vidéo TikTok
app.post('/api/extract', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || (!url.includes('tiktok.com') && !url.includes('vm.tiktok'))) {
            return res.status(400).json({
                success: false,
                error: 'URL TikTok invalide'
            });
        }

        // Ne pas extraire l'ID maintenant - laisser l'API gérer les redirections
        // L'ID sera extrait de la réponse API ou de l'URL finale

        // Utilisation de RapidAPI pour l'extraction réelle
        let videoData;
        
        if (process.env.RAPIDAPI_KEY) {
            // Appel à RapidAPI
            try {
                // Pour l'API TikTok video no watermark2, on utilise GET avec paramètres
                const options = {
                    method: 'GET',
                    url: `https://${process.env.RAPIDAPI_HOST || 'tiktok-video-no-watermark2.p.rapidapi.com'}/`,
                    params: { 
                        url: url,
                        hd: '1'
                    },
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'tiktok-video-no-watermark2.p.rapidapi.com'
                    },
                    timeout: 15000
                };

                console.log('📤 Requête extraction vidéo:', options.url);
                console.log('📤 Params:', options.params);
                const response = await axios.request(options);
                const apiData = response.data;
                console.log('📥 Réponse extraction vidéo:', JSON.stringify(apiData, null, 2));
                
                // Extraire l'ID après résolution par l'API
                const resolvedVideoId = apiData.data?.id || 
                                       apiData.data?.aweme_id ||
                                       apiData.id || 
                                       extractVideoId(apiData.data?.video_url || url) || 
                                       'unknown';
                
                // Adapter la réponse de l'API au format attendu
                videoData = {
                    success: true,
                    videoId: resolvedVideoId,
                    url: apiData.data?.video_url || url,
                    title: apiData.data?.title || apiData.data?.desc || apiData.title || 'Vidéo TikTok',
                    author: apiData.data?.author?.nickname || apiData.data?.author?.unique_id || apiData.author || '@utilisateur',
                    description: apiData.data?.desc || apiData.description || 'Description non disponible',
                    downloadUrl: apiData.data?.play || apiData.data?.download_url || apiData.videoUrl || apiData.download_url,
                    thumbnail: apiData.data?.cover || apiData.data?.origin_cover || apiData.thumbnail || apiData.cover,
                    duration: apiData.data?.duration || apiData.duration || 'N/A',
                    likes: apiData.data?.digg_count || apiData.data?.statistics?.digg_count || apiData.likes || '0',
                    comments: apiData.data?.comment_count || apiData.data?.statistics?.comment_count || apiData.comments || '0',
                    shares: apiData.data?.share_count || apiData.data?.statistics?.share_count || apiData.shares || '0',
                    views: apiData.data?.play_count || apiData.data?.statistics?.play_count || apiData.views || '0',
                    timestamp: new Date().toISOString()
                };
            } catch (apiError) {
                console.error('Erreur RapidAPI:', apiError.message);
                // Fallback vers données simulées si l'API échoue
                const fallbackVideoId = extractVideoId(url) || 'temp_' + Date.now();
                const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect width="300" height="400" fill="%231e1e1e"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23fe2c55"%3ETikTok%3C/text%3E%3C/svg%3E';
                videoData = {
                    success: true,
                    videoId: fallbackVideoId,
                    url: url,
                    title: 'Vidéo TikTok',
                    author: '@utilisateur',
                    description: 'Description de la vidéo (mode démo - erreur API)',
                    downloadUrl: null,
                    thumbnail: placeholderImage,
                    duration: '00:30',
                    likes: '1.2K',
                    comments: '45',
                    shares: '89',
                    timestamp: new Date().toISOString(),
                    apiError: apiError.message
                };
            }
        } else {
            // Mode démo sans clé API
            const demoVideoId = extractVideoId(url) || 'demo_' + Date.now();
            const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect width="300" height="400" fill="%231e1e1e"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23fe2c55"%3ETikTok%3C/text%3E%3C/svg%3E';
            videoData = {
                success: true,
                videoId: demoVideoId,
                url: url,
                title: 'Vidéo TikTok (Mode Démo)',
                author: '@utilisateur',
                description: 'Configurez RAPIDAPI_KEY dans .env pour utiliser l\'API réelle',
                downloadUrl: null,
                thumbnail: placeholderImage,
                duration: '00:30',
                likes: '1.2K',
                comments: '45',
                shares: '89',
                timestamp: new Date().toISOString()
            };
        }

        // Ajouter à l'historique
        extractionHistory.unshift({
            url: url,
            videoId: videoData.videoId,
            timestamp: new Date().toISOString(),
            success: true
        });

        // Limiter l'historique à 50 entrées
        if (extractionHistory.length > 50) {
            extractionHistory = extractionHistory.slice(0, 50);
        }

        res.json(videoData);

    } catch (error) {
        console.error('Erreur lors de l\'extraction:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'extraction de la vidéo: ' + error.message
        });
    }
});

// API pour récupérer l'historique
app.get('/api/history', (req, res) => {
    res.json({
        success: true,
        history: extractionHistory
    });
});

// Fonction pour extraire l'ID de la vidéo de l'URL TikTok
// Note: Cette fonction fonctionne uniquement pour les URLs standard
// Les liens courts (vm.tiktok.com) doivent être résolus par l'API
function extractVideoId(url) {
    try {
        if (!url) return null;
        
        // Format standard uniquement: https://www.tiktok.com/@username/video/1234567890123456789
        const standardMatch = url.match(/\/video\/(\d+)/);
        if (standardMatch && standardMatch[1]) {
            return standardMatch[1];
        }

        // Pour les autres formats, retourner null
        // L'API RapidAPI gérera la résolution des liens courts
        return null;
    } catch (error) {
        console.error('Erreur lors de l\'extraction de l\'ID:', error);
        return null;
    }
}

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📱 Bot d'extraction TikTok prêt!`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
    console.error('Erreur non gérée:', error);
});
