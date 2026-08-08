import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

// TODO: 本番ドメイン確定後、環境変数 NEXT_PUBLIC_SITE_URL を Vercel の
// Project Settings > Environment Variables に設定すること(例: https://jinsei-nenpyo.jp)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "人生年表 | 4占術統合鑑定であなたの20年を設計する",
  description:
    "西洋占星術・数秘術・タロット・四柱推命を統合し、あなたの過去と未来20年を年表にしてお届けします。",
  openGraph: {
    title: "人生年表",
    description:
      "西洋占星術・数秘術・タロット・四柱推命を統合し、あなたの過去と未来20年を年表にしてお届けします。",
    url: SITE_URL,
    siteName: "人生年表",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "人生年表",
    description:
      "西洋占星術・数秘術・タロット・四柱推命を統合し、あなたの過去と未来20年を年表にしてお届けします。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* TODO: GA4 / Meta Pixel は本フェーズでは未接続。実装時はここにタグを追加する(§4.1) */}
      {/*
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
        <script>Meta Pixel base code placeholder</script>
      */}
      <body className={`${cormorant.variable} ${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
