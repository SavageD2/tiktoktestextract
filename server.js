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
app.use(express.static(path.join(__dirname)));

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

// API pour extraire les informations d'une vidéo TikTok
app.post('/api/extract', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !url.includes('tiktok.com')) {
            return res.status(400).json({
                success: false,
                error: 'URL TikTok invalide'
            });
        }

        // Extraire l'ID de la vidéo de l'URL
        const videoId = extractVideoId(url);

        if (!videoId) {
            return res.status(400).json({
                success: false,
                error: 'Impossible d\'extraire l\'ID de la vidéo'
            });
        }

        // Utilisation de RapidAPI pour l'extraction réelle
        let videoData;
        
        if (process.env.RAPIDAPI_KEY) {
            // Appel à RapidAPI
            try {
                const options = {
                    method: 'GET',
                    url: 'https://tiktok-download-video1.p.rapidapi.com/getVideo',
                    params: { url: url },
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'tiktok-download-video1.p.rapidapi.com'
                    },
                    timeout: 10000
                };

                const response = await axios.request(options);
                const apiData = response.data;
                
                // Adapter la réponse de l'API au format attendu
                videoData = {
                    success: true,
                    videoId: videoId,
                    url: url,
                    title: apiData.data?.title || apiData.title || 'Vidéo TikTok',
                    author: apiData.data?.author?.nickname || apiData.author || '@utilisateur',
                    description: apiData.data?.desc || apiData.description || 'Description non disponible',
                    downloadUrl: apiData.data?.play || apiData.videoUrl || apiData.download_url,
                    thumbnail: apiData.data?.cover || apiData.thumbnail || apiData.cover,
                    duration: apiData.data?.duration || apiData.duration || 'N/A',
                    likes: apiData.data?.digg_count || apiData.likes || '0',
                    comments: apiData.data?.comment_count || apiData.comments || '0',
                    shares: apiData.data?.share_count || apiData.shares || '0',
                    timestamp: new Date().toISOString()
                };
            } catch (apiError) {
                console.error('Erreur RapidAPI:', apiError.message);
                // Fallback vers données simulées si l'API échoue
                videoData = {
                    success: true,
                    videoId: videoId,
                    url: url,
                    title: 'Vidéo TikTok',
                    author: '@utilisateur',
                    description: 'Description de la vidéo (mode démo - erreur API)',
                    downloadUrl: null,
                    thumbnail: 'https://via.placeholder.com/300x400?text=TikTok+Video',
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
            videoData = {
                success: true,
                videoId: videoId,
                url: url,
                title: 'Vidéo TikTok (Mode Démo)',
                author: '@utilisateur',
                description: 'Configurez RAPIDAPI_KEY dans .env pour utiliser l\'API réelle',
                downloadUrl: null,
                thumbnail: 'https://via.placeholder.com/300x400?text=TikTok+Video',
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
            videoId: videoId,
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
function extractVideoId(url) {
    try {
        // Formats possibles:
        // https://www.tiktok.com/@username/video/1234567890123456789
        // https://vm.tiktok.com/ABC123/
        // https://www.tiktok.com/t/ABC123/

        const patterns = [
            /\/video\/(\d+)/,           // Format standard
            /vm\.tiktok\.com\/([A-Za-z0-9]+)/,  // Format court
            /\/t\/([A-Za-z0-9]+)/       // Format t/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

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
