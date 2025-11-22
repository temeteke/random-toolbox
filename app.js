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

// ルーレット機能
const rouletteItemsInput = document.getElementById('rouletteItems');
const spinBtn = document.getElementById('spinBtn');
const rouletteWheel = document.getElementById('rouletteWheel');
const rouletteResult = document.getElementById('rouletteResult');
const rouletteWinner = document.getElementById('rouletteWinner');
const rouletteHistoryList = document.getElementById('rouletteHistoryList');
const clearRouletteHistoryBtn = document.getElementById('clearRouletteHistoryBtn');

let rouletteHistory = JSON.parse(localStorage.getItem('rouletteHistory')) || [];
let isSpinning = false;

// ルーレット履歴を表示
function displayRouletteHistory() {
    rouletteHistoryList.innerHTML = '';
    rouletteHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.item}</span>
            <span class="time">${item.time}</span>
        `;
        rouletteHistoryList.appendChild(li);
    });
}

// ルーレット履歴を保存
function saveRouletteHistory(item) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    rouletteHistory.unshift({
        item: item,
        time: time
    });

    if (rouletteHistory.length > 50) {
        rouletteHistory = rouletteHistory.slice(0, 50);
    }

    localStorage.setItem('rouletteHistory', JSON.stringify(rouletteHistory));
    displayRouletteHistory();
}

// ルーレットホイールを構築
function buildRouletteWheel(items) {
    const wheel = document.createElement('div');
    const anglePerItem = 360 / items.length;

    items.forEach((item, index) => {
        const segment = document.createElement('div');
        segment.className = 'roulette-item';

        const angle = anglePerItem * index;
        const rotation = angle + (anglePerItem / 2);

        // セグメントの形を計算（扇形）
        const x1 = 50 + 50 * Math.cos((angle * Math.PI) / 180);
        const y1 = 50 + 50 * Math.sin((angle * Math.PI) / 180);
        const x2 = 50 + 50 * Math.cos(((angle + anglePerItem) * Math.PI) / 180);
        const y2 = 50 + 50 * Math.sin(((angle + anglePerItem) * Math.PI) / 180);

        segment.style.clipPath = `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;

        const content = document.createElement('div');
        content.className = 'roulette-item-content';
        content.textContent = item;
        content.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

        segment.appendChild(content);
        wheel.appendChild(segment);
    });

    // 中央の円を追加
    const center = document.createElement('div');
    center.className = 'roulette-center';
    center.textContent = '🎰';
    wheel.appendChild(center);

    return wheel;
}

// ルーレットを回す
function spinRoulette() {
    if (isSpinning) return;

    const text = rouletteItemsInput.value.trim();

    if (!text) {
        alert('ルーレット項目を入力してください');
        return;
    }

    const items = text.split('\n').filter(item => item.trim() !== '');

    if (items.length === 0) {
        alert('有効な項目を入力してください');
        return;
    }

    if (items.length < 2) {
        alert('最低2つの項目を入力してください');
        return;
    }

    isSpinning = true;
    rouletteResult.style.display = 'none';

    // 既存のルーレットホイールをクリア
    const pointer = rouletteWheel.querySelector('.roulette-pointer');
    rouletteWheel.innerHTML = '';
    rouletteWheel.appendChild(pointer);

    const wheel = buildRouletteWheel(items);
    rouletteWheel.appendChild(wheel);

    // ランダムに当選者を選択
    const winnerIndex = Math.floor(Math.random() * items.length);
    const winner = items[winnerIndex];

    // 回転角度を計算
    const anglePerItem = 360 / items.length;
    const baseRotation = 1800; // 5回転
    const targetAngle = baseRotation + (360 - (winnerIndex * anglePerItem)); // 上部のポインタに合わせる

    // 回転アニメーション
    let currentRotation = 0;
    let velocity = 0;
    const maxVelocity = 30;
    const acceleration = 1.5;
    const friction = 0.98;

    const spinInterval = setInterval(() => {
        // 加速フェーズ
        if (currentRotation < baseRotation / 2 && velocity < maxVelocity) {
            velocity += acceleration;
        } else {
            velocity *= friction;
        }

        currentRotation += velocity;

        // イージングを適用した回転
        let rotation = currentRotation;
        if (currentRotation >= targetAngle - 180) {
            // 減速して正確に停止
            const remaining = targetAngle - currentRotation;
            rotation = currentRotation + remaining * 0.1;
            currentRotation = rotation;
        }

        rouletteWheel.style.transform = `rotate(${rotation}deg)`;

        // 停止条件
        if (currentRotation >= targetAngle - 1 && velocity < 0.5) {
            clearInterval(spinInterval);
            rouletteWheel.style.transform = `rotate(${targetAngle}deg)`;

            // 中央の円をアニメーション
            const center = rouletteWheel.querySelector('.roulette-center');
            if (center) {
                center.classList.add('winner');
            }

            // 結果を表示
            setTimeout(() => {
                rouletteWinner.textContent = winner;
                rouletteResult.style.display = 'block';
                rouletteWinner.style.animation = 'none';
                setTimeout(() => {
                    rouletteWinner.style.animation = 'fadeIn 0.5s ease-in';
                }, 10);

                saveRouletteHistory(winner);
                isSpinning = false;

                // アニメーションを停止
                setTimeout(() => {
                    if (center) {
                        center.classList.remove('winner');
                    }
                }, 2000);
            }, 500);
        }
    }, 16); // 約60fps
}

// ルーレット履歴をクリア
function clearRouletteHistory() {
    if (confirm('履歴をすべて削除しますか?')) {
        rouletteHistory = [];
        localStorage.removeItem('rouletteHistory');
        displayRouletteHistory();
    }
}

// ルーレットのイベントリスナー
spinBtn.addEventListener('click', spinRoulette);
clearRouletteHistoryBtn.addEventListener('click', clearRouletteHistory);

// ルーレットアイテムの保存と復元
const savedRouletteItems = localStorage.getItem('savedRouletteItems');
if (savedRouletteItems) {
    rouletteItemsInput.value = savedRouletteItems;
}

rouletteItemsInput.addEventListener('input', () => {
    localStorage.setItem('savedRouletteItems', rouletteItemsInput.value);
});

// 初期表示
displayRouletteHistory();
