
/**
 * 抽選ボックスツールのAlpineコンポーネント
 */
function lotteryBox() {
    const historyManager = new HistoryManager('lotteryHistory');
    return {
        items: '',
        pool: [],
        drawnItems: [],
        currentWinner: '',
        isStarted: false,
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            // 保存された項目を復元
            const savedItems = localStorage.getItem('savedLotteryItems');
            if (savedItems) {
                this.items = savedItems;
            }

            this.history = this.historyManager.getRecent(10);
        },

        start() {
            const text = this.items.trim();

            if (!text) {
                alert('抽選項目を入力してください');
                return;
            }

            const itemsList = text.split('\n').filter(item => item.trim() !== '');

            if (itemsList.length === 0) {
                alert('有効な項目を入力してください');
                return;
            }

            this.pool = [...itemsList];
            this.drawnItems = [];
            this.currentWinner = '';
            this.isStarted = true;

            alert(`抽選を開始します！全${this.pool.length}項目`);
        },

        draw() {
            if (this.pool.length === 0) {
                alert('すべての項目が引かれました！');
                return;
            }

            const randomIndex = Math.floor(Math.random() * this.pool.length);
            const winner = this.pool[randomIndex];

            this.pool.splice(randomIndex, 1);
            this.drawnItems.push(winner);
            this.currentWinner = winner;

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            this.historyManager.add({
                winner: winner,
                order: `${this.drawnItems.length}番目`,
                time: time
            });
            this.history = this.historyManager.getRecent(10);
        },

        reset() {
            this.pool = [];
            this.drawnItems = [];
            this.currentWinner = '';
            this.isStarted = false;
        },

        saveItems() {
            localStorage.setItem('savedLotteryItems', this.items);
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        },

        get remaining() {
            return this.pool.length;
        },

        get isComplete() {
            return this.isStarted && this.pool.length === 0;
        }
    };
}

window.lotteryBox = lotteryBox;
