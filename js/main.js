/**
 * Random Toolbox - メインエントリーポイント
 * Alpine.jsを使用したリファクタリング版
 */

import { numberGenerator } from './components/numberGenerator.js';
import { listSelector } from './components/listSelector.js';
import { roulette } from './components/roulette.js';
import { diceRoller } from './components/diceRoller.js';
import { cardDraw } from './components/cardDraw.js';
import { colorPicker } from './components/colorPicker.js';
import { dateRandomizer } from './components/dateRandomizer.js';
import { passwordGenerator } from './components/passwordGenerator.js';
import { decisionTool } from './components/decisionTool.js';
import { shuffler } from './components/shuffler.js';
import { lotteryBox } from './components/lotteryBox.js';

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

// Alpine.jsコンポーネントをグローバルに登録
window.numberGenerator = numberGenerator;
window.listSelector = listSelector;
window.roulette = roulette;
window.diceRoller = diceRoller;
window.cardDraw = cardDraw;
window.colorPicker = colorPicker;
window.dateRandomizer = dateRandomizer;
window.passwordGenerator = passwordGenerator;
window.decisionTool = decisionTool;
window.shuffler = shuffler;
window.lotteryBox = lotteryBox;

// タブ管理用のAlpineコンポーネント
window.tabManager = function() {
    return {
        activeTab: 'number',
        switchTab(tabName) {
            this.activeTab = tabName;
        }
    };
};

// Alpine.jsを動的に読み込む
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js';
document.body.appendChild(script);
