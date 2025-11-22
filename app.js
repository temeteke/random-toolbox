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

// ルーレットホイールを更新（プレビュー表示用）
function updateRouletteWheel() {
    const text = rouletteItemsInput.value.trim();

    if (!text) {
        // 入力がない場合はクリア
        const pointer = rouletteWheel.querySelector('.roulette-pointer');
        rouletteWheel.innerHTML = '';
        rouletteWheel.appendChild(pointer);
        return;
    }

    const items = text.split('\n').filter(item => item.trim() !== '');

    if (items.length < 2) {
        // 2項目未満の場合はクリア
        const pointer = rouletteWheel.querySelector('.roulette-pointer');
        rouletteWheel.innerHTML = '';
        rouletteWheel.appendChild(pointer);
        return;
    }

    // 既存のルーレットホイールをクリア
    const pointer = rouletteWheel.querySelector('.roulette-pointer');
    rouletteWheel.innerHTML = '';
    rouletteWheel.appendChild(pointer);

    // 新しいルーレットホイールを構築
    const wheelContainer = buildRouletteWheel(items);
    rouletteWheel.appendChild(wheelContainer);
}

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

// ルーレットホイールを構築（SVG方式）
function buildRouletteWheel(items) {
    const container = document.createElement('div');
    container.className = 'roulette-wheel-svg';

    // SVG要素を作成
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '300');

    const anglePerItem = 360 / items.length;

    // 色のパターン
    const colors = [
        ['#667eea', '#764ba2'],
        ['#f093fb', '#f5576c'],
        ['#4facfe', '#00f2fe'],
        ['#43e97b', '#38f9d7'],
        ['#fa709a', '#fee140'],
        ['#30cfd0', '#330867'],
        ['#a8edea', '#fed6e3'],
        ['#ff9a9e', '#fecfef']
    ];

    items.forEach((item, index) => {
        const startAngle = (anglePerItem * index - 90) * Math.PI / 180; // -90度で上から始める
        const endAngle = (anglePerItem * (index + 1) - 90) * Math.PI / 180;

        const cx = 100; // 中心X
        const cy = 100; // 中心Y
        const radius = 100;

        // 扇形のパスを計算
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);

        // 大きな弧かどうか（180度以上か）
        const largeArcFlag = anglePerItem > 180 ? 1 : 0;

        // グラデーション定義
        const gradientId = `gradient-${index}`;
        const defs = svg.querySelector('defs') || svg.insertBefore(
            document.createElementNS('http://www.w3.org/2000/svg', 'defs'),
            svg.firstChild
        );

        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const colorPair = colors[index % colors.length];
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', `stop-color:${colorPair[0]};stop-opacity:1`);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', `stop-color:${colorPair[1]};stop-opacity:1`);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);

        // 扇形のパス
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = `
            M ${cx} ${cy}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            Z
        `;
        path.setAttribute('d', pathData);
        path.setAttribute('fill', `url(#${gradientId})`);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '2');

        svg.appendChild(path);

        // テキストの配置
        const midAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.65; // 中心からテキストまでの距離
        const textX = cx + textRadius * Math.cos(midAngle);
        const textY = cy + textRadius * Math.sin(midAngle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('style', 'filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));');

        // テキストを回転（読みやすい向きに）
        let textAngle = (anglePerItem * index + anglePerItem / 2);
        // 下半分のテキストは180度回転させて読みやすくする
        if (textAngle > 90 && textAngle < 270) {
            textAngle += 180;
        }
        text.setAttribute('transform', `rotate(${textAngle} ${textX} ${textY})`);

        // 長いテキストを折り返し
        if (item.length > 8) {
            const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan1.setAttribute('x', textX);
            tspan1.setAttribute('dy', '-0.6em');
            tspan1.textContent = item.substring(0, 8);

            const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan2.setAttribute('x', textX);
            tspan2.setAttribute('dy', '1.2em');
            tspan2.textContent = item.substring(8, 16);

            text.appendChild(tspan1);
            text.appendChild(tspan2);
        } else {
            text.textContent = item;
        }

        svg.appendChild(text);
    });

    // 中央の円を追加
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', '100');
    centerCircle.setAttribute('cy', '100');
    centerCircle.setAttribute('r', '20');
    centerCircle.setAttribute('fill', '#667eea');
    centerCircle.setAttribute('stroke', 'white');
    centerCircle.setAttribute('stroke-width', '3');
    centerCircle.setAttribute('class', 'roulette-center');

    svg.appendChild(centerCircle);

    // 中央のアイコン
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', '100');
    centerText.setAttribute('y', '100');
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('dominant-baseline', 'middle');
    centerText.setAttribute('font-size', '20');
    centerText.textContent = '🎰';

    svg.appendChild(centerText);

    container.appendChild(svg);
    return container;
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

    // ルーレットホイールを更新
    updateRouletteWheel();
    const wheelContainer = rouletteWheel.querySelector('.roulette-wheel-svg');

    // ランダムに当選者を選択
    const winnerIndex = Math.floor(Math.random() * items.length);
    const winner = items[winnerIndex];

    // 回転角度を計算
    const anglePerItem = 360 / items.length;
    const baseRotation = 1800; // 5回転
    // ポインターが上部（12時の位置）にあるため、当選項目を上部に合わせる
    const targetAngle = baseRotation + (360 - (winnerIndex * anglePerItem + anglePerItem / 2));

    // イージング関数：easeOutCubic（滑らかな減速）
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // アニメーション設定
    const duration = 4000; // 4秒
    const startTime = performance.now();
    let animationFrameId = null;

    // requestAnimationFrameを使った時間ベースのアニメーション
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0〜1の進捗率

        // イージングを適用
        const eased = easeOutCubic(progress);
        const currentAngle = targetAngle * eased;

        // 回転を適用
        wheelContainer.style.transform = `rotate(${currentAngle}deg)`;

        // アニメーション継続判定
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // アニメーション完了時の処理
            wheelContainer.style.transform = `rotate(${targetAngle}deg)`;

            // 中央の円をアニメーション
            const center = wheelContainer.querySelector('.roulette-center');
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
    }

    // アニメーション開始
    animationFrameId = requestAnimationFrame(animate);
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
    updateRouletteWheel(); // リアルタイムでルーレットを更新
});

