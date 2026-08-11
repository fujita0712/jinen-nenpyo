import { DivinationSummary as DivinationSummaryType } from "@/lib/divination-summary";

export default function DivinationSummary({ summary }: { summary: DivinationSummaryType }) {
  const rows: [string, string][] = [
    ["西洋占星術", `太陽星座 ${summary.sunSign}${summary.nearSaturnReturn ? "（土星回帰の時期に近い）" : ""}`],
    ["数秘術", `ライフパス ${summary.lifePath} ／ ディスティニー ${summary.destiny} ／ ソウル ${summary.soul}`],
    [
      "四柱推命",
      `年柱 ${summary.yearPillar} ・ 月柱 ${summary.monthPillar} ・ 日柱 ${summary.dayPillar} ・ 時柱 ${summary.hourPillar}（${summary.daiun}）`,
    ],
    ["タロット", `${summary.tarotName}（${summary.tarotReversed ? "逆位置" : "正位置"}）`],
  ];

  return (
    <div className="mb-8 p-4 rounded-lg border border-gray-100 bg-white">
      <p className="text-xs font-medium text-jade-dark mb-3">4占術 算出結果</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] text-gray-400">{label}</dt>
            <dd className="text-sm text-gray-700">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
