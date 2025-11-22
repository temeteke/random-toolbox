import { HistoryManager } from '../utils/HistoryManager.js';

/**
 * リスト選択ツールのAlpineコンポーネント
 */
export function listSelector() {
    return {
        listItems: '',
        result: null,
        historyManager: new HistoryManager('listHistory'),
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
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
            }
        },

        get history() {
            return this.historyManager.getRecent(10);
        }
    };
}
