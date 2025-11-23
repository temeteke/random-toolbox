// 音声読み上げ管理
class SpeechManager {
    static isEnabled() {
        return localStorage.getItem('speechEnabled') === 'true';
    }

    static setEnabled(enabled) {
        localStorage.setItem('speechEnabled', enabled ? 'true' : 'false');
    }

    static toggle() {
        const current = SpeechManager.isEnabled();
        SpeechManager.setEnabled(!current);
        return !current;
    }

    static speak(text, options = {}) {
        // 音声読み上げが無効の場合は何もしない
        if (!SpeechManager.isEnabled()) {
            return;
        }

        // Web Speech API のサポート確認
        if (!('speechSynthesis' in window)) {
            console.warn('音声読み上げはこのブラウザではサポートされていません');
            return;
        }

        // 既存の読み上げをキャンセル
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // デフォルト設定
        utterance.lang = options.lang || 'ja-JP';
        utterance.rate = options.rate || 1.0;  // 速度 (0.1-10)
        utterance.pitch = options.pitch || 1.0; // ピッチ (0-2)
        utterance.volume = options.volume || 1.0; // 音量 (0-1)

        // 音声を選択（日本語音声を優先）
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => voice.lang.startsWith('ja'));
        if (japaneseVoice) {
            utterance.voice = japaneseVoice;
        }

        // イベントハンドラ
        if (options.onStart) {
            utterance.onstart = options.onStart;
        }
        if (options.onEnd) {
            utterance.onend = options.onEnd;
        }
        if (options.onError) {
            utterance.onerror = options.onError;
        }

        window.speechSynthesis.speak(utterance);
    }

    static cancel() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    static pause() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.pause();
        }
    }

    static resume() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.resume();
        }
    }

    static getVoices() {
        if (!('speechSynthesis' in window)) {
            return [];
        }
        return window.speechSynthesis.getVoices();
    }

    static isSupported() {
        return 'speechSynthesis' in window;
    }

    // 結果読み上げのヘルパー関数
    static announceResult(result, prefix = '結果は') {
        SpeechManager.speak(`${prefix}、${result}`);
    }

    static announceNumber(number) {
        SpeechManager.speak(`${number}`);
    }

    static announceItem(item) {
        SpeechManager.speak(`選ばれたのは、${item}`);
    }

    static announceWinner(winner) {
        SpeechManager.speak(`当たりは、${winner}、です`);
    }

    static announceDecision(decision) {
        SpeechManager.speak(`決定しました。${decision}`);
    }
}

// 音声が読み込まれるまで待機
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        // 音声リストが更新された時の処理
        const voices = window.speechSynthesis.getVoices();
        console.log(`利用可能な音声: ${voices.length}個`);
    };
}
