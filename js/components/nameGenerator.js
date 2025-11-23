function nameGenerator() {
    return {
        nameType: 'japanese',
        gender: 'any',
        length: 'medium',
        result: null,
        animating: false,
        history: [],

        // 日本語名前データ
        japaneseSurnames: ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水'],
        japaneseFirstNamesMale: ['太郎', '次郎', '三郎', '健', '誠', '翔', '大輔', '拓也', '和也', '雄太', '翔太', '健太', '大樹', '隼人', '颯', '陸', '蓮', '湊', '悠斗', '陽向'],
        japaneseFirstNamesFemale: ['花子', '美咲', 'さくら', '結衣', '陽菜', '美羽', '莉子', '美月', '葵', '凛', '結菜', '心春', '杏', '紬', '咲良', '楓', '澪', '芽依', '優奈', '陽葵'],

        // 英語名前データ
        englishFirstNamesMale: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kevin'],
        englishFirstNamesFemale: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna'],
        englishSurnames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White'],

        // ユーザー名用
        usernameAdjectives: ['cool', 'super', 'mega', 'ultra', 'happy', 'lucky', 'fast', 'dark', 'bright', 'silent', 'loud', 'smart', 'wild', 'calm', 'brave', 'swift', 'ninja', 'cyber', 'star', 'cosmic'],
        usernameNouns: ['tiger', 'dragon', 'wolf', 'eagle', 'lion', 'bear', 'fox', 'hawk', 'panda', 'phoenix', 'shadow', 'thunder', 'storm', 'flame', 'frost', 'wind', 'rain', 'moon', 'sun', 'comet'],

        // プロジェクト名用
        projectAdjectives: ['Quick', 'Smart', 'Easy', 'Fast', 'Simple', 'Powerful', 'Advanced', 'Modern', 'Creative', 'Dynamic', 'Flexible', 'Robust', 'Elegant', 'Innovative', 'Efficient', 'Secure', 'Scalable', 'Reliable', 'Agile', 'Swift'],
        projectNouns: ['Hub', 'Studio', 'Lab', 'Works', 'Suite', 'Platform', 'Engine', 'Framework', 'Toolkit', 'Builder', 'Manager', 'Center', 'Portal', 'Space', 'Zone', 'Cloud', 'Pro', 'Plus', 'Max', 'Core'],

        init() {
            this.loadHistory();
        },

        generate() {
            this.animating = true;

            setTimeout(() => {
                let generatedName = '';

                switch (this.nameType) {
                    case 'japanese':
                        generatedName = this.generateJapaneseName();
                        break;
                    case 'english':
                        generatedName = this.generateEnglishName();
                        break;
                    case 'username':
                        generatedName = this.generateUsername();
                        break;
                    case 'project':
                        generatedName = this.generateProjectName();
                        break;
                }

                this.result = generatedName;

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    name: generatedName,
                    type: this.getTypeName(),
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

        generateJapaneseName() {
            const surname = this.japaneseSurnames[Math.floor(Math.random() * this.japaneseSurnames.length)];
            let firstName;

            if (this.gender === 'male') {
                firstName = this.japaneseFirstNamesMale[Math.floor(Math.random() * this.japaneseFirstNamesMale.length)];
            } else if (this.gender === 'female') {
                firstName = this.japaneseFirstNamesFemale[Math.floor(Math.random() * this.japaneseFirstNamesFemale.length)];
            } else {
                const allNames = [...this.japaneseFirstNamesMale, ...this.japaneseFirstNamesFemale];
                firstName = allNames[Math.floor(Math.random() * allNames.length)];
            }

            return `${surname} ${firstName}`;
        },

        generateEnglishName() {
            const surname = this.englishSurnames[Math.floor(Math.random() * this.englishSurnames.length)];
            let firstName;

            if (this.gender === 'male') {
                firstName = this.englishFirstNamesMale[Math.floor(Math.random() * this.englishFirstNamesMale.length)];
            } else if (this.gender === 'female') {
                firstName = this.englishFirstNamesFemale[Math.floor(Math.random() * this.englishFirstNamesFemale.length)];
            } else {
                const allNames = [...this.englishFirstNamesMale, ...this.englishFirstNamesFemale];
                firstName = allNames[Math.floor(Math.random() * allNames.length)];
            }

            return `${firstName} ${surname}`;
        },

        generateUsername() {
            const adj = this.usernameAdjectives[Math.floor(Math.random() * this.usernameAdjectives.length)];
            const noun = this.usernameNouns[Math.floor(Math.random() * this.usernameNouns.length)];
            const num = Math.floor(Math.random() * 1000);

            if (this.length === 'short') {
                return noun + num;
            } else if (this.length === 'long') {
                return adj + '_' + noun + '_' + num;
            } else {
                return adj + noun + num;
            }
        },

        generateProjectName() {
            const adj = this.projectAdjectives[Math.floor(Math.random() * this.projectAdjectives.length)];
            const noun = this.projectNouns[Math.floor(Math.random() * this.projectNouns.length)];

            if (this.length === 'short') {
                return noun;
            } else if (this.length === 'long') {
                return `${adj} ${noun} Pro`;
            } else {
                return `${adj} ${noun}`;
            }
        },

        getTypeName() {
            const types = {
                japanese: '日本語名',
                english: '英語名',
                username: 'ユーザー名',
                project: 'プロジェクト名'
            };
            return types[this.nameType] || '名前';
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('nameGeneratorHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('nameGeneratorHistory', JSON.stringify(this.history));
        }
    };
}
