import { HistoryManager } from '../utils/HistoryManager.js';

/**
 * サイコロツールのAlpineコンポーネント
 */
export function diceRoller() {
    return {
        count: 1,
        sides: 6,
        values: [],
        total: 0,
        historyManager: new HistoryManager('diceHistory'),
        animating: false,

        roll() {
            const count = parseInt(this.count);
            const sides = parseInt(this.sides);

            if (count < 1 || count > 10) {
                alert('サイコロの数は1〜10の範囲で指定してください');
                return;
            }

            this.values = [];
            for (let i = 0; i < count; i++) {
                this.values.push(Math.floor(Math.random() * sides) + 1);
            }

            this.total = this.values.reduce((sum, val) => sum + val, 0);

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            this.historyManager.add({
                result: `[${this.values.join(', ')}] = ${this.total}`,
                config: `${count}D${sides}`,
                time: time
            });
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
            }
        },

        get history() {
            return this.historyManager.getRecent(10);
        },

        get displayValues() {
            return this.values.length > 0 ? this.values.join(' + ') : '?';
        }
    };
}
