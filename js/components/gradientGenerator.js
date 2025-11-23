function gradientGenerator() {
    return {
        gradientType: 'linear',
        colorCount: 2,
        angle: 90,
        generatedGradient: null,
        animating: false,
        history: [],

        init() {
            this.loadHistory();
        },

        generate() {
            this.animating = true;

            setTimeout(() => {
                const colors = this.generateRandomColors();
                const css = this.generateCSS(colors);
                const preview = this.generatePreview(colors);

                this.generatedGradient = {
                    colors,
                    css,
                    preview
                };

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    gradient: this.generatedGradient,
                    type: this.gradientType,
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

        generateRandomColors() {
            const colors = [];
            for (let i = 0; i < this.colorCount; i++) {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                colors.push(hex);
            }
            return colors;
        },

        generateCSS(colors) {
            if (this.gradientType === 'linear') {
                return `linear-gradient(${this.angle}deg, ${colors.join(', ')})`;
            } else if (this.gradientType === 'radial') {
                return `radial-gradient(circle, ${colors.join(', ')})`;
            } else if (this.gradientType === 'conic') {
                return `conic-gradient(from ${this.angle}deg, ${colors.join(', ')})`;
            }
            return '';
        },

        generatePreview(colors) {
            // プレビュー用のスタイル文字列
            return `background: ${this.generateCSS(colors)};`;
        },

        copyCSS(css) {
            navigator.clipboard.writeText(css).then(() => {
                alert('CSSをコピーしました！');
            }).catch(() => {
                alert('コピーに失敗しました');
            });
        },

        copySVG() {
            if (!this.generatedGradient) return;

            const colors = this.generatedGradient.colors;
            const svg = this.generateSVG(colors);

            navigator.clipboard.writeText(svg).then(() => {
                alert('SVGコードをコピーしました！');
            }).catch(() => {
                alert('コピーに失敗しました');
            });
        },

        generateSVG(colors) {
            const colorStops = colors.map((color, index) => {
                const offset = (index / (colors.length - 1)) * 100;
                return `    <stop offset="${offset}%" style="stop-color:${color};stop-opacity:1" />`;
            }).join('\n');

            if (this.gradientType === 'linear') {
                const x2 = Math.cos((this.angle - 90) * Math.PI / 180) * 100;
                const y2 = Math.sin((this.angle - 90) * Math.PI / 180) * 100;
                return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="${x2}%" y2="${y2}%">
${colorStops}
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradient)" />
</svg>`;
            } else {
                return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="gradient">
${colorStops}
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradient)" />
</svg>`;
            }
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('gradientGeneratorHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('gradientGeneratorHistory', JSON.stringify(this.history));
        }
    };
}
