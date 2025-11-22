// Service Worker登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// PWAインストールプロンプト
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');

    installPrompt.style.display = 'block';

    installBtn.addEventListener('click', () => {
        installPrompt.style.display = 'none';
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('PWAインストールが承認されました');
            }
            deferredPrompt = null;
        });
    });
});

// タブ切り替え
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // すべてのタブボタンとコンテンツから active を削除
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // クリックされたタブをアクティブに
        btn.classList.add('active');
        document.getElementById(`${targetTab}Tab`).classList.add('active');
    });
});

// アプリのメインロジック（数字生成）
const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');
const generateBtn = document.getElementById('generateBtn');
const randomNumberDisplay = document.getElementById('randomNumber');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// リスト選択の要素
const listItemsInput = document.getElementById('listItems');
const selectBtn = document.getElementById('selectBtn');
const selectedItemDisplay = document.getElementById('selectedItem');
const listHistoryList = document.getElementById('listHistoryList');
const clearListHistoryBtn = document.getElementById('clearListHistoryBtn');

// ローカルストレージから履歴を読み込む
let history = JSON.parse(localStorage.getItem('randomHistory')) || [];
let listHistory = JSON.parse(localStorage.getItem('listHistory')) || [];

// 履歴を表示
function displayHistory() {
    historyList.innerHTML = '';
    history.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.number}</span>
            <span class="time">${item.range} - ${item.time}</span>
        `;
        historyList.appendChild(li);
    });
}

// 履歴を保存
function saveHistory(number, min, max) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    history.unshift({
        number: number,
        range: `${min}-${max}`,
        time: time
    });

    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    localStorage.setItem('randomHistory', JSON.stringify(history));
    displayHistory();
}

// 乱数生成
function generateRandomNumber() {
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);

    if (isNaN(min) || isNaN(max)) {
        alert('有効な数値を入力してください');
        return;
    }

    if (min >= max) {
        alert('最小値は最大値より小さくしてください');
        return;
    }

    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    randomNumberDisplay.textContent = randomNum;
    randomNumberDisplay.style.animation = 'none';
    setTimeout(() => {
        randomNumberDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    saveHistory(randomNum, min, max);
}

// 履歴をクリア
function clearHistory() {
    if (confirm('履歴をすべて削除しますか?')) {
        history = [];
        localStorage.removeItem('randomHistory');
        displayHistory();
    }
}

// イベントリスナー
generateBtn.addEventListener('click', generateRandomNumber);
clearHistoryBtn.addEventListener('click', clearHistory);

// Enterキーで生成
minInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateRandomNumber();
});

maxInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateRandomNumber();
});

// リスト選択の履歴を表示
function displayListHistory() {
    listHistoryList.innerHTML = '';
    listHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.item}</span>
            <span class="time">${item.time}</span>
        `;
        listHistoryList.appendChild(li);
    });
}

// リスト選択の履歴を保存
function saveListHistory(item) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    listHistory.unshift({
        item: item,
        time: time
    });

    if (listHistory.length > 50) {
        listHistory = listHistory.slice(0, 50);
    }

    localStorage.setItem('listHistory', JSON.stringify(listHistory));
    displayListHistory();
}

// リストからランダム選択
function selectRandomItem() {
    const text = listItemsInput.value.trim();

    if (!text) {
        alert('リスト項目を入力してください');
        return;
    }

    const items = text.split('\n').filter(item => item.trim() !== '');

    if (items.length === 0) {
        alert('有効な項目を入力してください');
        return;
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex].trim();

    selectedItemDisplay.textContent = selectedItem;
    selectedItemDisplay.style.animation = 'none';
    setTimeout(() => {
        selectedItemDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    saveListHistory(selectedItem);
}

// リスト履歴をクリア
function clearListHistory() {
    if (confirm('履歴をすべて削除しますか?')) {
        listHistory = [];
        localStorage.removeItem('listHistory');
        displayListHistory();
    }
}

// リスト選択のイベントリスナー
selectBtn.addEventListener('click', selectRandomItem);
clearListHistoryBtn.addEventListener('click', clearListHistory);

// 初期表示
displayHistory();
displayListHistory();

// リストアイテムの保存と復元
const savedListItems = localStorage.getItem('savedListItems');
if (savedListItems) {
    listItemsInput.value = savedListItems;
}

listItemsInput.addEventListener('input', () => {
    localStorage.setItem('savedListItems', listItemsInput.value);
});
