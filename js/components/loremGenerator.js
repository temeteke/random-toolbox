function loremGenerator() {
    return {
        language: 'japanese',
        paragraphCount: 3,
        sentenceCount: 5,
        wordCount: 50,
        generationType: 'paragraphs',
        result: '',
        animating: false,
        history: [],

        // Lorem Ipsumデータ
        loremWords: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'],

        // 日本語サンプルテキスト用の単語
        japaneseWords: ['吾輩', 'は', '猫', 'である', '名前', 'は', 'まだ', 'ない', 'どこ', 'で', '生れた', 'か', 'とんと', '見当', 'が', 'つかぬ', '何', 'でも', '薄暗い', 'じめじめ', 'した', '所', 'で', 'ニャーニャー', '泣いて', 'いた', '事', 'だけ', 'は', '記憶', 'して', 'いる', '春', 'は', 'あけぼの', 'やうやう', '白く', 'なりゆく', '山際', '少し', 'あかりて', '紫だちたる', '雲', 'の', '細く', 'たなびきたる', '夏', '夜', '月', '頃', 'は', 'さらなり', '闇', 'も', 'なほ', '蛍', '多く', '飛びちがひたる', '秋', '夕暮れ', '花', '鳥', '風', '月', '雪', '空', '海', '山', '川', '森', '木', '草', '石', '光', '影', '色', '音', '香', '味', '心', '魂', '夢', '希望', '愛', '平和', '自由', '正義', '真理', '美', '善'],

        init() {
            this.loadHistory();
        },

        generate() {
            this.animating = true;

            setTimeout(() => {
                let generatedText = '';

                switch (this.generationType) {
                    case 'paragraphs':
                        generatedText = this.generateParagraphs();
                        break;
                    case 'sentences':
                        generatedText = this.generateSentences();
                        break;
                    case 'words':
                        generatedText = this.generateWords();
                        break;
                }

                this.result = generatedText;

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    text: generatedText.substring(0, 100) + (generatedText.length > 100 ? '...' : ''),
                    fullText: generatedText,
                    config: this.getConfigString(),
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

        generateParagraphs() {
            const paragraphs = [];
            for (let i = 0; i < this.paragraphCount; i++) {
                const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
                const sentences = [];
                for (let j = 0; j < sentenceCount; j++) {
                    sentences.push(this.generateSentence());
                }
                paragraphs.push(sentences.join(' '));
            }
            return paragraphs.join('\n\n');
        },

        generateSentences() {
            const sentences = [];
            for (let i = 0; i < this.sentenceCount; i++) {
                sentences.push(this.generateSentence());
            }
            return sentences.join(' ');
        },

        generateSentence() {
            const wordList = this.language === 'japanese' ? this.japaneseWords : this.loremWords;
            const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words per sentence
            const words = [];

            for (let i = 0; i < wordCount; i++) {
                const word = wordList[Math.floor(Math.random() * wordList.length)];
                words.push(i === 0 ? this.capitalize(word) : word);
            }

            return words.join(' ') + '.';
        },

        generateWords() {
            const wordList = this.language === 'japanese' ? this.japaneseWords : this.loremWords;
            const words = [];

            for (let i = 0; i < this.wordCount; i++) {
                words.push(wordList[Math.floor(Math.random() * wordList.length)]);
            }

            return words.join(' ');
        },

        capitalize(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        },

        getConfigString() {
            const types = {
                paragraphs: `${this.paragraphCount}段落`,
                sentences: `${this.sentenceCount}文`,
                words: `${this.wordCount}単語`
            };
            const lang = this.language === 'japanese' ? '日本語' : '英語';
            return `${types[this.generationType]} (${lang})`;
        },

        copyText() {
            navigator.clipboard.writeText(this.result).then(() => {
                alert('テキストをコピーしました！');
            }).catch(() => {
                alert('コピーに失敗しました');
            });
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('loremGeneratorHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('loremGeneratorHistory', JSON.stringify(this.history));
        }
    };
}
