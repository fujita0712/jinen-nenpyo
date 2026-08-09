"use client";

import { useEffect, useState } from "react";

export default function GeneratingProgress({
  title,
  subSteps,
  estimatedSeconds,
}: {
  title: string;
  subSteps: string[];
  estimatedSeconds: number;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed((Date.now() - start) / 1000);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // 実測ではなく経過時間からの見立て。100%手前で足踏みさせ、応答が遅れても嘘にならないようにする
  const progress = Math.min(92, (elapsed / estimatedSeconds) * 100);
  const stepIndex = Math.min(
    subSteps.length - 1,
    Math.floor((elapsed / estimatedSeconds) * subSteps.length)
  );

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-lg text-jade-dark mb-2">{title}</p>
      <p className="text-sm text-gray-500 mb-8">{subSteps[stepIndex]}</p>
      <div className="w-full max-w-sm h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-jade transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-3">
        {Math.round(progress)}%（通常{estimatedSeconds}秒前後で完了します）
      </p>
    </main>
  );
}
