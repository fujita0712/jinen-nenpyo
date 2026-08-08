import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-10 bg-jade-dark text-white/80 text-sm">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:justify-between gap-4">
        <p className="font-serif text-lg text-white">人生年表</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/legal/privacy" className="hover:text-white">
            プライバシーポリシー
          </Link>
          <Link href="/legal/tokusho" className="hover:text-white">
            特定商取引法に基づく表記
          </Link>
          <Link href="/legal/terms" className="hover:text-white">
            利用規約
          </Link>
        </nav>
      </div>
      <p className="max-w-3xl mx-auto mt-6 text-xs text-white/50">
        本サービスは占い鑑定であり、診断・医療・投資の助言ではありません。参考情報としてご利用ください。
      </p>
    </footer>
  );
}
