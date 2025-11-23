// データのエクスポート/インポート管理
class DataManager {
    static exportAllData() {
        const allData = {};

        // LocalStorageから全てのデータを取得
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            allData[key] = value;
        }

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        // ダウンロード
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `random-toolbox-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        return true;
    }

    static exportAsCSV() {
        // 全ての履歴データをCSV形式で出力
        let csvContent = 'Tool,Data,Time\n';

        const historyKeys = Object.keys(localStorage).filter(key => key.includes('History'));

        historyKeys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                const toolName = key.replace('History', '');

                if (Array.isArray(data)) {
                    data.forEach(item => {
                        const values = Object.values(item).map(v =>
                            typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
                        );
                        csvContent += `${toolName},${values.join(',')}\n`;
                    });
                }
            } catch (e) {
                console.error(`Error parsing ${key}:`, e);
            }
        });

        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `random-toolbox-history-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        return true;
    }

    static importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    // データをLocalStorageにインポート
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(key, data[key]);
                    });

                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('ファイルの読み込みに失敗しました'));
            };

            reader.readAsText(file);
        });
    }

    static clearAllData() {
        if (confirm('全てのデータを削除しますか？この操作は取り消せません。')) {
            localStorage.clear();
            return true;
        }
        return false;
    }

    static getStorageInfo() {
        let totalSize = 0;
        const items = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const size = new Blob([value]).size;
            totalSize += size;
            items[key] = {
                size: size,
                sizeKB: (size / 1024).toFixed(2)
            };
        }

        return {
            totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            itemCount: localStorage.length,
            items
        };
    }
}
