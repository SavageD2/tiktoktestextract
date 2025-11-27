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

        // Note: Pour une vraie implémentation, vous devriez utiliser une API TikTok officielle
        // ou un service tiers comme RapidAPI TikTok Downloader
        // Exemple avec une API tierce (nécessite une clé API):
        
        /*
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
        const videoData = response.data;
        */

        // Pour la démo, retourner des données simulées
        const videoData = {
            success: true,
            videoId: videoId,
            url: url,
            title: 'Vidéo TikTok',
            author: '@utilisateur',
            description: 'Description de la vidéo',
            downloadUrl: `https://example.com/download/${videoId}`,
            thumbnail: 'https://via.placeholder.com/300x400?text=TikTok+Video',
            duration: '00:30',
            likes: '1.2K',
            comments: '45',
            shares: '89',
            timestamp: new Date().toISOString()
        };

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
