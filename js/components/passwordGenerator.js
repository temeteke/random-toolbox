/**
 * パスワード生成器のAlpineコンポーネント
 */
function passwordGenerator() {
    const historyManager = new HistoryManager('passwordHistory');
    return {
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        generatedPassword: '',
        strength: null,
        historyManager: historyManager,
        history: [],
        animating: false,

        init() {
            this.history = this.historyManager.getRecent(10);
        },

        generate() {
            const length = parseInt(this.length);
            const useUppercase = this.includeUppercase;
            const useLowercase = this.includeLowercase;
            const useNumbers = this.includeNumbers;
            const useSymbols = this.includeSymbols;

            if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
                alert('少なくとも1つの文字種別を選択してください');
                return;
            }

            const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const lowercase = 'abcdefghijklmnopqrstuvwxyz';
            const numbers = '0123456789';
            const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

            let chars = '';
            let charTypes = 0;

            if (useUppercase) { chars += uppercase; charTypes++; }
            if (useLowercase) { chars += lowercase; charTypes++; }
            if (useNumbers) { chars += numbers; charTypes++; }
            if (useSymbols) { chars += symbols; charTypes++; }

            let password = '';
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            this.generatedPassword = password;

            // 強度を計算
            this.strength = this.calculatePasswordStrength(password, charTypes);

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            const config = `${length}文字 ${useUppercase ? 'A-Z' : ''}${useLowercase ? 'a-z' : ''}${useNumbers ? '0-9' : ''}${useSymbols ? '記号' : ''}`;
            this.historyManager.add({
                password: password,
                config: config,
                time: time
            });
            this.history = this.historyManager.getRecent(10);
        },

        calculatePasswordStrength(password, charTypes) {
            const length = password.length;
            let strength = 0;
            let label = '';
            let color = '';

            // 長さによる評価
            if (length >= 16) strength += 2;
            else if (length >= 12) strength += 1;

            // 文字種別の多様性
            strength += charTypes;

            // 評価
            if (strength >= 5) {
                label = '非常に強い';
                color = '#4CAF50';
            } else if (strength >= 4) {
                label = '強い';
                color = '#8BC34A';
            } else if (strength >= 3) {
                label = '普通';
                color = '#FFC107';
            } else {
                label = '弱い';
                color = '#FF5722';
            }

            return { label, color, strength };
        },

        copyPassword() {
            if (this.generatedPassword) {
                navigator.clipboard.writeText(this.generatedPassword);
                return true;
            }
            return false;
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
                this.history = [];
            }
        },

        get strengthPercentage() {
            return this.strength ? (this.strength.strength / 6) * 100 : 0;
        }
    };
}

window.passwordGenerator = passwordGenerator;
