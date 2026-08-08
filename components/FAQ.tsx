const FAQS = [
  {
    q: "本当に当たるのですか？",
    a: "当たり外れを判定するものではなく、4占術を統合した参考情報としてご活用いただくものです。ご自身の意思決定の一つの視点としてお使いください。",
  },
  {
    q: "個人情報はどう扱われますか？",
    a: "生年月日・出生時間・出生地などは鑑定生成とメール送付の目的にのみ使用し、サーバー上では60日で自動的に削除されます。詳細はプライバシーポリシーをご確認ください。",
  },
  {
    q: "返品はできますか？",
    a: "PDF成果物の性質上、決済後のキャンセルは原則できませんが、未ダウンロードかつ決済後24時間以内であればメールサポート経由でキャンセルが可能です。",
  },
  {
    q: "サブスクリプションですか？",
    a: "基本プランは買い切りです。月1回のフォローアップをご希望の場合のみ、別途月額プランをお選びいただけます。",
  },
];

export default function FAQ() {
  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      <h2 className="font-serif text-2xl md:text-3xl text-center text-jade-dark mb-10">
        よくある質問
      </h2>
      <div className="space-y-6">
        {FAQS.map((item) => (
          <div key={item.q} className="border-b border-gray-200 pb-6">
            <p className="font-medium text-gray-800">Q. {item.q}</p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">A. {item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
