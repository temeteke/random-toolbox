function taskPicker() {
    return {
        tasks: '',
        priorities: 'all',
        result: null,
        animating: false,
        history: [],
        completedTasks: [],

        init() {
            this.loadHistory();
            this.loadTasks();
        },

        pick() {
            const taskList = this.getFilteredTasks();

            if (taskList.length === 0) {
                alert('タスクを入力してください。\n例:\n買い物に行く:高\nレポートを書く:中\nメールを返信:低');
                return;
            }

            this.animating = true;

            setTimeout(() => {
                const randomTask = taskList[Math.floor(Math.random() * taskList.length)];

                this.result = randomTask;

                // 履歴に追加
                const historyItem = {
                    id: Date.now(),
                    task: randomTask.name,
                    priority: randomTask.priority,
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

        parseTasks() {
            const lines = this.tasks
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            return lines.map((line, index) => {
                // 形式: "タスク名:優先度" または "タスク名" (デフォルト優先度: 中)
                const parts = line.split(':');
                const name = parts[0].trim();
                let priority = parts.length > 1 ? parts[1].trim() : '中';

                // 優先度の正規化
                if (['高', 'high', 'h'].includes(priority.toLowerCase())) {
                    priority = '高';
                } else if (['中', 'medium', 'm', 'mid'].includes(priority.toLowerCase())) {
                    priority = '中';
                } else if (['低', 'low', 'l'].includes(priority.toLowerCase())) {
                    priority = '低';
                } else {
                    priority = '中';
                }

                return { id: index, name, priority };
            });
        },

        getFilteredTasks() {
            const allTasks = this.parseTasks();
            const available = allTasks.filter(task =>
                !this.completedTasks.includes(task.name)
            );

            if (this.priorities === 'all') {
                return available;
            }

            return available.filter(task => {
                if (this.priorities === 'high') return task.priority === '高';
                if (this.priorities === 'medium') return task.priority === '中';
                if (this.priorities === 'low') return task.priority === '低';
                return true;
            });
        },

        markComplete() {
            if (!this.result) return;

            if (confirm(`「${this.result.name}」を完了にしますか？`)) {
                this.completedTasks.push(this.result.name);
                this.saveCompletedTasks();
                this.result = null;
            }
        },

        resetCompleted() {
            if (confirm('完了タスクをリセットしますか？')) {
                this.completedTasks = [];
                this.saveCompletedTasks();
            }
        },

        getPriorityColor(priority) {
            switch (priority) {
                case '高': return '#f44336';
                case '中': return '#ff9800';
                case '低': return '#4caf50';
                default: return '#999';
            }
        },

        getPriorityEmoji(priority) {
            switch (priority) {
                case '高': return '🔴';
                case '中': return '🟡';
                case '低': return '🟢';
                default: return '⚪';
            }
        },

        saveTasks() {
            localStorage.setItem('taskPickerTasks', this.tasks);
        },

        loadTasks() {
            const saved = localStorage.getItem('taskPickerTasks');
            if (saved) {
                this.tasks = saved;
            } else {
                this.tasks = '買い物に行く:高\nレポートを書く:中\nメールを返信:低';
            }
        },

        saveCompletedTasks() {
            localStorage.setItem('taskPickerCompleted', JSON.stringify(this.completedTasks));
        },

        loadCompletedTasks() {
            const saved = localStorage.getItem('taskPickerCompleted');
            if (saved) {
                this.completedTasks = JSON.parse(saved);
            }
        },

        clearHistory() {
            if (confirm('履歴をクリアしますか？')) {
                this.history = [];
                this.saveHistory();
            }
        },

        loadHistory() {
            const saved = localStorage.getItem('taskPickerHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
            this.loadCompletedTasks();
        },

        saveHistory() {
            localStorage.setItem('taskPickerHistory', JSON.stringify(this.history));
        }
    };
}
