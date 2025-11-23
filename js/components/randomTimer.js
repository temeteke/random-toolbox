function randomTimer() {
    return {
        minMinutes: 1,
        maxMinutes: 10,
        timerDuration: null,
        timeRemaining: null,
        isRunning: false,
        isPaused: false,
        interval: null,
        history: [],

        init() {
            this.loadHistory();
        },

        start() {
            // ランダムな時間を生成（秒単位）
            const minSeconds = this.minMinutes * 60;
            const maxSeconds = this.maxMinutes * 60;
            this.timerDuration = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
            this.timeRemaining = this.timerDuration;
            this.isRunning = true;
            this.isPaused = false;

            this.runTimer();
        },

        runTimer() {
            this.interval = setInterval(() => {
                if (!this.isPaused && this.timeRemaining > 0) {
                    this.timeRemaining--;

                    if (this.timeRemaining === 0) {
                        this.complete();
                    }
                }
            }, 1000);
        },

        pause() {
            this.isPaused = true;
        },

        resume() {
            this.isPaused = false;
        },

        stop() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this.isRunning = false;
            this.isPaused = false;
            this.timeRemaining = null;
        },

        complete() {
            this.stop();

            // 通知音を鳴らす（オプション）
            this.playNotificationSound();

            // 履歴に追加
            const historyItem = {
                id: Date.now(),
                duration: this.formatTime(this.timerDuration),
                time: new Date().toLocaleTimeString('ja-JP')
            };

            this.history.unshift(historyItem);
            if (this.history.length > 50) {
                this.history.pop();
            }

            this.saveHistory();

            alert('⏰ タイマーが終了しました！');
        },

        playNotificationSound() {
            // Web Audio APIで簡単な通知音を生成
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                // 音声再生に失敗しても続行
                console.log('Audio notification not available');
            }
        },

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        get displayTime() {
            if (this.timeRemaining === null) return '--:--';
            return this.formatTime(this.timeRemaining);
        },

        get progressPercentage() {
            if (!this.timerDuration || !this.timeRemaining) return 0;
            return ((this.timerDuration - this.timeRemaining) / this.timerDuration) * 100;
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('randomTimerHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('randomTimerHistory', JSON.stringify(this.history));
        }
    };
}
