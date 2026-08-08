"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeReadingInput } from "@/lib/types";
import { currentAge } from "@/lib/select-mock";
import { generateFutureTable } from "@/lib/mock/future-readings";
import { seedFromString } from "@/lib/tarot";
import FutureYearTablePreview from "@/components/FutureYearTablePreview";
import ConfidenceBadge from "@/components/ConfidenceBadge";

export default function FutureReadingPage() {
  return (
    <Suspense fallback={null}>
      <FutureReadingPageInner />
    </Suspense>
  );
}

function FutureReadingPageInner() {
  const searchParams = useSearchParams();
  const d = searchParams.get("d");
  const paid = searchParams.get("paid") === "true";
  const confidenceParam = Number(searchParams.get("confidence") ?? "4");

  const input = useMemo(() => decodeReadingInput(d), [d]);
  const age = input ? currentAge(input) : 30;
  const cells = useMemo(
    () => generateFutureTable(age, input ? seedFromString(input.name) : 0),
    [age, input]
  );

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
      {!paid && (
        <div className="flex justify-center mb-6">
          <ConfidenceBadge score={confidenceParam} />
        </div>
      )}

      <h1 className="font-serif text-2xl text-jade-dark text-center mb-2">
        {input.name} さんの未来年表
      </h1>
      <p className="text-center text-sm text-gray-500 mb-10">
        {paid ? "全20年 × 4テーマをフル表示中" : "直近12ヶ月は無料公開、5年目以降は課金後に全文表示されます"}
      </p>

      <FutureYearTablePreview cells={cells} paid={paid} />
    </main>
  );
}
