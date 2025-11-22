/**
 * Random Toolbox - メインエントリーポイント
 * Alpine.jsを使用したリファクタリング版
 */

console.log('[main.js] スクリプト開始');

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

console.log('[main.js] インポート完了');

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
console.log('[main.js] グローバル登録開始');
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

console.log('[main.js] グローバル登録完了');
console.log('[main.js] window.numberGenerator =', typeof window.numberGenerator);
console.log('[main.js] window.tabManager =', typeof window.tabManager);

// すべてのコンポーネントが登録されたことをフラグで通知
window.alpineComponentsLoaded = true;
console.log('[main.js] フラグ設定: window.alpineComponentsLoaded = true');

// すべてのコンポーネントが登録されたことをイベントで通知
console.log('[main.js] alpine:components-loadedイベント発火');
document.dispatchEvent(new CustomEvent('alpine:components-loaded'));