// 初期表示
displayRouletteHistory();
updateRouletteWheel(); // 保存されている項目がある場合はルーレットを表示

// ==================== サイコロ機能 ====================
const diceCountInput = document.getElementById('diceCount');
const diceSidesSelect = document.getElementById('diceSides');
const rollDiceBtn = document.getElementById('rollDiceBtn');
const diceValuesDisplay = document.getElementById('diceValues');
const diceTotalDisplay = document.getElementById('diceTotal');
const diceHistoryList = document.getElementById('diceHistoryList');
const clearDiceHistoryBtn = document.getElementById('clearDiceHistoryBtn');

let diceHistory = JSON.parse(localStorage.getItem('diceHistory')) || [];

function displayDiceHistory() {
    diceHistoryList.innerHTML = '';
    diceHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.result}</span>
            <span class="time">${item.config} - ${item.time}</span>
        `;
        diceHistoryList.appendChild(li);
    });
}

function saveDiceHistory(values, total, config) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    diceHistory.unshift({
        result: `[${values.join(', ')}] = ${total}`,
        config: config,
        time: time
    });

    if (diceHistory.length > 50) {
        diceHistory = diceHistory.slice(0, 50);
    }

    localStorage.setItem('diceHistory', JSON.stringify(diceHistory));
    displayDiceHistory();
}

function rollDice() {
    const count = parseInt(diceCountInput.value);
    const sides = parseInt(diceSidesSelect.value);

    if (count < 1 || count > 10) {
        alert('サイコロの数は1〜10の範囲で指定してください');
        return;
    }

    const values = [];
    for (let i = 0; i < count; i++) {
        values.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = values.reduce((sum, val) => sum + val, 0);

    diceValuesDisplay.textContent = values.join(' + ');
    diceTotalDisplay.textContent = `合計: ${total}`;

    diceValuesDisplay.style.animation = 'none';
    setTimeout(() => {
        diceValuesDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    saveDiceHistory(values, total, `${count}D${sides}`);
}

rollDiceBtn.addEventListener('click', rollDice);
clearDiceHistoryBtn.addEventListener('click', () => {
    if (confirm('履歴をすべて削除しますか?')) {
        diceHistory = [];
        localStorage.removeItem('diceHistory');
        displayDiceHistory();
    }
});

displayDiceHistory();

// ==================== カードドロー機能 ====================
const cardCountInput = document.getElementById('cardCount');
const includeJokerCheckbox = document.getElementById('includeJoker');
const drawCardBtn = document.getElementById('drawCardBtn');
const drawnCardsDisplay = document.getElementById('drawnCards');
const cardHistoryList = document.getElementById('cardHistoryList');
const clearCardHistoryBtn = document.getElementById('clearCardHistoryBtn');

let cardHistory = JSON.parse(localStorage.getItem('cardHistory')) || [];

const suits = ['♠️', '♥️', '♦️', '♣️'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function displayCardHistory() {
    cardHistoryList.innerHTML = '';
    cardHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.cards}</span>
            <span class="time">${item.time}</span>
        `;
        cardHistoryList.appendChild(li);
    });
}

