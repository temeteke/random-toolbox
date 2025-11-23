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
    console.log('tabManager initialized');

    const toolData = {
        'number': { icon: '🔢', name: '数字生成' },
        'list': { icon: '📋', name: 'リスト選択' },
        'decision': { icon: '🎯', name: '決定ツール' },
        'shuffle': { icon: '🔀', name: 'シャッフル' },
        'roulette': { icon: '🎰', name: 'ルーレット' },
        'dice': { icon: '🎲', name: 'サイコロ' },
        'card': { icon: '🃏', name: 'カード' },
        'coin': { icon: '🪙', name: 'コイントス' },
        'bingo': { icon: '🎬', name: 'ビンゴ' },
        'lottery': { icon: '🎊', name: '抽選ボックス' },
        'color': { icon: '🎨', name: 'カラー' },
        'gradient': { icon: '🌈', name: 'グラデーション' },
        'lorem': { icon: '📝', name: 'ダミーテキスト' },
        'password': { icon: '🔐', name: 'パスワード' },
        'weighted': { icon: '⚖️', name: '重み付き抽選' },
        'task': { icon: '✏️', name: 'タスクピッカー' },
        'menu': { icon: '🍔', name: 'メニュー提案' },
        'name': { icon: '📛', name: '名前生成' },
        'date': { icon: '📅', name: 'ランダム日付' },
        'timer': { icon: '⏱️', name: 'ランダムタイマー' },
        'coordinate': { icon: '🗺️', name: 'ランダム座標' }
    };

    return {
        activeTab: 'number',
        showMenu: false,

        init() {
            // URLから初期タブを復元
            const urlTab = window.urlStateManager.getParam('tab');
            if (urlTab) {
                this.activeTab = urlTab;
            }

            // タブ変更を監視してURLに保存
            this.$watch('activeTab', (value) => {
                window.urlStateManager.setParam('tab', value);
            });
        },

        switchTab(tabName) {
            console.log('Switching to tab:', tabName);
            this.activeTab = tabName;
            this.showMenu = false;  // タブ切り替え時にメニューを閉じる
        },

        toggleMenu() {
            this.showMenu = !this.showMenu;
        },

        closeMenu() {
            this.showMenu = false;
        },

        getToolIcon() {
            return toolData[this.activeTab]?.icon || '🎲';
        },

        getToolName() {
            return toolData[this.activeTab]?.name || 'ツール';
        }
    };
};

// 設定パネルコンポーネント
window.settingsPanel = function() {
    return {
        showSettings: false,
        currentTheme: ThemeManager.getCurrentTheme(),
        speechEnabled: SpeechManager.isEnabled(),

        changeTheme(theme) {
            ThemeManager.setTheme(theme);
            this.currentTheme = theme;
        },

        toggleSpeech() {
            this.speechEnabled = SpeechManager.toggle();
        },

        exportData() {
            try {
                DataManager.exportAllData();
                alert('データをエクスポートしました！');
            } catch (error) {
                alert('エクスポートに失敗しました: ' + error.message);
            }
        },

        exportCSV() {
            try {
                DataManager.exportAsCSV();
                alert('CSVファイルをエクスポートしました！');
            } catch (error) {
                alert('エクスポートに失敗しました: ' + error.message);
            }
        },

        importData() {
            const input = document.getElementById('importFileInput');
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        await DataManager.importData(file);
                        alert('データをインポートしました！ページをリロードします。');
                        location.reload();
                    } catch (error) {
                        alert('インポートに失敗しました: ' + error.message);
                    }
                }
            };
            input.click();
        },

        clearAllData() {
            if (DataManager.clearAllData()) {
                alert('全てのデータを削除しました。ページをリロードします。');
                location.reload();
            }
        }
    };
};

// コンポーネントが正しく読み込まれているか確認
console.log('Components loaded:', {
    HistoryManager: typeof window.HistoryManager,
    numberGenerator: typeof window.numberGenerator,
    listSelector: typeof window.listSelector,
    roulette: typeof window.roulette,
    diceRoller: typeof window.diceRoller,
    cardDraw: typeof window.cardDraw,
    colorPicker: typeof window.colorPicker,
    dateRandomizer: typeof window.dateRandomizer,
    passwordGenerator: typeof window.passwordGenerator,
    decisionTool: typeof window.decisionTool,
    shuffler: typeof window.shuffler,
    lotteryBox: typeof window.lotteryBox,
    tabManager: typeof window.tabManager
});
