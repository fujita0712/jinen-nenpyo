export default function TermsPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto text-sm text-gray-700 leading-relaxed space-y-8">
      <h1 className="font-serif text-2xl text-jade-dark mb-4">利用規約</h1>

      <section className="p-4 rounded-lg bg-jade/10">
        <p>
          本サービスは占い鑑定であり、診断・医療・投資の助言ではありません。当たる・当たらないを表現することはなく、参考情報としてご利用ください。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">1. サービス内容</h2>
        <p>
          本サービスは、西洋占星術・数秘術・四柱推命・タロットの4占術を統合した鑑定結果を、過去年表（無料）および未来年表PDF（有料）としてお届けするものです。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">2. 免責事項</h2>
        <p>
          鑑定結果はあくまで参考情報であり、将来の出来事や結果を保証するものではありません。本サービスの利用により生じた損害について、当方は責任を負いかねます。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">3. 禁止事項</h2>
        <p>本サービスの鑑定結果を第三者への営業・勧誘・医療的判断の根拠として利用することを禁止します。</p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">4. 規約の変更</h2>
        <p>本規約の内容は、事前の通知なく変更されることがあります。</p>
      </section>
    </main>
  );
}
