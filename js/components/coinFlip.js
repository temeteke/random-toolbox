function coinFlip() {
    return {
        result: null,
        animating: false,
        isFlipping: false,
        flipCount: 0,
        history: [],
        stats: { heads: 0, tails: 0 },

        init() {
            this.loadHistory();
        },

        async flip() {
            if (this.isFlipping) return;

            this.isFlipping = true;
            this.animating = true;

            // アニメーション演出
            const flipDuration = 1000;
            const flipInterval = 100;
            let elapsed = 0;

            const interval = setInterval(() => {
                this.result = Math.random() < 0.5 ? '表' : '裏';
                elapsed += flipInterval;

                if (elapsed >= flipDuration) {
                    clearInterval(interval);
                    this.finalizeFlip();
                }
            }, flipInterval);
        },

        finalizeFlip() {
            const finalResult = Math.random() < 0.5 ? '表' : '裏';
            this.result = finalResult;
            this.flipCount++;

            // 統計を更新
            if (finalResult === '表') {
                this.stats.heads++;
            } else {
                this.stats.tails++;
            }

            // 履歴に追加
            const historyItem = {
                id: Date.now(),
                result: finalResult,
                time: new Date().toLocaleTimeString('ja-JP'),
                flipNumber: this.flipCount
            };

            this.history.unshift(historyItem);
            if (this.history.length > 50) {
                this.history.pop();
            }

            this.saveHistory();

            setTimeout(() => {
                this.animating = false;
                this.isFlipping = false;
            }, 200);
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.stats = { heads: 0, tails: 0 };
                this.flipCount = 0;
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('coinFlipHistory');
            if (saved) {
                const data = JSON.parse(saved);
                this.history = data.history || [];
                this.stats = data.stats || { heads: 0, tails: 0 };
                this.flipCount = data.flipCount || 0;
            }
        },

        saveHistory() {
            localStorage.setItem('coinFlipHistory', JSON.stringify({
                history: this.history,
                stats: this.stats,
                flipCount: this.flipCount
            }));
        },

        get headsPercentage() {
            const total = this.stats.heads + this.stats.tails;
            return total > 0 ? Math.round((this.stats.heads / total) * 100) : 0;
        },

        get tailsPercentage() {
            const total = this.stats.heads + this.stats.tails;
            return total > 0 ? Math.round((this.stats.tails / total) * 100) : 0;
        }
    };
}
