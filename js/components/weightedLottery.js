function weightedLottery() {
    return {
        items: '',
        result: null,
        animating: false,
        history: [],
        parsedItems: [],

        init() {
            this.loadHistory();
            this.loadItems();
        },

        parseItems() {
            const lines = this.items
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            this.parsedItems = lines.map(line => {
                // 形式: "項目名:重み" または "項目名" (デフォルト重み1)
                const parts = line.split(':');
                const name = parts[0].trim();
                const weight = parts.length > 1 ? parseFloat(parts[1].trim()) || 1 : 1;
                return { name, weight: Math.max(0.1, weight) }; // 最小重み0.1
            });

            return this.parsedItems;
        },

        draw() {
            const items = this.parseItems();

            if (items.length === 0) {
                alert('項目を入力してください。\n例:\nレア:1\nノーマル:10\nコモン:50');
                return;
            }

            this.animating = true;

            setTimeout(() => {
                // 重み付き抽選
                const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
                let random = Math.random() * totalWeight;

                let selected = items[0];
                for (const item of items) {
                    random -= item.weight;
                    if (random <= 0) {
                        selected = item;
                        break;
                    }
                }

                this.result = {
                    name: selected.name,
                    weight: selected.weight,
                    probability: ((selected.weight / totalWeight) * 100).toFixed(2)
                };

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    item: selected.name,
                    weight: selected.weight,
                    probability: this.result.probability,
                    time: new Date().toLocaleTimeString('ja-JP')
                };

                this.history.unshift(historyItem);
                if (this.history.length > 50) {
                    this.history.pop();
                }

                this.saveHistory();
                this.animating = false;
            }, 300);
        },

        getProbabilityList() {
            const items = this.parseItems();
            if (items.length === 0) return [];

            const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
            return items.map(item => ({
                name: item.name,
                weight: item.weight,
                probability: ((item.weight / totalWeight) * 100).toFixed(2)
            }));
        },

        saveItems() {
            localStorage.setItem('weightedLotteryItems', this.items);
        },

        loadItems() {
            const saved = localStorage.getItem('weightedLotteryItems');
            if (saved) {
                this.items = saved;
            } else {
                this.items = 'レア:1\nノーマル:10\nコモン:50';
            }
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('weightedLotteryHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('weightedLotteryHistory', JSON.stringify(this.history));
        }
    };
}
