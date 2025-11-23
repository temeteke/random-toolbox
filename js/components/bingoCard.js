function bingoCard() {
    return {
        cardSize: 5,
        cardType: 'numbers',
        customItems: '',
        generatedCard: null,
        animating: false,
        history: [],

        init() {
            this.loadHistory();
            this.loadCustomItems();
        },

        generate() {
            this.animating = true;

            setTimeout(() => {
                if (this.cardType === 'numbers') {
                    this.generatedCard = this.generateNumberCard();
                } else {
                    this.generatedCard = this.generateCustomCard();
                }

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    card: this.generatedCard,
                    size: this.cardSize,
                    type: this.cardType,
                    time: new Date().toLocaleTimeString('ja-JP')
                };

                this.history.unshift(historyItem);
                if (this.history.length > 20) {
                    this.history.pop();
                }

                this.saveHistory();
                this.animating = false;
            }, 300);
        },

        generateNumberCard() {
            const size = parseInt(this.cardSize);
            const card = [];
            const totalCells = size * size;
            const usedNumbers = new Set();

            // ビンゴの範囲を設定（1-75が標準だが、カードサイズに応じて調整）
            const maxNumber = Math.max(75, totalCells * 3);

            for (let i = 0; i < size; i++) {
                const row = [];
                for (let j = 0; j < size; j++) {
                    // 真ん中のセルはFREEにする（5x5の場合のみ）
                    if (size === 5 && i === 2 && j === 2) {
                        row.push('FREE');
                    } else {
                        let num;
                        do {
                            num = Math.floor(Math.random() * maxNumber) + 1;
                        } while (usedNumbers.has(num));
                        usedNumbers.add(num);
                        row.push(num);
                    }
                }
                card.push(row);
            }

            return card;
        },

        generateCustomCard() {
            const size = parseInt(this.cardSize);
            const items = this.customItems
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const totalCells = size * size;
            const requiredItems = size === 5 ? totalCells - 1 : totalCells; // 5x5の場合はFREEマスを考慮

            if (items.length < requiredItems) {
                alert(`最低${requiredItems}個の項目が必要です。（現在: ${items.length}個）`);
                this.animating = false;
                return null;
            }

            const card = [];
            const shuffled = [...items].sort(() => Math.random() - 0.5);
            let index = 0;

            for (let i = 0; i < size; i++) {
                const row = [];
                for (let j = 0; j < size; j++) {
                    // 真ん中のセルはFREEにする（5x5の場合のみ）
                    if (size === 5 && i === 2 && j === 2) {
                        row.push('FREE');
                    } else {
                        row.push(shuffled[index++]);
                    }
                }
                card.push(row);
            }

            return card;
        },

        saveCustomItems() {
            localStorage.setItem('bingoCardCustom', this.customItems);
        },

        loadCustomItems() {
            const saved = localStorage.getItem('bingoCardCustom');
            if (saved) {
                this.customItems = saved;
            }
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('bingoCardHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('bingoCardHistory', JSON.stringify(this.history));
        }
    };
}
