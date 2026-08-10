"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeReadingInput } from "@/lib/types";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import Paywall from "@/components/Paywall";

export default function PaywallPage() {
  return (
    <Suspense fallback={null}>
      <PaywallPageInner />
    </Suspense>
  );
}

function PaywallPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const d = searchParams.get("d");
  const confidence = Number(searchParams.get("confidence") ?? "0");
  const input = useMemo(() => decodeReadingInput(d), [d]);

  const eligible = confidence >= 4;

  const handleSelectPlan = (planId: string) => {
    // TODO: 決済プロバイダ実接続はスコープ外(§7)。ここではダミー遷移のみ。
    router.push(`/thanks?d=${encodeURIComponent(d ?? "")}&plan=${planId}`);
  };

  if (!input) {
    return (
      <main className="px-6 py-16 text-center">
        <p className="text-gray-600">入力データが見つかりませんでした。</p>
        <Link href="/input" className="text-jade underline mt-4 inline-block">
          入力画面に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 max-w-3xl mx-auto">
      <div className="flex justify-center mb-4">
        <ConfidenceBadge score={confidence} />
      </div>
      <h1 className="font-serif text-2xl text-jade-dark text-center mb-2">
        {input.name} さんの未来年表を、同じ精度でお届けします
      </h1>
      <p className="text-center text-sm text-gray-500 mb-10">
        未来20年 × 4テーマ（仕事／恋愛／金運／家族）
      </p>

      {!eligible && (
        <div className="mb-8 p-5 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 text-center">
          確信度が4未満のため、現時点では課金にお進みいただけません。
          <br />
          <Link href={`/reading/past?d=${encodeURIComponent(d ?? "")}`} className="underline">
            過去鑑定に戻って無料でやり直す
          </Link>
        </div>
      )}

      <Paywall eligible={eligible} onSelectPlan={handleSelectPlan} />
    </main>
  );
}
