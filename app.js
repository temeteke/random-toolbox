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
