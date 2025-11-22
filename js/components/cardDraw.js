import { HistoryManager } from '../utils/HistoryManager.js';

/**
 * カードドローツールのAlpineコンポーネント
 */
export function cardDraw() {
    return {
        cardCount: 5,
        includeJoker: false,
        drawnCards: [],
        historyManager: new HistoryManager('cardHistory'),
        animating: false,

        suits: ['♠️', '♥️', '♦️', '♣️'],
        ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],

        draw() {
            const count = parseInt(this.cardCount);
            const includeJoker = this.includeJoker;

            // デッキを作成
            let deck = [];
            this.suits.forEach(suit => {
                this.ranks.forEach(rank => {
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

            this.drawnCards = deck.slice(0, count);

            // アニメーション
            this.animating = true;
            setTimeout(() => {
                this.animating = false;
            }, 500);

            // 履歴に追加
            const now = new Date();
            const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            this.historyManager.add({
                cards: this.drawnCards.join(', '),
                time: time
            });
        },

        clearHistory() {
            if (confirm('履歴をすべて削除しますか?')) {
                this.historyManager.clear();
            }
        },

        get history() {
            return this.historyManager.getRecent(10);
        },

        get displayCards() {
            return this.drawnCards.length > 0 ? this.drawnCards.join(' ') : '?';
        }
    };
}
