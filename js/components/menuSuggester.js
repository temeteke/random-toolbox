function menuSuggester() {
    return {
        selectedCategory: 'all',
        minBudget: 500,
        maxBudget: 2000,
        result: null,
        animating: false,
        customItems: '',
        history: [],

        categories: {
            all: ['ラーメン', 'カレー', 'うどん', 'そば', 'パスタ', 'ピザ', 'ハンバーガー', '寿司', '天丼', '牛丼', '親子丼', '焼肉', 'とんかつ', '唐揚げ', 'ステーキ', 'オムライス', 'チャーハン', '餃子', '麻婆豆腐', '担々麺', 'サンドイッチ', 'サラダ', '刺身定食', '焼き魚定食', '生姜焼き定食'],
            japanese: ['寿司', '天丼', '牛丼', '親子丼', 'うどん', 'そば', 'とんかつ', '焼き魚定食', '刺身定食', '生姜焼き定食', 'お好み焼き', 'たこ焼き', '焼き鳥', 'おでん'],
            western: ['パスタ', 'ピザ', 'ハンバーガー', 'ステーキ', 'オムライス', 'サンドイッチ', 'サラダ', 'グラタン', 'ドリア', 'ハンバーグ'],
            chinese: ['ラーメン', 'チャーハン', '餃子', '麻婆豆腐', '担々麺', '酢豚', 'エビチリ', '青椒肉絲', '回鍋肉', '焼売'],
            fast: ['牛丼', '親子丼', 'カレー', 'ラーメン', 'うどん', 'そば', 'ハンバーガー', 'サンドイッチ'],
            healthy: ['サラダ', '刺身定食', '焼き魚定食', 'そば', 'うどん', '豆腐料理', '野菜炒め', 'スープ'],
            custom: []
        },

        init() {
            this.loadHistory();
            this.loadCustomItems();
        },

        suggest() {
            this.animating = true;

            let menuList = this.getMenuList();

            if (menuList.length === 0) {
                alert('メニューが設定されていません。カスタムカテゴリの場合は項目を入力してください。');
                this.animating = false;
                return;
            }

            setTimeout(() => {
                const randomMenu = menuList[Math.floor(Math.random() * menuList.length)];
                const estimatedBudget = Math.floor(Math.random() * (this.maxBudget - this.minBudget + 1)) + this.minBudget;

                this.result = {
                    menu: randomMenu,
                    budget: estimatedBudget
                };

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    menu: randomMenu,
                    budget: estimatedBudget,
                    category: this.getCategoryName(),
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

        getMenuList() {
            if (this.selectedCategory === 'custom') {
                return this.customItems
                    .split('\n')
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
            }
            return this.categories[this.selectedCategory] || [];
        },

        getCategoryName() {
            const names = {
                all: '全て',
                japanese: '和食',
                western: '洋食',
                chinese: '中華',
                fast: 'ファストフード',
                healthy: 'ヘルシー',
                custom: 'カスタム'
            };
            return names[this.selectedCategory] || '全て';
        },

        saveCustomItems() {
            localStorage.setItem('menuSuggesterCustom', this.customItems);
        },

        loadCustomItems() {
            const saved = localStorage.getItem('menuSuggesterCustom');
            if (saved) {
                this.customItems = saved;
            }
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('menuSuggesterHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        },

        saveHistory() {
            localStorage.setItem('menuSuggesterHistory', JSON.stringify(this.history));
        }
    };
}
