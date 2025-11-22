import { HistoryManager } from '../utils/HistoryManager.js';

/**
 * シャッフラーツールのAlpineコンポーネント
 */
export function shuffler() {
    const historyManager = new HistoryManager('shuffleHistory');
    return {
        items: '',
        groupCount: 0,
        shuffledResult: null,
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            // 保存された項目を復元
            const savedItems = localStorage.getItem('savedShuffleItems');
            if (savedItems) {
                this.items = savedItems;
            }

            this.history = this.historyManager.getRecent(10);
        },

        shuffle() {
            const text = this.items.trim();

            if (!text) {
                alert('シャッフルするリストを入力してください');
                return;
            }

            const itemsList = text.split('\n').filter(item => item.trim() !== '');

            if (itemsList.length === 0) {
                alert('有効な項目を入力してください');
                return;
            }

            const groupCount = parseInt(this.groupCount);

            const shuffled = this.shuffleArray(itemsList);

            if (groupCount === 0 || groupCount === 1) {
                // グループ分けなし
                this.shuffledResult = {
                    type: 'list',
                    items: shuffled
                };

                // 履歴に追加
                const now = new Date();
                const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
                this.historyManager.add({
                    result: shuffled.slice(0, 3).join(', ') + '...',
                    config: `${itemsList.length}項目`,
                    time: time
                });
                this.history = this.historyManager.getRecent(10);
            } else {
                // グループ分け
                if (groupCount > itemsList.length) {
                    alert('グループ数は項目数以下にしてください');
                    return;
                }

                const groups = Array.from({ length: groupCount }, () => []);
                shuffled.forEach((item, index) => {
                    groups[index % groupCount].push(item);
                });

                this.shuffledResult = {
                    type: 'groups',
                    groups: groups
                };

                // 履歴に追加
                const now = new Date();
                const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
                this.historyManager.add({
                    result: `${groupCount}グループに分割`,
                    config: `${itemsList.length}項目`,
                    time: time
                });
                this.history = this.historyManager.getRecent(10);
            }

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);
        },

        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        saveItems() {
            localStorage.setItem('savedShuffleItems', this.items);
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        }
    };
}
