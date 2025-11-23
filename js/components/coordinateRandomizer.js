function coordinateRandomizer() {
    return {
        rangeType: 'world',
        minLat: -90,
        maxLat: 90,
        minLng: -180,
        maxLng: 180,
        result: null,
        animating: false,
        history: [],

        presetRanges: {
            world: { minLat: -90, maxLat: 90, minLng: -180, maxLng: 180, name: '世界全体' },
            japan: { minLat: 24, maxLat: 46, minLng: 123, maxLng: 146, name: '日本' },
            tokyo: { minLat: 35.5, maxLat: 35.9, minLng: 139.5, maxLng: 139.9, name: '東京' },
            usa: { minLat: 25, maxLat: 49, minLng: -125, maxLng: -66, name: 'アメリカ' },
            europe: { minLat: 36, maxLat: 71, minLng: -10, maxLng: 40, name: 'ヨーロッパ' },
            asia: { minLat: -10, maxLat: 55, minLng: 60, maxLng: 150, name: 'アジア' }
        },

        init() {
            this.loadHistory();
            this.updateRange();
        },

        updateRange() {
            if (this.rangeType !== 'custom') {
                const preset = this.presetRanges[this.rangeType];
                if (preset) {
                    this.minLat = preset.minLat;
                    this.maxLat = preset.maxLat;
                    this.minLng = preset.minLng;
                    this.maxLng = preset.maxLng;
                }
            }
        },

        generate() {
            this.animating = true;

            setTimeout(() => {
                const lat = this.randomInRange(this.minLat, this.maxLat);
                const lng = this.randomInRange(this.minLng, this.maxLng);

                this.result = {
                    lat: lat.toFixed(6),
                    lng: lng.toFixed(6),
                    formatted: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                    googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
                    rangeName: this.getRangeName()
                };

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    coordinate: this.result.formatted,
                    range: this.result.rangeName,
                    url: this.result.googleMapsUrl,
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

        randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        },

        getRangeName() {
            if (this.rangeType === 'custom') {
                return 'カスタム範囲';
            }
            return this.presetRanges[this.rangeType]?.name || '世界全体';
        },

        copyCoordinate() {
            if (!this.result) return;
            navigator.clipboard.writeText(this.result.formatted).then(() => {
                alert('座標をコピーしました！');
            }).catch(() => {
                alert('コピーに失敗しました');
            });
        },

        openInMaps() {
            if (!this.result) return;
            window.open(this.result.googleMapsUrl, '_blank');
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('coordinateRandomizerHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('coordinateRandomizerHistory', JSON.stringify(this.history));
        }
    };
}
