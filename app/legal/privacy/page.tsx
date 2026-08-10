export default function PrivacyPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto text-sm text-gray-700 leading-relaxed space-y-8">
      <h1 className="font-serif text-2xl text-jade-dark mb-4">プライバシーポリシー</h1>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">1. 取得する情報</h2>
        <p>
          氏名、性別、生年月日、出生時間、出生地、出生順位、兄弟構成、過去のライフイベント、心配しているテーマ、メールアドレス等（生年月日・出生時間・出生地・氏名は個人情報保護法上の要配慮個人情報に準じる情報として厳重に取り扱います）。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">2. 利用目的</h2>
        <p>取得した情報は、占い鑑定の作成および鑑定結果のメール送付の目的にのみ使用します。それ以外の目的では利用しません。</p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">3. 保存期間</h2>
        <p>
          ご入力いただいた情報は、鑑定結果の作成・メール送付の処理が完了すると同時に破棄され、当社サーバー上に保存されることはありません。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">4. 業務委託先・第三者提供</h2>
        <p>
          鑑定文章の作成にAnthropic社のAI技術（Claude API）を、鑑定結果メールの送付にResend社のメール配信サービスを、それぞれ業務委託先として利用しています。これらの委託先には、鑑定の作成・送付に必要な範囲でのみ情報を取り扱わせており、法令に基づく場合を除き、これら業務委託先以外の第三者に情報を提供することはありません。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">5. オプトインメールの同意撤回</h2>
        <p>
          メールマガジンの配信停止をご希望の場合は、配信メール内の配信停止リンク、またはお問合せ窓口までご連絡ください。いつでも同意を撤回いただけます。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">6. お問合せ窓口</h2>
        <p>prc.fujita@gmail.com</p>
      </section>
    </main>
  );
}
