import Link from "next/link";
import Hero from "@/components/Hero";
import FeatureComparison from "@/components/FeatureComparison";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

// LP は SSG 配信を基本方針とする(仕様 §9)
export const revalidate = 3600;

const FOUR_ARTS = [
  {
    name: "西洋占星術",
    desc: "出生時のホロスコープから、人生の大きな転機のタイミングを読み解きます。",
  },
  {
    name: "数秘術",
    desc: "氏名と生年月日から算出される数字が示す、あなたの傾向を読み解きます。",
  },
  {
    name: "四柱推命",
    desc: "生まれた年・月・日・時の干支から、運勢の周期を読み解きます。",
  },
  {
    name: "タロット",
    desc: "78枚のカードが示す象徴から、テーマごとの傾向を読み解きます。",
  },
];

const SAMPLE_CELLS = [
  { label: "仕事", text: "積み重ねが評価され、役割の幅が広がりやすいテーマが優勢です" },
  { label: "恋愛", text: "身近な関係性の距離感を見直すタイミングが訪れやすい傾向です" },
  { label: "金運", text: "収入源を見直す選択肢を検討しやすいタイミングです" },
  { label: "家族", text: "家族との関わり方を見直す出来事が起こりやすい傾向です" },
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      <FeatureComparison />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-center text-jade-dark mb-10">
          4占術統合鑑定の中身
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FOUR_ARTS.map((art) => (
            <div key={art.name} className="p-6 rounded-lg bg-white border border-gray-100">
              <p className="font-serif text-lg text-jade-dark">{art.name}</p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{art.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 bg-white">
        <h2 className="font-serif text-2xl md:text-3xl text-center text-jade-dark mb-10">
          未来年表サンプル
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {SAMPLE_CELLS.map((cell) => (
            <div key={cell.label} className="p-4 rounded-lg border border-jade/30 bg-base">
              <p className="text-xs font-medium text-jade-dark">直近12ヶ月・{cell.label}</p>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{cell.text}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          ※ あなたのテーマはここに表示されます（実際の鑑定はご自身の入力データから生成されます）
        </p>
      </section>

      <FAQ />

      <section className="px-6 py-16 text-center">
        <Link
          href="/input"
          className="inline-block px-8 py-4 rounded-full bg-jade text-white text-lg font-medium hover:bg-jade-dark transition-colors"
        >
          無料で「過去鑑定」を受け取る
        </Link>
      </section>

      <Footer />
    </main>
  );
}
