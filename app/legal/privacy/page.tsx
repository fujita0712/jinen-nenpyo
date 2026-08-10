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
        <p>お預かりした情報は、サーバー上で取得から60日間保存した後、自動的に削除されます。</p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">4. 第三者提供</h2>
        <p>法令に基づく場合を除き、取得した情報を第三者に提供することはありません。</p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">5. オプトインメールの同意撤回</h2>
        <p>
          メールマガジンの配信停止をご希望の場合は、配信メール内の配信停止リンク、またはお問合せ窓口までご連絡ください。いつでも同意を撤回いただけます。
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">6. お問合せ窓口</h2>
        <p>（TODO: サポート用メールアドレスを記載してください）</p>
      </section>
    </main>
  );
}
