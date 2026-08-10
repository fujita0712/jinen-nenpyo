import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-6 py-20 md:py-28 text-center max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl md:text-5xl leading-snug text-jade-dark">
        もう「今日の運勢」には収まらない。
        <br />
        人生の20年を、設計されてみませんか。
      </h1>
      <p className="mt-6 text-base md:text-lg text-gray-600 leading-relaxed">
        西洋占星術・数秘術・タロット・四柱推命を掛け合わせて読み解き、
        <br className="hidden md:block" />
        未来年表にしたPDFを、24時間以内にメールでお届けします。
      </p>
      <Link
        href="/input"
        className="inline-block mt-10 px-8 py-4 rounded-full bg-jade text-white text-lg font-medium hover:bg-jade-dark transition-colors"
      >
        無料で「過去鑑定」を受け取る
      </Link>
      <div className="mt-6 text-sm text-gray-500 space-y-1">
        <p>・氏名・生年月日・出生時間の入力は約90秒</p>
        <p>・お預かりした情報は60日間で自動削除されます</p>
      </div>
    </section>
  );
}
