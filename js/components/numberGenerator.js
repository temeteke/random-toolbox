/**
 * 数字生成ツールのAlpineコンポーネント
 */
function numberGenerator() {
    const historyManager = new HistoryManager('randomHistory');
    return {
        min: 1,
        max: 100,
        result: null,
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            // 初期化時に履歴を読み込む
            this.history = this.historyManager.getRecent(10);
        },

        generate() {
            const min = parseInt(this.min);
            const max = parseInt(this.max);

            // バリデーション
            if (isNaN(min) || isNaN(max)) {
                alert('有効な数値を入力してください');
                return;
            }

            if (min >= max) {
                alert('最小値は最大値より小さくしてください');
                return;
            }

            // 乱数生成
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            this.result = randomNum;

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            this.historyManager.add({
                number: randomNum,
                range: `${min}-${max}`,
                time: time
            });
            this.history = this.historyManager.getRecent(10);
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        }
    };
}

// グローバルに登録
window.numberGenerator = numberGenerator;