function saveCardHistory(cards) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    cardHistory.unshift({
        cards: cards.join(', '),
        time: time
    });

    if (cardHistory.length > 50) {
        cardHistory = cardHistory.slice(0, 50);
    }

    localStorage.setItem('cardHistory', JSON.stringify(cardHistory));
    displayCardHistory();
}

function drawCards() {
    const count = parseInt(cardCountInput.value);
    const includeJoker = includeJokerCheckbox.checked;

    let deck = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push(`${suit}${rank}`);
        });
    });

    if (includeJoker) {
        deck.push('🃏');
        deck.push('🃏');
    }

    const maxCards = includeJoker ? 54 : 52;
    if (count < 1 || count > maxCards) {
        alert(`引く枚数は1〜${maxCards}の範囲で指定してください`);
        return;
    }

    // シャッフル
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const drawnCards = deck.slice(0, count);

    drawnCardsDisplay.textContent = drawnCards.join(' ');
    drawnCardsDisplay.style.animation = 'none';
    setTimeout(() => {
        drawnCardsDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    saveCardHistory(drawnCards);
}

drawCardBtn.addEventListener('click', drawCards);
clearCardHistoryBtn.addEventListener('click', () => {
    if (confirm('履歴をすべて削除しますか?')) {
        cardHistory = [];
        localStorage.removeItem('cardHistory');
        displayCardHistory();
    }
});

displayCardHistory();

// ==================== カラー生成機能 ====================
const colorTypeSelect = document.getElementById('colorType');
const generateColorBtn = document.getElementById('generateColorBtn');
const colorDisplay = document.getElementById('colorDisplay');
const colorHistoryList = document.getElementById('colorHistoryList');
const clearColorHistoryBtn = document.getElementById('clearColorHistoryBtn');

let colorHistory = JSON.parse(localStorage.getItem('colorHistory')) || [];

function displayColorHistory() {
    colorHistoryList.innerHTML = '';
    colorHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.className = 'color-history-item';

        if (item.type === 'single') {
            li.innerHTML = `
                <div class="color-box" style="background: ${item.color};" title="${item.color}"></div>
                <span class="number">${item.color}</span>
                <button class="copy-color-btn" data-color="${item.color}">📋</button>
            `;
        } else {
            const boxes = item.colors.map(c =>
                `<div class="color-box-small" style="background: ${c};" title="${c}"></div>`
            ).join('');
            li.innerHTML = `
                <div class="color-palette-small">${boxes}</div>
                <span class="time">${item.time}</span>
            `;
        }

        colorHistoryList.appendChild(li);
    });

    // コピーボタンのイベントリスナー
    document.querySelectorAll('.copy-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            navigator.clipboard.writeText(color);
            btn.textContent = '✓';
            setTimeout(() => btn.textContent = '📋', 1000);
        });
    });
}

