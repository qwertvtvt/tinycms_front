# TinyCMS フロントエンド

Webサイトのお知らせ・ブログを管理する画面です。記事の作成、編集、削除、画像アップロードが可能です。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:5173` でアクセスできます。

## 環境設定

`.env.development` でバックエンドのURLを設定してください：

```env
VITE_API_BASE=http://localhost:3000
```

## ページ一覧

- `/` - ホーム（記事一覧）
- `/login` - ログイン
- `/register` - 新規登録
- `/manager` - 管理画面
- `/add` - 記事作成
- `/edit` - 記事編集
