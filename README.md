# 人生年表 LP

4占術統合鑑定LP。Next.js 14 (App Router) + TypeScript + Tailwind CSS。
決済・メール送信・LLM実接続・DB・認証は未実装（すべてモック）。詳細は `// TODO` コメントを参照。

## ローカル開発

```bash
npm install
npm run dev
# http://localhost:3000
```

## 本番デプロイ（Vercel）

サーバーを別途用意する必要はありません。Vercel自体がホスティングを提供します。

### 1. GitHubにリポジトリを作成してpush

```bash
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/<your-account>/jinen-nenpyo.git
git branch -M main
git push -u origin main
```

### 2. Vercelでプロジェクトを作成

1. https://vercel.com にアクセスし、GitHubアカウントでサインアップ/ログイン
2. 「Add New... > Project」から、pushしたGitHubリポジトリを選択
3. Framework Preset は自動で「Next.js」と認識される。ビルド設定はデフォルトのままでOK
4. 「Deploy」を押すと数分でデプロイ完了し、`https://jinen-nenpyo-xxxx.vercel.app` のようなURLが発行される

### 3. 独自ドメインを接続

1. お名前.com / Google Domains 等でドメインを取得
2. Vercelのプロジェクト画面 > Settings > Domains で取得したドメインを入力
3. 表示されるDNSレコード（AレコードまたはCNAME）を、ドメインのDNS設定画面に追加
4. 反映まで数分〜数時間待つと、独自ドメインでアクセスできるようになる

### 4. 環境変数の設定

`.env.example` を参考に、Vercelの Project Settings > Environment Variables に以下を設定：

- `NEXT_PUBLIC_SITE_URL`: 確定した本番URL（例: `https://jinsei-nenpyo.jp`）— OGP/sitemap/robots.txtに使用

### 5. 公開前に必ず対応すること

- [ ] `app/legal/tokusho/page.tsx` の販売業者名・所在地・連絡先の `TODO` を実在の情報に差し替え
- [ ] `app/legal/privacy/page.tsx` のお問合せ窓口の `TODO` を差し替え
- [ ] 決済プロバイダ（KOMOJU / PAY.JP 等）を接続し、`components/Paywall.tsx` のモック遷移を実決済に置き換え
- [ ] メール送信（SendGrid等）を接続し、鑑定結果メールを実送信化
- [ ] GA4 / Meta Pixel のタグIDを `app/layout.tsx` のプレースホルダ部分に設定
- [ ] LLM実接続（現状は `lib/mock/` の固定文章のみ）

## ディレクトリ構成

仕様書 §4.2 を参照（`app/` `components/` `lib/`）。
