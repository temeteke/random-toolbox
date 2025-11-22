import { HistoryManager } from '../utils/HistoryManager.js';

/**
 * カラーピッカーツールのAlpineコンポーネント
 */
function colorPicker() {
    const historyManager = new HistoryManager('colorHistory');
    return {
        colorType: 'single',
        generatedColor: null,
        generatedPalette: [],
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            this.history = this.historyManager.getRecent(10);
        },

        generate() {
            if (this.colorType === 'single') {
                const color = this.randomColor();
                const rgb = this.hexToRgb(color);

                this.generatedColor = {
                    hex: color,
                    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                };
                this.generatedPalette = [];

                // 履歴に追加
                const now = new Date();
                const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
                this.historyManager.add({
                    type: 'single',
                    color: color,
                    time: time
                });
                this.history = this.historyManager.getRecent(10);
            } else {
                const baseColor = this.randomColor();
                const colors = this.generateHarmoniousPalette(baseColor);

                this.generatedColor = null;
                this.generatedPalette = colors;

                // 履歴に追加
                const now = new Date();
                const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
                this.historyManager.add({
                    type: 'palette',
                    colors: colors,
                    time: time
                });
                this.history = this.historyManager.getRecent(10);
            }

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);
        },

        randomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        },

        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        },

        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        generateHarmoniousPalette(baseColor) {
            const rgb = this.hexToRgb(baseColor);
            const colors = [baseColor];

            // Analogous colors (類似色)
            const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

            for (let i = 1; i <= 4; i++) {
                const newHue = (hsl.h + (i * 30)) % 360;
                const newRgb = this.hslToRgb(newHue, hsl.s, hsl.l);
                colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
            }

            return colors;
        },

        rgbToHsl(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }

            return { h: h * 360, s: s, l: l };
        },

        hslToRgb(h, s, l) {
            h /= 360;
            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        },

        copyColor(color) {
            navigator.clipboard.writeText(color);
            return true;
        },

        clearHistory() {
            if (confirm('お気に入りをすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        }
    };
}

window.colorPicker = colorPicker;
