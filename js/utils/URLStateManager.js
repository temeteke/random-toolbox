/**
 * URLクエリパラメータとアプリケーション状態の同期を管理するユーティリティ
 */
class URLStateManager {
    constructor() {
        this.listeners = new Set();
    }

    /**
     * URLからクエリパラメータを取得
     */
    getParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    /**
     * URLのクエリパラメータを更新
     * @param {Object} params - 更新するパラメータのオブジェクト
     * @param {boolean} replace - trueの場合、履歴を置き換える（デフォルト: true）
     */
    updateParams(params, replace = true) {
        const url = new URL(window.location);

        // 既存のパラメータをクリア
        url.search = '';

        // 新しいパラメータを設定
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.set(key, value);
            }
        });

        // URLを更新（履歴を残さない）
        if (replace) {
            window.history.replaceState({}, '', url);
        } else {
            window.history.pushState({}, '', url);
        }

        // リスナーに通知
        this.notifyListeners();
    }

    /**
     * 特定のパラメータを更新
     * @param {string} key - パラメータ名
     * @param {any} value - パラメータ値
     */
    setParam(key, value) {
        const params = this.getParams();
        params[key] = value;
        this.updateParams(params);
    }

    /**
     * 特定のパラメータを取得
     * @param {string} key - パラメータ名
     * @param {any} defaultValue - デフォルト値
     */
    getParam(key, defaultValue = null) {
        const params = this.getParams();
        return params[key] !== undefined ? params[key] : defaultValue;
    }

    /**
     * URLパラメータから状態を復元
     * @param {string} prefix - パラメータのプレフィックス（タブ名など）
     */
    restoreState(prefix) {
        const params = this.getParams();
        const state = {};

        Object.entries(params).forEach(([key, value]) => {
            if (key.startsWith(prefix + '_')) {
                const stateKey = key.substring((prefix + '_').length);
                state[stateKey] = this.deserializeValue(value);
            }
        });

        return state;
    }

    /**
     * 状態をURLパラメータに保存
     * @param {string} prefix - パラメータのプレフィックス（タブ名など）
     * @param {Object} state - 保存する状態
     */
    saveState(prefix, state) {
        const params = this.getParams();

        // 既存のプレフィックス付きパラメータを削除
        Object.keys(params).forEach(key => {
            if (key.startsWith(prefix + '_')) {
                delete params[key];
            }
        });

        // 新しい状態を追加
        Object.entries(state).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params[`${prefix}_${key}`] = this.serializeValue(value);
            }
        });

        this.updateParams(params);
    }

    /**
     * 値をシリアライズ（文字列化）
     */
    serializeValue(value) {
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }

    /**
     * 値をデシリアライズ（元の型に復元）
     */
    deserializeValue(value) {
        // JSON形式かどうかチェック
        if (value.startsWith('[') || value.startsWith('{')) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }

        // 数値かどうかチェック
        if (!isNaN(value) && value !== '') {
            return Number(value);
        }

        // ブール値かどうかチェック
        if (value === 'true') return true;
        if (value === 'false') return false;

        return value;
    }

    /**
     * 変更リスナーを追加
     */
    addListener(callback) {
        this.listeners.add(callback);
    }

    /**
     * 変更リスナーを削除
     */
    removeListener(callback) {
        this.listeners.delete(callback);
    }

    /**
     * すべてのリスナーに通知
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
}

// グローバルインスタンスを作成
window.URLStateManager = URLStateManager;
window.urlStateManager = new URLStateManager();
