// TODO: 仕様書のワイヤーフレームでは比較対象として特定の他社サービス名を
// 名指しする指示があったが、そのうち2社は商標系名称として記載禁止リストに
// 含まれているため、禁止リストの優先順位に従い匿名化した「A社アプリ」
// 「B社アプリ」に置き換えている。LINE占いは禁止リストに含まれないためそのまま使用。
const ROWS = [
  { label: "4占術統合鑑定", jinen: true, appA: false, appB: false, line: false },
  { label: "過去年表の無料鑑定", jinen: true, appA: false, appB: true, line: false },
  { label: "未来20年 × 4テーマの年表", jinen: true, appA: false, appB: false, line: false },
  { label: "PDFでの買い切り提供", jinen: true, appA: false, appB: false, line: false },
  { label: "アプリ不要・ブラウザ完結", jinen: true, appA: false, appB: true, line: true },
];

function Check({ value }: { value: boolean }) {
  return (
    <span className={value ? "text-jade font-bold" : "text-gray-300"}>
      {value ? "○" : "―"}
    </span>
  );
}

export default function FeatureComparison() {
  return (
    <section className="px-6 py-16 bg-white">
      <h2 className="font-serif text-2xl md:text-3xl text-center text-jade-dark mb-10">
        他サービスとの違い
      </h2>
      <div className="max-w-3xl mx-auto overflow-x-auto">
        <table className="w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-2 font-medium text-gray-500">項目</th>
              <th className="py-3 px-2 font-semibold text-jade-dark">人生年表</th>
              <th className="py-3 px-2 font-medium text-gray-500">A社アプリ</th>
              <th className="py-3 px-2 font-medium text-gray-500">B社アプリ</th>
              <th className="py-3 px-2 font-medium text-gray-500">LINE占い</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-gray-100">
                <td className="py-3 pr-2 text-gray-700">{row.label}</td>
                <td className="py-3 px-2 text-center">
                  <Check value={row.jinen} />
                </td>
                <td className="py-3 px-2 text-center">
                  <Check value={row.appA} />
                </td>
                <td className="py-3 px-2 text-center">
                  <Check value={row.appB} />
                </td>
                <td className="py-3 px-2 text-center">
                  <Check value={row.line} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