function saveColorHistory(type, color, colors) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    if (type === 'single') {
        colorHistory.unshift({
            type: 'single',
            color: color,
            time: time
        });
    } else {
        colorHistory.unshift({
            type: 'palette',
            colors: colors,
            time: time
        });
    }

    if (colorHistory.length > 50) {
        colorHistory = colorHistory.slice(0, 50);
    }

    localStorage.setItem('colorHistory', JSON.stringify(colorHistory));
    displayColorHistory();
}

function randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function generateHarmoniousPalette(baseColor) {
    const rgb = hexToRgb(baseColor);
    const colors = [baseColor];

    // Analogous colors (類似色)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    for (let i = 1; i <= 4; i++) {
        const newHue = (hsl.h + (i * 30)) % 360;
        const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }

    return colors;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: h * 360, s: s, l: l };
}

function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function generateColor() {
    const type = colorTypeSelect.value;

    if (type === 'single') {
        const color = randomColor();
        const rgb = hexToRgb(color);

        colorDisplay.innerHTML = `
            <div class="color-preview" style="background: ${color};"></div>
            <div class="color-info">
                <div class="color-code">
                    <strong>HEX:</strong> ${color}
                    <button class="copy-btn-inline" data-copy="${color}">📋</button>
                </div>
                <div class="color-code">
                    <strong>RGB:</strong> rgb(${rgb.r}, ${rgb.g}, ${rgb.b})
                    <button class="copy-btn-inline" data-copy="rgb(${rgb.r}, ${rgb.g}, ${rgb.b})">📋</button>
                </div>
            </div>
        `;

        saveColorHistory('single', color, null);
    } else {
        const baseColor = randomColor();
        const colors = generateHarmoniousPalette(baseColor);

        const boxes = colors.map(c =>
            `<div class="color-palette-item">
                <div class="color-preview-small" style="background: ${c};"></div>
                <div class="color-code-small">${c}</div>
                <button class="copy-btn-inline" data-copy="${c}">📋</button>
            </div>`
        ).join('');

        colorDisplay.innerHTML = `<div class="color-palette">${boxes}</div>`;

        saveColorHistory('palette', null, colors);
    }

    // コピーボタンのイベントリスナー
    document.querySelectorAll('.copy-btn-inline').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(text);
            btn.textContent = '✓';
            setTimeout(() => btn.textContent = '📋', 1000);
        });
    });

    colorDisplay.style.animation = 'none';
    setTimeout(() => {
        colorDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

generateColorBtn.addEventListener('click', generateColor);
clearColorHistoryBtn.addEventListener('click', () => {
    if (confirm('お気に入りをすべて削除しますか?')) {
        colorHistory = [];
        localStorage.removeItem('colorHistory');
        displayColorHistory();
    }
});

displayColorHistory();

// ==================== 日付ランダマイザー機能 ====================
const dateStartInput = document.getElementById('dateStart');
const dateEndInput = document.getElementById('dateEnd');
const generateDateBtn = document.getElementById('generateDateBtn');
const randomDateDisplay = document.getElementById('randomDate');
const dateHistoryList = document.getElementById('dateHistoryList');
const clearDateHistoryBtn = document.getElementById('clearDateHistoryBtn');

let dateHistory = JSON.parse(localStorage.getItem('dateHistory')) || [];

// デフォルトの日付を設定（今日から1年後）
const today = new Date();
const oneYearLater = new Date(today);
oneYearLater.setFullYear(today.getFullYear() + 1);

dateStartInput.valueAsDate = today;
dateEndInput.valueAsDate = oneYearLater;

function displayDateHistory() {
    dateHistoryList.innerHTML = '';
    dateHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.date}</span>
            <span class="time">${item.time}</span>
        `;
        dateHistoryList.appendChild(li);
    });
}

function saveDateHistory(dateStr) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    dateHistory.unshift({
        date: dateStr,
        time: time
    });

    if (dateHistory.length > 50) {
        dateHistory = dateHistory.slice(0, 50);
    }

    localStorage.setItem('dateHistory', JSON.stringify(dateHistory));
    displayDateHistory();
}

function generateRandomDate() {
    const startDate = new Date(dateStartInput.value);
    const endDate = new Date(dateEndInput.value);

    if (!dateStartInput.value || !dateEndInput.value) {
        alert('開始日と終了日を入力してください');
        return;
    }

    if (startDate >= endDate) {
        alert('開始日は終了日より前にしてください');
        return;
    }

    // 選択された曜日を取得
    const selectedDays = Array.from(document.querySelectorAll('.dayFilter:checked')).map(cb => parseInt(cb.value));

    if (selectedDays.length === 0) {
        alert('少なくとも1つの曜日を選択してください');
        return;
    }

    // 選択された曜日の日付のみを収集
    const validDates = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        if (selectedDays.includes(current.getDay())) {
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

    randomDateDisplay.textContent = dateStr;
    randomDateDisplay.style.animation = 'none';
    setTimeout(() => {
        randomDateDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    saveDateHistory(dateStr);
}

generateDateBtn.addEventListener('click', generateRandomDate);
clearDateHistoryBtn.addEventListener('click', () => {
    if (confirm('履歴をすべて削除しますか?')) {
        dateHistory = [];
        localStorage.removeItem('dateHistory');
        displayDateHistory();
    }
});

displayDateHistory();

// ==================== パスワード生成器機能 ====================
const passwordLengthSlider = document.getElementById('passwordLength');
const passwordLengthValue = document.getElementById('passwordLengthValue');
const includeUppercaseCheckbox = document.getElementById('includeUppercase');
const includeLowercaseCheckbox = document.getElementById('includeLowercase');
const includeNumbersCheckbox = document.getElementById('includeNumbers');
const includeSymbolsCheckbox = document.getElementById('includeSymbols');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const generatedPasswordDisplay = document.getElementById('generatedPassword');
const copyPasswordBtn = document.getElementById('copyPasswordBtn');
const passwordStrengthDisplay = document.getElementById('passwordStrength');
const passwordHistoryList = document.getElementById('passwordHistoryList');
const clearPasswordHistoryBtn = document.getElementById('clearPasswordHistoryBtn');

let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

passwordLengthSlider.addEventListener('input', () => {
    passwordLengthValue.textContent = passwordLengthSlider.value;
});

function displayPasswordHistory() {
    passwordHistoryList.innerHTML = '';
    passwordHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number" style="font-family: monospace;">${item.password}</span>
            <span class="time">${item.config} - ${item.time}</span>
        `;
        passwordHistoryList.appendChild(li);
    });
}

