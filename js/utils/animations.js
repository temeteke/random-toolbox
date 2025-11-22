/**
 * アニメーション関連のユーティリティ関数
 */

/**
 * 要素にアニメーションクラスを追加し、アニメーション終了後に削除
 */
export function animateElement(element, animationClass, duration = 600) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
            resolve();
        }, duration);
    });
}

/**
 * フェードインアニメーション
 */
export function fadeIn(element, duration = 600) {
    return animateElement(element, 'fade-in', duration);
}

/**
 * スライドインアニメーション
 */
export function slideIn(element, duration = 600) {
    return animateElement(element, 'slide-in', duration);
}

/**
 * パルスアニメーション
 */
export function pulse(element, duration = 600) {
    return animateElement(element, 'pulse', duration);
}

/**
 * クリップボードにコピー
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * ランダムな整数を生成
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 配列をシャッフル（Fisher-Yatesアルゴリズム）
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
