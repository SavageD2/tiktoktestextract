// Configuration de l'API
const API_BASE_URL = 'http://localhost:3000';

// Éléments DOM
const tiktokUrlInput = document.getElementById('tiktokUrl');
const extractBtn = document.getElementById('extractBtn');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const videoInfoDiv = document.getElementById('videoInfo');
const historyDiv = document.getElementById('history');

// État de l'application
let isExtracting = false;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    setupEventListeners();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    extractBtn.addEventListener('click', handleExtract);
    
    tiktokUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleExtract();
        }
    });

    tiktokUrlInput.addEventListener('input', () => {
        hideError();
    });
}

// Gérer l'extraction
async function handleExtract() {
    const url = tiktokUrlInput.value.trim();

    if (!url) {
        showError('Veuillez entrer une URL TikTok');
        return;
    }

    if (!url.includes('tiktok.com')) {
        showError('URL TikTok invalide. Utilisez un lien tiktok.com');
        return;
    }

    if (isExtracting) return;

    try {
        isExtracting = true;
        showLoading();
        hideError();
        hideResult();

        const response = await fetch(`${API_BASE_URL}/api/extract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erreur lors de l\'extraction');
        }

        displayResult(data);
        loadHistory();
        tiktokUrlInput.value = '';

    } catch (error) {
        console.error('Erreur:', error);
        showError(error.message || 'Une erreur est survenue lors de l\'extraction');
    } finally {
        isExtracting = false;
        hideLoading();
    }
}

// Afficher le résultat
function displayResult(data) {
    videoInfoDiv.innerHTML = `
        <div class="video-details">
            <h3>📹 Informations de la vidéo</h3>
            
            ${data.thumbnail ? `
                <div style="margin: 20px 0;">
                    <img src="${data.thumbnail}" alt="Miniature" style="max-width: 100%; border-radius: 10px;">
                </div>
            ` : ''}
            
            <p><strong>Titre:</strong> ${escapeHtml(data.title || 'N/A')}</p>
            <p><strong>Auteur:</strong> ${escapeHtml(data.author || 'N/A')}</p>
            <p><strong>Description:</strong> ${escapeHtml(data.description || 'N/A')}</p>
            
            ${data.duration ? `<p><strong>Durée:</strong> ${data.duration}</p>` : ''}
            
            <div style="margin-top: 15px; display: flex; gap: 20px; flex-wrap: wrap;">
                ${data.likes ? `<span>❤️ ${data.likes} likes</span>` : ''}
                ${data.comments ? `<span>💬 ${data.comments} commentaires</span>` : ''}
                ${data.shares ? `<span>🔄 ${data.shares} partages</span>` : ''}
            </div>

            <div style="margin-top: 20px;">
                <p><strong>URL originale:</strong></p>
                <p style="word-break: break-all; font-size: 14px; color: #666;">${escapeHtml(data.url)}</p>
            </div>

            ${data.downloadUrl ? `
                <a href="${data.downloadUrl}" target="_blank" rel="noopener noreferrer">
                    📥 Télécharger la vidéo
                </a>
            ` : ''}

            <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 12px;">
                <p><strong>Note:</strong> Cette version utilise des données simulées à des fins de démonstration. 
                Pour une implémentation réelle, vous devez intégrer une API TikTok officielle ou un service tiers comme RapidAPI.</p>
            </div>
        </div>
    `;

    showResult();
}

// Charger l'historique
async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/history`);
        const data = await response.json();

        if (data.success && data.history && data.history.length > 0) {
            displayHistory(data.history);
        } else {
            historyDiv.innerHTML = '<p class="empty-history">Aucune extraction pour le moment</p>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        historyDiv.innerHTML = '<p class="empty-history">Erreur lors du chargement de l\'historique</p>';
    }
}

// Afficher l'historique
function displayHistory(history) {
    historyDiv.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-info">
                <div class="history-item-url" title="${escapeHtml(item.url)}">
                    ${escapeHtml(item.url)}
                </div>
                <div class="history-item-time">
                    ${formatTimestamp(item.timestamp)}
                </div>
            </div>
            <div style="color: ${item.success ? '#28a745' : '#dc3545'};">
                ${item.success ? '✓' : '✗'}
            </div>
        </div>
    `).join('');
}

// Formater le timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
}

// Échapper le HTML pour éviter les injections XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fonctions d'affichage
function showLoading() {
    loadingDiv.classList.remove('hidden');
    extractBtn.disabled = true;
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
    extractBtn.disabled = false;
}

function showResult() {
    resultDiv.classList.remove('hidden');
}

function hideResult() {
    resultDiv.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}