function savePasswordHistory(password, config) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    passwordHistory.unshift({
        password: password,
        config: config,
        time: time
    });

    if (passwordHistory.length > 50) {
        passwordHistory = passwordHistory.slice(0, 50);
    }

    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    displayPasswordHistory();
}

function calculatePasswordStrength(password, charTypes) {
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
}

function generatePassword() {
    const length = parseInt(passwordLengthSlider.value);
    const useUppercase = includeUppercaseCheckbox.checked;
    const useLowercase = includeLowercaseCheckbox.checked;
    const useNumbers = includeNumbersCheckbox.checked;
    const useSymbols = includeSymbolsCheckbox.checked;

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

    generatedPasswordDisplay.textContent = password;
    generatedPasswordDisplay.style.fontFamily = 'monospace';
    generatedPasswordDisplay.style.fontSize = '1.5em';
    generatedPasswordDisplay.style.wordBreak = 'break-all';

    copyPasswordBtn.style.display = 'inline-block';

    // 強度を計算
    const strength = calculatePasswordStrength(password, charTypes);
    passwordStrengthDisplay.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill" style="width: ${(strength.strength / 6) * 100}%; background: ${strength.color};"></div>
        </div>
        <div class="strength-label" style="color: ${strength.color};">強度: ${strength.label}</div>
    `;

    generatedPasswordDisplay.style.animation = 'none';
    setTimeout(() => {
        generatedPasswordDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    const config = `${length}文字 ${useUppercase ? 'A-Z' : ''}${useLowercase ? 'a-z' : ''}${useNumbers ? '0-9' : ''}${useSymbols ? '記号' : ''}`;
    savePasswordHistory(password, config);
}

copyPasswordBtn.addEventListener('click', () => {
    const password = generatedPasswordDisplay.textContent;
    navigator.clipboard.writeText(password);
    copyPasswordBtn.textContent = '✓ コピーしました';
    setTimeout(() => {
        copyPasswordBtn.textContent = '📋 コピー';
    }, 2000);
});

generatePasswordBtn.addEventListener('click', generatePassword);
clearPasswordHistoryBtn.addEventListener('click', () => {
    if (confirm('履歴をすべて削除しますか?')) {
        passwordHistory = [];
        localStorage.removeItem('passwordHistory');
        displayPasswordHistory();
    }
});

displayPasswordHistory();

// ==================== 決定ツール機能 ====================
const decisionOptionsInput = document.getElementById('decisionOptions');
const makeDecisionBtn = document.getElementById('makeDecisionBtn');
const decisionAnswerDisplay = document.getElementById('decisionAnswer');
const decisionHistoryList = document.getElementById('decisionHistoryList');
const clearDecisionHistoryBtn = document.getElementById('clearDecisionHistoryBtn');

let decisionHistory = JSON.parse(localStorage.getItem('decisionHistory')) || [];

// 保存された選択肢を復元
const savedDecisionOptions = localStorage.getItem('savedDecisionOptions');
if (savedDecisionOptions) {
    decisionOptionsInput.value = savedDecisionOptions;
} else {
    decisionOptionsInput.value = 'はい\nいいえ';
}

decisionOptionsInput.addEventListener('input', () => {
    localStorage.setItem('savedDecisionOptions', decisionOptionsInput.value);
});

function displayDecisionHistory() {
    decisionHistoryList.innerHTML = '';
    decisionHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.decision}</span>
            <span class="time">${item.options} - ${item.time}</span>
        `;
        decisionHistoryList.appendChild(li);
    });
}

