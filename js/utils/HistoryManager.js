/**
 * 履歴管理の共通クラス
 * 全てのツールで使用される履歴機能を統一的に管理
 */
export class HistoryManager {
    constructor(storageKey, maxItems = 50) {
        this.storageKey = storageKey;
        this.maxItems = maxItems;
        this.items = this.load();
    }

    /**
     * LocalStorageから履歴を読み込む
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Failed to load history for ${this.storageKey}:`, error);
            return [];
        }
    }

    /**
     * LocalStorageに履歴を保存
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error(`Failed to save history for ${this.storageKey}:`, error);
        }
    }

    /**
     * 履歴に新しいアイテムを追加
     */
    add(item) {
        this.items.unshift(item);
        if (this.items.length > this.maxItems) {
            this.items = this.items.slice(0, this.maxItems);
        }
        this.save();
    }

    /**
     * 履歴をクリア
     */
    clear() {
        this.items = [];
        this.save();
    }

    /**
     * 指定した数の履歴アイテムを取得
     */
    getRecent(count = 10) {
        return this.items.slice(0, count);
    }

    /**
     * すべての履歴アイテムを取得
     */
    getAll() {
        return this.items;
    }

    /**
     * 履歴の件数を取得
     */
    count() {
        return this.items.length;
    }
}
