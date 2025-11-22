/**
 * リスト選択ツールのAlpineコンポーネント
 */
function listSelector() {
    const historyManager = new HistoryManager('listHistory');
    return {
        listItems: '',
        result: null,
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            // LocalStorageから保存済みリストを復元
            const savedListItems = localStorage.getItem('savedListItems');
            if (savedListItems) {
                this.listItems = savedListItems;
            }

            // リスト変更時に自動保存
            this.$watch('listItems', (value) => {
                localStorage.setItem('savedListItems', value);
            });

            this.history = this.historyManager.getRecent(10);
        },

        select() {
            const text = this.listItems.trim();

            if (!text) {
                alert('リスト項目を入力してください');
                return;
            }

            const items = text.split('\n').filter(item => item.trim() !== '');

            if (items.length === 0) {
                alert('有効な項目を入力してください');
                return;
            }

            const randomIndex = Math.floor(Math.random() * items.length);
            const selectedItem = items[randomIndex].trim();
            this.result = selectedItem;

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            this.historyManager.add({
                item: selectedItem,
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

window.listSelector = listSelector;
