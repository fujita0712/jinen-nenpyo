"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = [
  "西洋占星術の算出中…",
  "数秘術の算出中…",
  "四柱推命の算出中…",
  "タロットを引いています…",
];

const STEP_DURATION_MS = 1500;

export default function LoadingPage() {
  return (
    <Suspense fallback={null}>
      <LoadingPageInner />
    </Suspense>
  );
}

function LoadingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const d = searchParams.get("d");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!d) {
      router.replace("/input");
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      const t = setTimeout(() => setStepIndex((i) => i + 1), STEP_DURATION_MS);
      return () => clearTimeout(t);
    }

    // 最終ステップ表示後、待機してから遷移
    const t = setTimeout(() => {
      router.push(`/reading/past?d=${d}`);
    }, STEP_DURATION_MS + 1000);
    return () => clearTimeout(t);
  }, [stepIndex, d, router]);

  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-2xl text-jade-dark mb-8">{STEPS[stepIndex]}</p>
      <div className="w-full max-w-sm h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-jade transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="mt-8 space-y-1 text-sm text-gray-400">
        {STEPS.map((step, i) => (
          <li key={step} className={i <= stepIndex ? "text-jade-dark" : ""}>
            {i < stepIndex ? "✓ " : i === stepIndex ? "… " : "　"}
            {step}
          </li>
        ))}
      </ul>
    </main>
  );
}
