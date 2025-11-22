/**
 * 日付ランダマイザーツールのAlpineコンポーネント
 */
function dateRandomizer() {
    const historyManager = new HistoryManager('dateHistory');
    return {
        startDate: '',
        endDate: '',
        selectedDays: [0, 1, 2, 3, 4, 5, 6], // すべての曜日を初期選択
        randomDate: '',
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            // デフォルトの日付を設定（今日から1年後）
            const today = new Date();
            const oneYearLater = new Date(today);
            oneYearLater.setFullYear(today.getFullYear() + 1);

            this.startDate = this.formatDateForInput(today);
            this.endDate = this.formatDateForInput(oneYearLater);

            // URLから状態を復元
            const savedState = window.urlStateManager.restoreState('date');
            if (savedState.startDate !== undefined) this.startDate = savedState.startDate;
            if (savedState.endDate !== undefined) this.endDate = savedState.endDate;
            if (savedState.selectedDays !== undefined) this.selectedDays = savedState.selectedDays;

            // 状態変更を監視してURLに保存
            this.$watch('startDate', () => this.saveToURL());
            this.$watch('endDate', () => this.saveToURL());
            this.$watch('selectedDays', () => this.saveToURL());

            this.history = this.historyManager.getRecent(10);
        },

        saveToURL() {
            window.urlStateManager.saveState('date', {
                startDate: this.startDate,
                endDate: this.endDate,
                selectedDays: this.selectedDays
            });
        },

        formatDateForInput(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        toggleDay(day) {
            const index = this.selectedDays.indexOf(day);
            if (index > -1) {
                this.selectedDays.splice(index, 1);
            } else {
                this.selectedDays.push(day);
            }
        },

        isDaySelected(day) {
            return this.selectedDays.includes(day);
        },

        generate() {
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);

            if (!this.startDate || !this.endDate) {
                alert('開始日と終了日を入力してください');
                return;
            }

            if (startDate >= endDate) {
                alert('開始日は終了日より前にしてください');
                return;
            }

            if (this.selectedDays.length === 0) {
                alert('少なくとも1つの曜日を選択してください');
                return;
            }

            // 選択された曜日の日付のみを収集
            const validDates = [];
            const current = new Date(startDate);

            while (current <= endDate) {
                if (this.selectedDays.includes(current.getDay())) {
                    validDates.push(new Date(current));
                }
                current.setDate(current.getDate() + 1);
            }

            if (validDates.length === 0) {
                alert('選択された曜日フィルターに一致する日付がありません');
                return;
            }

            // ランダムに日付を選択
            const randomDate = validDates[Math.floor(Math.random() * validDates.length)];
            const dateStr = randomDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });

            this.randomDate = dateStr;

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            this.historyManager.add({
                date: dateStr,
                time: time
            });
            this.history = this.historyManager.getRecent(10);
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        }
    };
}

window.dateRandomizer = dateRandomizer;
