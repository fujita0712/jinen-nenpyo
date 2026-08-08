const ROWS: [string, string][] = [
  ["販売業者名", "（TODO: 正式な事業者名・屋号を記載してください）"],
  ["運営統括責任者", "（TODO: 責任者氏名を記載してください）"],
  ["所在地", "（TODO: 所在地を記載してください。請求があれば遅滞なく開示する場合はその旨を明記）"],
  ["連絡先", "（TODO: 電話番号・メールアドレスを記載してください）"],
  ["販売価格", "未来年表PDF：4,980円（税込）／拡張プラン：7,800円（税込）／継続フォロープラン：月額980円（税込）"],
  ["商品代金以外の必要料金", "なし（インターネット接続料金等はお客様のご負担となります）"],
  ["支払方法", "クレジットカード決済（決済プロバイダは別途接続予定）"],
  ["支払時期", "決済完了時"],
  ["引き渡し時期", "決済完了後24時間以内に、ご登録のメールアドレスへPDFを送付いたします"],
  [
    "返品・キャンセルについて",
    "本サービスはPDF成果物の提供であり役務の性質上、決済後のキャンセル・返金は原則お受けできません。ただし、未ダウンロードかつ決済完了後24時間以内の場合に限り、お問合せ窓口までご連絡いただくことでキャンセルを承ります。",
  ],
  ["お問合せ窓口", "（TODO: サポート用メールアドレスを記載してください）"],
  [
    "オプトインメールの取得目的",
    "ご登録いただいたメールアドレスは、鑑定結果の送付（契約履行）および月1回程度のお知らせメール配信（事前同意をいただいた方のみ）の目的で利用します。",
  ],
];

export default function TokushoPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl text-jade-dark mb-8">特定商取引法に基づく表記</h1>
      <dl className="divide-y divide-gray-100 text-sm">
        {ROWS.map(([label, value]) => (
          <div key={label} className="py-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            <dt className="font-medium text-gray-500">{label}</dt>
            <dd className="md:col-span-2 text-gray-700 leading-relaxed">{value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
