import Link from "next/link";

const PLANS = [
  {
    id: "basic",
    title: "未来年表 PDF",
    price: "4,980円（税込）",
    desc: "未来20年 × 4テーマ（仕事／恋愛／金運／家族）をPDF（A4 12ページ相当）でお届け",
    primary: true,
  },
  {
    id: "extended",
    title: "拡張プラン",
    price: "7,800円（税込）",
    desc: "未来30年分 + カバー画像つき",
    primary: false,
  },
  {
    id: "subscription",
    title: "継続フォロープラン",
    price: "月額980円",
    desc: "月1回のフォローアップ鑑定つき",
    primary: false,
  },
];

export default function Paywall({
  eligible,
  onSelectPlan,
}: {
  eligible: boolean;
  onSelectPlan: (planId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">
        受け取り時期：決済後24時間以内にメール送付／形式：PDF（A4 12ページ相当）
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`p-5 rounded-lg border ${
              plan.primary ? "border-jade bg-jade/5" : "border-gray-200 bg-white"
            }`}
          >
            <p className="font-serif text-lg text-jade-dark">{plan.title}</p>
            <p className="mt-1 text-xl font-semibold text-gray-800">{plan.price}</p>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">{plan.desc}</p>
            <button
              type="button"
              disabled={!eligible}
              onClick={() => onSelectPlan(plan.id)}
              className={`mt-4 w-full py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                plan.primary
                  ? "bg-jade text-white hover:bg-jade-dark"
                  : "border border-jade text-jade hover:bg-jade/10"
              }`}
            >
              このプランで受け取る
            </button>
          </div>
        ))}
      </div>

      {/* TODO: 決済接続。Stripeは使えないためKOMOJU/PAY.JP/銀行振込リンクをPhase 1で接続する */}

      <p className="text-center text-xs text-gray-400">
        <Link href="/legal/tokusho" className="underline">
          特定商取引法に基づく表記
        </Link>
        もあわせてご確認ください。
      </p>
    </div>
  );
}
