# テキスト差分ビューア

変更前・変更後のテキストを左右のテキストエリアに貼り付け、「比較」を押すと行単位の差分（追加・削除・変更）を色分け表示する静的な単一ページアプリ。差分は LCS ベースで算出し、連続する削除と追加は変更行としてまとめる。差分件数は画面上に表示される。

## 公開URL

https://text-diff-viewer.jozo.beer

## 開発

[kojo](https://github.com/jozobeer/kojo)（1日1アプリ自動生成基盤）により生成されたリポジトリです。

初回セットアップ: `npm install`（Playwright ブラウザ未取得の環境では `npx playwright install chromium`）

- `npm test` — Playwright によるブラウザテスト
- `npm run verify` — 不変条件チェック（favicon / apps.jozo.beer フッター）
- `npm run deploy` — Cloudflare Workers へデプロイ

## 構成

- `public/index.html` — アプリ本体（CSS/JSインラインの単一ファイル）
- `tests/app.spec.ts` — 受け入れ条件を含む Playwright テスト
- `PLAN.md` — 初回実装時の計画（歴史的文書。現状の正は本 README とテスト）
