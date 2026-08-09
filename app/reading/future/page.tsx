"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeReadingInput } from "@/lib/types";
import { currentAge } from "@/lib/select-mock";
import { generateFutureTable, FutureCell } from "@/lib/mock/future-readings";
import { seedFromString } from "@/lib/tarot";
import FutureYearTablePreview from "@/components/FutureYearTablePreview";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import GeneratingProgress from "@/components/GeneratingProgress";

const FUTURE_GENERATION_STEPS = [
  "現在から20年分の周期を計算しています…",
  "土星回帰など主要な転機のタイミングを特定しています…",
  "仕事・恋愛・金運・家族の4テーマを組み立てています…",
  "年ごとの文章を仕上げています…",
];

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

  const [cells, setCells] = useState<FutureCell[] | null>(null);
  const [generating, setGenerating] = useState(true);
  const [generationFailed, setGenerationFailed] = useState(false);

  useEffect(() => {
    if (!input) return;
    let cancelled = false;
    setGenerating(true);
    setGenerationFailed(false);

    fetch("/api/generate-future-reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json();
      })
      .then((data: FutureCell[]) => {
        if (cancelled) return;
        setCells(data);
      })
      .catch((err) => {
        console.error("AI生成に失敗、モックにフォールバック:", err);
        if (cancelled) return;
        setGenerationFailed(true);
        setCells(generateFutureTable(age, seedFromString(input.name)));
      })
      .finally(() => {
        if (!cancelled) setGenerating(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

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

  if (generating || !cells) {
    return (
      <GeneratingProgress
        title="未来年表を生成しています"
        subSteps={FUTURE_GENERATION_STEPS}
        estimatedSeconds={50}
      />
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
      <p className="text-center text-sm text-gray-500 mb-4">
        {paid ? "全20年 × 4テーマをフル表示中" : "直近12ヶ月は無料公開、5年目以降は課金後に全文表示されます"}
      </p>

      {generationFailed && (
        <p className="text-center text-xs text-amber-600 mb-6">
          ※ AI生成に失敗したため、サンプル文章を表示しています
        </p>
      )}

      <FutureYearTablePreview cells={cells} paid={paid} />
    </main>
  );
}
