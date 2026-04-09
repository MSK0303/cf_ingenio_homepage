# CF Ingenio Junior ホームページ

GitHub Pages向けの静的サイトです。

## ファイル構成

- `index.html` : ページ本体
- `styles.css` : デザイン
- `script.js` : メニュー制御とスクロールアニメーション
- `news.js` : お知らせデータ（ローカル直開きでも表示可）
- `news.json` : 予備データ（未使用でも可）
- `img/cf_ingenio_logo.jpg` : チームロゴ

## ローカル確認

`index.html` をブラウザで開くだけで確認できます。

## GitHub Pages 公開手順

1. GitHubにこのフォルダをpush
2. リポジトリの `Settings` -> `Pages` を開く
3. `Build and deployment` の `Source` を `Deploy from a branch` に設定
4. `Branch` は `main` / `/ (root)` を選択して保存
5. 数分待つと公開URLが発行されます

## お問い合わせフォームの設定 (Formspree例)

GitHub Pagesはサーバーサイド処理ができないため、外部フォームサービスを使います。

1. Formspreeでアカウント作成
2. 新規フォームを作成してフォームIDを取得
3. `index.html` のフォーム `action` を差し替え

差し替え箇所:

```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

`your-form-id` を実際のIDに置き換えてください。

## お知らせ更新方法

お知らせは `index.html` ではなく `news.js` で管理します。

- 新しいお知らせを `news.js` の `window.CF_INGENIO_NEWS` 配列に追加
- `date` は `YYYY-MM-DD` 形式
- 表示は日付の新しい順で自動ソート
- トップには最新5件のみ表示
- 6件目以降は「過去のお知らせ（アーカイブ）」に自動で入ります

例:

```javascript
{
	date: '2026-05-01',
	title: '5月の体験会情報を公開しました。',
	url: 'https://www.instagram.com/cfingenio/'
}
```

`url` は任意です。設定するとタイトルがリンクになります。

## おすすめフォームサービス

- Formspree: セットアップが簡単でGitHub Pagesと相性が良い
- Basin: シンプルで軽量
- Tally: デザイン性が高く、入力UIが使いやすい
- Googleフォーム: 完全無料で始めやすい

## 変更したい情報

- 対象学年（小学1年生〜小学6年生）
- 練習曜日・時間・会場
- 料金プラン
- SNSリンク（Instagram: https://www.instagram.com/cfingenio/）
- スタッフ情報

上記が確定したら `index.html` の該当文言を更新してください。

## 現在反映済みの情報

- コンセプト: 選手ファースト
- 連絡先メール: cfingenio@gmail.com
- 体験会案内: Instagram投稿で案内
- 方針・指導の強み: トップページに掲載済み
