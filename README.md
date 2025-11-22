# 🎲 乱数ジェネレーター (Random Number Generator)

シンプルで使いやすい乱数生成PWAアプリです。

## 機能

- 🎯 指定範囲内のランダムな数字を生成
- 📊 生成履歴の保存と表示
- 📱 PWA対応（オフラインで動作可能）
- 🎨 レスポンシブデザイン
- 💾 ローカルストレージによるデータ永続化

## GitHub Pagesへのデプロイ方法

1. GitHubリポジトリの「Settings」タブを開く
2. 左サイドバーの「Pages」をクリック
3. 「Source」セクションで「Deploy from a branch」を選択
4. ブランチを選択（mainまたはmaster）してルートディレクトリ「/(root)」を選択
5. 「Save」をクリック

数分後、`https://<username>.github.io/<repository-name>/` でアプリにアクセスできます。

## ローカルでの実行

```bash
# シンプルなHTTPサーバーを起動
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開いてください。

## PWA機能

- Service Workerによるオフライン対応
- ホーム画面への追加が可能
- アプリライクな体験

## ライセンス

MIT License