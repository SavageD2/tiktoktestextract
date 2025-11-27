// Configuration de l'API
const API_BASE_URL = window.location.origin;

// Éléments DOM
const urlModeBtn = document.getElementById('urlModeBtn');
const userModeBtn = document.getElementById('userModeBtn');
const urlModeDiv = document.getElementById('urlMode');
const userModeDiv = document.getElementById('userMode');
const tiktokUrlInput = document.getElementById('tiktokUrl');
const tiktokUsernameInput = document.getElementById('tiktokUsername');
const extractBtn = document.getElementById('extractBtn');
const extractUserBtn = document.getElementById('extractUserBtn');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const userResultsDiv = document.getElementById('userResults');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const videoInfoDiv = document.getElementById('videoInfo');
const videoGridDiv = document.getElementById('videoGrid');
const userTitleDiv = document.getElementById('userTitle');
const videoCountDiv = document.getElementById('videoCount');
const historyDiv = document.getElementById('history');

// État de l'application
let isExtracting = false;
let currentMode = 'url'; // 'url' ou 'user'

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    setupEventListeners();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Mode switchers
    urlModeBtn.addEventListener('click', () => switchMode('url'));
    userModeBtn.addEventListener('click', () => switchMode('user'));
    
    // URL mode
    extractBtn.addEventListener('click', handleExtract);
    tiktokUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleExtract();
    });
    tiktokUrlInput.addEventListener('input', () => hideError());
    
    // User mode
    extractUserBtn.addEventListener('click', handleUserExtract);
    tiktokUsernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserExtract();
    });
    tiktokUsernameInput.addEventListener('input', () => hideError());
}

// Changer de mode
function switchMode(mode) {
    currentMode = mode;
    hideError();
    hideResult();
    hideUserResults();
    
    if (mode === 'url') {
        urlModeBtn.classList.add('active');
        userModeBtn.classList.remove('active');
        urlModeDiv.classList.remove('hidden');
        userModeDiv.classList.add('hidden');
    } else {
        userModeBtn.classList.add('active');
        urlModeBtn.classList.remove('active');
        userModeDiv.classList.remove('hidden');
        urlModeDiv.classList.add('hidden');
    }
}

// Gérer l'extraction par username
async function handleUserExtract() {
    const username = tiktokUsernameInput.value.trim();

    if (!username) {
        showError('Veuillez entrer un nom d\'utilisateur');
        return;
    }

    if (isExtracting) return;

    try {
        isExtracting = true;
        showLoading();
        hideError();
        hideUserResults();

        const response = await fetch(`${API_BASE_URL}/api/extract-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            // Message d'erreur détaillé avec suggestion
            let errorMsg = data.error || 'Erreur lors de l\'extraction';
            if (data.suggestion) {
                errorMsg += '\n\n💡 ' + data.suggestion;
            }
            throw new Error(errorMsg);
        }

        displayUserVideos(data);

    } catch (error) {
        console.error('Erreur:', error);
        
        // Afficher un message d'erreur formaté
        let displayError = error.message;
        if (error.message.includes('ne supporte pas')) {
            displayError = '⚠️ Fonctionnalité non disponible\n\n' + error.message;
        }
        
        showError(displayError);
    } finally {
        isExtracting = false;
        hideLoading();
    }
}

// Afficher les vidéos d'un créateur
function displayUserVideos(data) {
    // Afficher les infos du créateur si disponibles
    if (data.creator) {
        const creator = data.creator;
        userTitleDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                ${creator.avatar ? `<img src="${creator.avatar}" alt="Avatar" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid #fe2c55;">` : ''}
                <div>
                    <div style="font-size: 20px; font-weight: bold;">@${creator.uniqueId}</div>
                    ${creator.nickname ? `<div style="font-size: 14px; color: #999;">${escapeHtml(creator.nickname)} ${creator.verified ? '✓' : ''}</div>` : ''}
                    ${creator.followers ? `<div style="font-size: 12px; color: #25f4ee; margin-top: 4px;">${formatNumber(creator.followers)} abonnés · ${formatNumber(creator.totalVideos)} vidéos</div>` : ''}
                </div>
            </div>
        `;
    } else {
        userTitleDiv.textContent = `@${data.username}`;
    }
    
    videoCountDiv.textContent = `${data.count} vidéo${data.count > 1 ? 's' : ''} trouvée${data.count > 1 ? 's' : ''}`;
    
    if (data.count === 0) {
        videoGridDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999; grid-column: 1/-1;">
                <p style="font-size: 18px; margin-bottom: 10px;">🔍 Aucune vidéo trouvée</p>
                <p style="font-size: 14px;">Vérifiez que le nom d'utilisateur est correct ou que le compte est public.</p>
                ${data.creator ? '<p style="font-size: 13px; color: #666; margin-top: 10px;">Le compte existe mais aucune vidéo publique n\'est disponible.</p>' : ''}
                ${data.demo ? '<p style="margin-top: 15px; color: #fe2c55;">⚠️ Mode démo - Configurez RapidAPI pour voir les vraies vidéos</p>' : ''}
            </div>
        `;
    } else {
        videoGridDiv.innerHTML = data.videos.map(video => `
            <div class="video-card" onclick="window.open('${video.url}', '_blank')">
                <img src="${video.thumbnail || 'https://via.placeholder.com/300x400?text=TikTok'}" 
                     alt="${escapeHtml(video.title)}" 
                     class="video-thumbnail"
                     onerror="this.src='https://via.placeholder.com/300x400?text=TikTok'">
                <div class="video-info-card">
                    <div class="video-title">${escapeHtml(video.title)}</div>
                    <div class="video-stats">
                        <span class="video-stat">❤️ ${formatNumber(video.likes)}</span>
                        <span class="video-stat">💬 ${formatNumber(video.comments)}</span>
                        <span class="video-stat">🔄 ${formatNumber(video.shares)}</span>
                    </div>
                    ${video.downloadUrl ? `
                        <button class="video-download-btn" onclick="event.stopPropagation(); window.open('${video.downloadUrl}', '_blank')">
                            📥 Télécharger
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    hideResult(); // Masquer le résultat de vidéo unique
    showUserResults();
}

// Formater les nombres
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Gérer l'extraction d'URL unique
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

function showUserResults() {
    userResultsDiv.classList.remove('hidden');
}

function hideUserResults() {
    userResultsDiv.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}
