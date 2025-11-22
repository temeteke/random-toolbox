
/**
 * サイコロツールのAlpineコンポーネント
 */
function diceRoller() {
    const historyManager = new HistoryManager('diceHistory');
    return {
        count: 1,
        sides: 6,
        values: [],
        total: 0,
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            this.history = this.historyManager.getRecent(10);
        },

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
            this.history = this.historyManager.getRecent(10);
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        },

        get displayValues() {
            return this.values.length > 0 ? this.values.join(' + ') : '?';
        }
    };
}

window.diceRoller = diceRoller;
