# テキスト差分ビューア

変更前（`#text-a`）と変更後（`#text-b`）を貼り付け、「比較」（`#compare-btn`）で行単位差分を `#result` に表示する静的な単一ページアプリ。差分行は `.diff-line` に `.added` / `.removed` / `.changed` を付与し、行頭記号（`+` / `-` / `~`）と背景色で区別する。状態は `#status` に案内文または差分件数を出す。アルゴリズムは LCS（行単位）で、連続する削除と追加は変更にまとめる。本体は `public/index.html` のみ。

## 技術スタック（不変）

- バニラJS・単一 `public/index.html`（CSS/JSインライン）・ビルドなし
- 配信: Cloudflare Workers assets（`wrangler.jsonc`）
- テスト: Playwright（`tests/app.spec.ts`、`npm test`）
- 保守時もこのスタックを維持すること。フレームワーク・ビルドツール・宣言外ライブラリの導入は禁止

## 品質不変条件

- favicon は `<link rel="icon" href="data:image/svg+xml,...">` のインライン data URI のままにする（外部ファイル・外部 URL 不可）
- hub へのフッター導線を壊さない。リンク先 `https://apps.jozo.beer` とリンクテキスト `apps.jozo.beer` は固定。スタイルはテーマに合わせて調整してよいが、コントラストは確保する
- 変更後は `npm run verify` が通る状態を維持する

## 保守の進め方

1. 変更内容を受け入れ条件として `tests/app.spec.ts` に書く（既存のスモークテストは削除しない）
2. `public/index.html` を実装する
3. `npm test`（および必要なら `npm run verify`）を通す
4. `git commit` して `git push`
5. `npm run deploy` で公開する

## 正の置き場所

`PLAN.md` は初回実装時の計画（歴史的文書）である。現状の仕様の正は README と `tests/app.spec.ts` とする。
