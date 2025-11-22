
/**
 * ルーレットツールのAlpineコンポーネント
 */
function roulette() {
    const historyManager = new HistoryManager('rouletteHistory');
    return {
        items: '',
        winner: '',
        isSpinning: false,
        wheelRotation: 0,
        historyManager: historyManager,
        history: [],

        init() {
            // 保存された項目を復元
            const savedItems = localStorage.getItem('savedRouletteItems');
            if (savedItems) {
                this.items = savedItems;
            }

            this.history = this.historyManager.getRecent(10);
        },

        spin() {
            if (this.isSpinning) return;

            const text = this.items.trim();

            if (!text) {
                alert('ルーレット項目を入力してください');
                return;
            }

            const itemsList = text.split('\n').filter(item => item.trim() !== '');

            if (itemsList.length === 0) {
                alert('有効な項目を入力してください');
                return;
            }

            if (itemsList.length < 2) {
                alert('最低2つの項目を入力してください');
                return;
            }

            this.isSpinning = true;
            this.winner = '';

            // ランダムに当選者を選択
            const winnerIndex = Math.floor(Math.random() * itemsList.length);
            const winner = itemsList[winnerIndex];

            // 回転角度を計算
            const anglePerItem = 360 / itemsList.length;
            const baseRotation = 1800; // 5回転
            const targetAngle = baseRotation + (360 - (winnerIndex * anglePerItem + anglePerItem / 2));

            this.wheelRotation = targetAngle;

            // 4秒後に結果を表示
            setTimeout(() => {
                this.winner = winner;
                this.isSpinning = false;

                // 履歴に追加
                const now = new Date();
                const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
                this.historyManager.add({
                    item: winner,
                    time: time
                });
                this.history = this.historyManager.getRecent(10);
            }, 4500);
        },

        saveItems() {
            localStorage.setItem('savedRouletteItems', this.items);
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        },

        get itemsList() {
            const text = this.items.trim();
            if (!text) return [];
            return text.split('\n').filter(item => item.trim() !== '');
        },

        buildRouletteWheel() {
            const items = this.itemsList;
            if (items.length < 2) return '';

            const anglePerItem = 360 / items.length;
            const colors = [
                ['#667eea', '#764ba2'],
                ['#f093fb', '#f5576c'],
                ['#4facfe', '#00f2fe'],
                ['#43e97b', '#38f9d7'],
                ['#fa709a', '#fee140'],
                ['#30cfd0', '#330867'],
                ['#a8edea', '#fed6e3'],
                ['#ff9a9e', '#fecfef']
            ];

            let svgContent = '<svg viewBox="0 0 200 200" width="300" height="300"><defs>';

            // グラデーション定義
            items.forEach((item, index) => {
                const colorPair = colors[index % colors.length];
                svgContent += `
                    <linearGradient id="gradient-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colorPair[0]};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${colorPair[1]};stop-opacity:1" />
                    </linearGradient>
                `;
            });

            svgContent += '</defs>';

            // 扇形を描画
            items.forEach((item, index) => {
                const startAngle = (anglePerItem * index - 90) * Math.PI / 180;
                const endAngle = (anglePerItem * (index + 1) - 90) * Math.PI / 180;
                const cx = 100, cy = 100, radius = 100;

                const x1 = cx + radius * Math.cos(startAngle);
                const y1 = cy + radius * Math.sin(startAngle);
                const x2 = cx + radius * Math.cos(endAngle);
                const y2 = cy + radius * Math.sin(endAngle);

                const largeArcFlag = anglePerItem > 180 ? 1 : 0;

                svgContent += `
                    <path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z"
                          fill="url(#gradient-${index})" stroke="white" stroke-width="2" />
                `;

                // テキストの配置
                const midAngle = (startAngle + endAngle) / 2;
                const textRadius = radius * 0.65;
                const textX = cx + textRadius * Math.cos(midAngle);
                const textY = cy + textRadius * Math.sin(midAngle);

                let textAngle = (anglePerItem * index + anglePerItem / 2);
                if (textAngle > 90 && textAngle < 270) {
                    textAngle += 180;
                }

                const displayText = item.length > 8 ? item.substring(0, 8) + '...' : item;
                svgContent += `
                    <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="middle"
                          fill="white" font-size="14" font-weight="bold"
                          style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"
                          transform="rotate(${textAngle} ${textX} ${textY})">${displayText}</text>
                `;
            });

            // 中央の円
            svgContent += `
                <circle cx="100" cy="100" r="20" fill="#667eea" stroke="white" stroke-width="3" />
                <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-size="20">🎰</text>
            `;

            svgContent += '</svg>';
            return svgContent;
        }
    };
}

window.roulette = roulette;