function saveDecisionHistory(decision, options) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    decisionHistory.unshift({
        decision: decision,
        options: options,
        time: time
    });

    if (decisionHistory.length > 50) {
        decisionHistory = decisionHistory.slice(0, 50);
    }

    localStorage.setItem('decisionHistory', JSON.stringify(decisionHistory));
    displayDecisionHistory();
}

function makeDecision() {
    const text = decisionOptionsInput.value.trim();

    if (!text) {
        alert('選択肢を入力してください');
        return;
    }

    const options = text.split('\n').filter(opt => opt.trim() !== '');

    if (options.length < 2 || options.length > 5) {
        alert('選択肢は2〜5個の範囲で入力してください');
        return;
    }

    const randomIndex = Math.floor(Math.random() * options.length);
    const decision = options[randomIndex].trim();

    decisionAnswerDisplay.textContent = decision;
    decisionAnswerDisplay.style.animation = 'none';
    setTimeout(() => {
        decisionAnswerDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    saveDecisionHistory(decision, options.join('/'));
}

makeDecisionBtn.addEventListener('click', makeDecision);
clearDecisionHistoryBtn.addEventListener('click', () => {
    if (confirm('履歴をすべて削除しますか?')) {
        decisionHistory = [];
        localStorage.removeItem('decisionHistory');
        displayDecisionHistory();
    }
});

displayDecisionHistory();

// ==================== シャッフラー機能 ====================
const shuffleItemsInput = document.getElementById('shuffleItems');
const groupCountInput = document.getElementById('groupCount');
const shuffleBtn = document.getElementById('shuffleBtn');
const shuffledListDisplay = document.getElementById('shuffledList');
const shuffleHistoryList = document.getElementById('shuffleHistoryList');
const clearShuffleHistoryBtn = document.getElementById('clearShuffleHistoryBtn');

let shuffleHistory = JSON.parse(localStorage.getItem('shuffleHistory')) || [];

// 保存された項目を復元
const savedShuffleItems = localStorage.getItem('savedShuffleItems');
if (savedShuffleItems) {
    shuffleItemsInput.value = savedShuffleItems;
}

shuffleItemsInput.addEventListener('input', () => {
    localStorage.setItem('savedShuffleItems', shuffleItemsInput.value);
});

function displayShuffleHistory() {
    shuffleHistoryList.innerHTML = '';
    shuffleHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.result}</span>
            <span class="time">${item.config} - ${item.time}</span>
        `;
        shuffleHistoryList.appendChild(li);
    });
}

function saveShuffleHistory(result, config) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    shuffleHistory.unshift({
        result: result,
        config: config,
        time: time
    });

    if (shuffleHistory.length > 50) {
        shuffleHistory = shuffleHistory.slice(0, 50);
    }

    localStorage.setItem('shuffleHistory', JSON.stringify(shuffleHistory));
    displayShuffleHistory();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleList() {
    const text = shuffleItemsInput.value.trim();

    if (!text) {
        alert('シャッフルするリストを入力してください');
        return;
    }

    const items = text.split('\n').filter(item => item.trim() !== '');

    if (items.length === 0) {
        alert('有効な項目を入力してください');
        return;
    }

    const groupCount = parseInt(groupCountInput.value);

    const shuffled = shuffleArray(items);

    if (groupCount === 0 || groupCount === 1) {
        // グループ分けなし
        const html = shuffled.map((item, index) =>
            `<div class="shuffled-item">${index + 1}. ${item}</div>`
        ).join('');

        shuffledListDisplay.innerHTML = html;
        saveShuffleHistory(shuffled.slice(0, 3).join(', ') + '...', `${items.length}項目`);
    } else {
        // グループ分け
        if (groupCount > items.length) {
            alert('グループ数は項目数以下にしてください');
            return;
        }

        const groups = Array.from({ length: groupCount }, () => []);
        shuffled.forEach((item, index) => {
            groups[index % groupCount].push(item);
        });

        const html = groups.map((group, gIndex) =>
            `<div class="shuffle-group">
                <div class="group-title">グループ ${gIndex + 1}</div>
                ${group.map(item => `<div class="shuffled-item">• ${item}</div>`).join('')}
            </div>`
        ).join('');

        shuffledListDisplay.innerHTML = html;
        saveShuffleHistory(`${groupCount}グループに分割`, `${items.length}項目`);
    }

    shuffledListDisplay.style.animation = 'none';
    setTimeout(() => {
        shuffledListDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

shuffleBtn.addEventListener('click', shuffleList);
clearShuffleHistoryBtn.addEventListener('click', () => {
    if (confirm('履歴をすべて削除しますか?')) {
        shuffleHistory = [];
        localStorage.removeItem('shuffleHistory');
        displayShuffleHistory();
    }
});

displayShuffleHistory();

// ==================== 抽選ボックス機能 ====================
const lotteryItemsInput = document.getElementById('lotteryItems');
const startLotteryBtn = document.getElementById('startLotteryBtn');
const drawLotteryBtn = document.getElementById('drawLotteryBtn');
const resetLotteryBtn = document.getElementById('resetLotteryBtn');
const lotteryResult = document.getElementById('lotteryResult');
const lotteryWinnerDisplay = document.getElementById('lotteryWinner');
const lotteryRemainingDisplay = document.getElementById('lotteryRemaining');
const lotteryHistoryList = document.getElementById('lotteryHistoryList');
const clearLotteryHistoryBtn = document.getElementById('clearLotteryHistoryBtn');

let lotteryHistory = JSON.parse(localStorage.getItem('lotteryHistory')) || [];
let lotteryPool = [];
let lotteryDrawnItems = [];

// 保存された項目を復元
const savedLotteryItems = localStorage.getItem('savedLotteryItems');
if (savedLotteryItems) {
    lotteryItemsInput.value = savedLotteryItems;
}

lotteryItemsInput.addEventListener('input', () => {
    localStorage.setItem('savedLotteryItems', lotteryItemsInput.value);
});

function displayLotteryHistory() {
    lotteryHistoryList.innerHTML = '';
    lotteryHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="number">${item.winner}</span>
            <span class="time">${item.order} - ${item.time}</span>
        `;
        lotteryHistoryList.appendChild(li);
    });
}

