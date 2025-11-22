import { HistoryManager } from '../utils/HistoryManager.js';

/**
 * 決定ツールのAlpineコンポーネント
 */
function decisionTool() {
    const historyManager = new HistoryManager('decisionHistory');
    return {
        options: 'はい\nいいえ',
        decision: '',
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            // 保存された選択肢を復元
            const savedOptions = localStorage.getItem('savedDecisionOptions');
            if (savedOptions) {
                this.options = savedOptions;
            }

            this.history = this.historyManager.getRecent(10);
        },

        makeDecision() {
            const text = this.options.trim();

            if (!text) {
                alert('選択肢を入力してください');
                return;
            }

            const optionsList = text.split('\n').filter(opt => opt.trim() !== '');

            if (optionsList.length < 2 || optionsList.length > 5) {
                alert('選択肢は2〜5個の範囲で入力してください');
                return;
            }

            const randomIndex = Math.floor(Math.random() * optionsList.length);
            this.decision = optionsList[randomIndex].trim();

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            this.historyManager.add({
                decision: this.decision,
                options: optionsList.join('/'),
                time: time
            });
            this.history = this.historyManager.getRecent(10);
        },

        saveOptions() {
            localStorage.setItem('savedDecisionOptions', this.options);
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        }
    };
}

window.decisionTool = decisionTool;
