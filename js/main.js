/**
 * Random Toolbox - メインエントリーポイント
 * Alpine.jsを使用したリファクタリング版
 */

// PWA: Service Worker登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// PWA: インストールプロンプト
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');

    if (installPrompt) {
        installPrompt.style.display = 'block';
    }

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (installPrompt) installPrompt.style.display = 'none';
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWAインストールが承認されました');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }
});

// タブ管理用のAlpineコンポーネント
window.tabManager = function() {
    return {
        activeTab: 'number',
        switchTab(tabName) {
            this.activeTab = tabName;
        }
    };
};