function saveLotteryHistory(winner, order) {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    lotteryHistory.unshift({
        winner: winner,
        order: order,
        time: time
    });

    if (lotteryHistory.length > 50) {
        lotteryHistory = lotteryHistory.slice(0, 50);
    }

    localStorage.setItem('lotteryHistory', JSON.stringify(lotteryHistory));
    displayLotteryHistory();
}

function startLottery() {
    const text = lotteryItemsInput.value.trim();

    if (!text) {
        alert('抽選項目を入力してください');
        return;
    }

    const items = text.split('\n').filter(item => item.trim() !== '');

    if (items.length === 0) {
        alert('有効な項目を入力してください');
        return;
    }

    lotteryPool = [...items];
    lotteryDrawnItems = [];

    startLotteryBtn.style.display = 'none';
    drawLotteryBtn.style.display = 'block';
    resetLotteryBtn.style.display = 'inline-block';
    lotteryResult.style.display = 'none';

    lotteryItemsInput.disabled = true;

    alert(`抽選を開始します！全${lotteryPool.length}項目`);
}

function drawLottery() {
    if (lotteryPool.length === 0) {
        alert('すべての項目が引かれました！');
        return;
    }

    const randomIndex = Math.floor(Math.random() * lotteryPool.length);
    const winner = lotteryPool[randomIndex];

    lotteryPool.splice(randomIndex, 1);
    lotteryDrawnItems.push(winner);

    lotteryWinnerDisplay.textContent = winner;
    lotteryRemainingDisplay.textContent = `残り: ${lotteryPool.length}項目`;

    lotteryResult.style.display = 'block';
    lotteryWinnerDisplay.style.animation = 'none';
    setTimeout(() => {
        lotteryWinnerDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);

    saveLotteryHistory(winner, `${lotteryDrawnItems.length}番目`);

    if (lotteryPool.length === 0) {
        drawLotteryBtn.textContent = '🎊 完了！';
        drawLotteryBtn.disabled = true;
    }
}

function resetLottery() {
    lotteryPool = [];
    lotteryDrawnItems = [];

    startLotteryBtn.style.display = 'block';
    drawLotteryBtn.style.display = 'none';
    drawLotteryBtn.disabled = false;
    drawLotteryBtn.textContent = '🎁 次を引く';
    resetLotteryBtn.style.display = 'none';
    lotteryResult.style.display = 'none';

    lotteryItemsInput.disabled = false;
}

startLotteryBtn.addEventListener('click', startLottery);
drawLotteryBtn.addEventListener('click', drawLottery);
resetLotteryBtn.addEventListener('click', resetLottery);
clearLotteryHistoryBtn.addEventListener('click', () => {
    if (confirm('履歴をすべて削除しますか?')) {
        lotteryHistory = [];
        localStorage.removeItem('lotteryHistory');
        displayLotteryHistory();
    }
});

displayLotteryHistory();
