"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeReadingInput } from "@/lib/types";
import { selectPastReadingSegment } from "@/lib/select-mock";
import { PastReadingSegment } from "@/lib/mock/past-readings";
import { calcConfidenceFromYesCount, nextAction } from "@/lib/confidence";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import PastYearTable from "@/components/PastYearTable";
import VerificationQuestions from "@/components/VerificationQuestions";

const CANDIDATE_RANGES = ["20〜23才前後", "25〜28才前後", "28〜32才前後"];

export default function PastReadingPage() {
  return (
    <Suspense fallback={null}>
      <PastReadingPageInner />
    </Suspense>
  );
}

function PastReadingPageInner() {
  const searchParams = useSearchParams();
  const d = searchParams.get("d");
  const input = useMemo(() => decodeReadingInput(d), [d]);

  const [segment, setSegment] = useState<PastReadingSegment | null>(null);
  const [generating, setGenerating] = useState(true);
  const [generationFailed, setGenerationFailed] = useState(false);

  useEffect(() => {
    if (!input) return;
    let cancelled = false;
    setGenerating(true);
    setGenerationFailed(false);

    fetch("/api/generate-past-reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json();
      })
      .then((data: PastReadingSegment) => {
        if (cancelled) return;
        setSegment(data);
      })
      .catch((err) => {
        console.error("AI生成に失敗、モックにフォールバック:", err);
        if (cancelled) return;
        setGenerationFailed(true);
        setSegment(selectPastReadingSegment(input));
      })
      .finally(() => {
        if (!cancelled) setGenerating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [input]);

  const [baseYesCount, setBaseYesCount] = useState<number | null>(null);
  const [bonusYesCount, setBonusYesCount] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [bonusAnswered, setBonusAnswered] = useState(false);

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

  if (generating || !segment) {
    return (
      <main className="px-6 py-24 text-center">
        <p className="font-serif text-lg text-jade-dark">過去年表を生成しています…</p>
        <p className="text-xs text-gray-400 mt-2">4占術の結果をもとにAIが文章を組み立てています</p>
      </main>
    );
  }

  const totalYesCount =
    baseYesCount === null ? null : Math.min(5, baseYesCount + bonusYesCount);
  const confidence = calcConfidenceFromYesCount(totalYesCount ?? 3); // 初期表示は仮 ★★★☆☆ 相当
  const action = totalYesCount === null ? null : nextAction(totalYesCount);

  const futureHref = `/reading/future?d=${encodeURIComponent(d ?? "")}&confidence=${confidence.score}`;

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <ConfidenceBadge score={totalYesCount === null ? 3 : confidence.score} />
      </div>

      <h1 className="font-serif text-2xl text-jade-dark text-center mb-8">
        {input.name} さんの過去年表（無料鑑定）
      </h1>

      {generationFailed && (
        <p className="text-center text-xs text-amber-600 mb-4">
          ※ AI生成に失敗したため、サンプル文章を表示しています
        </p>
      )}

      <PastYearTable segment={segment} />

      <div className="mt-4 text-xs text-gray-400 text-center">
        ここまでが無料閲覧範囲です。この先の未来年表は課金後にフル表示されます。
      </div>

      <div className="mt-10 p-6 rounded-lg border border-gray-100 bg-white">
        <h2 className="font-serif text-lg text-jade-dark mb-4">当たり判定チェック（5問）</h2>

        {totalYesCount === null ? (
          <VerificationQuestions onSubmit={(answers) => setBaseYesCount(answers.filter(Boolean).length)} />
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Yes {totalYesCount} / 5 → 確信度 {confidence.score.toFixed(1)}
            </p>

            {action === "reroll-candidates" && (
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  もう少し精度を上げるために、当てはまりそうな年代を選んでください。
                </p>
                <div className="flex flex-wrap gap-2">
                  {CANDIDATE_RANGES.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setSelectedCandidate(range)}
                      className={`px-4 py-2 rounded-full text-sm border ${
                        selectedCandidate === range
                          ? "bg-jade text-white border-jade"
                          : "bg-white text-gray-600 border-gray-300"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                {selectedCandidate && (
                  <p className="text-xs text-gray-400 mt-3">
                    「{selectedCandidate}」を反映して再生成しました（モック表示）。
                    {/* TODO: 実際の再生成はLLM未接続のためモック(§7) */}
                  </p>
                )}
              </div>
            )}

            {action === "extra-questions" && !bonusAnswered && (
              <BonusQuestions
                count={2}
                onSubmit={(yes) => {
                  setBonusYesCount(yes);
                  setBonusAnswered(true);
                }}
              />
            )}

            {action === "one-more-question" && !bonusAnswered && (
              <BonusQuestions
                count={1}
                label="あと1問で確信度を上げませんか？"
                onSubmit={(yes) => {
                  setBonusYesCount(yes);
                  setBonusAnswered(true);
                }}
              />
            )}

            {(action === "cta" || action === "cta-gift") && (
              <div className="text-center space-y-4">
                {action === "cta-gift" && (
                  <p className="text-jade-dark font-medium">完全一致 — 高い確信度が得られました</p>
                )}
                <Link
                  href={futureHref}
                  className="inline-block px-8 py-4 rounded-full bg-jade text-white text-lg font-medium hover:bg-jade-dark transition-colors"
                >
                  未来年表サンプルを見る
                </Link>
                {action === "cta-gift" && (
                  <p className="text-xs text-gray-400">
                    ギフトオプション（自分以外への贈り物として送る）は決済画面で選択できます
                  </p>
                )}
              </div>
            )}

            {(action === "extra-questions" || action === "one-more-question") && bonusAnswered && (
              <p className="text-sm text-jade-dark">
                確信度を更新しました。上部のバッジと結果をご確認ください。
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function BonusQuestions({
  count,
  label,
  onSubmit,
}: {
  count: number;
  label?: string;
  onSubmit: (yesCount: number) => void;
}) {
  const questions =
    count === 1
      ? ["今の生活の中で、何かを「設計し直したい」と感じる場面が増えていますか？"]
      : [
          "最近、周囲の人間関係の距離感が変わったと感じますか？",
          "今後1年以内に大きな決断を控えていると感じますか？",
        ];
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null));
  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className="space-y-4">
      {label && <p className="text-sm text-jade-dark font-medium">{label}</p>}
      {questions.map((q, i) => (
        <div key={q}>
          <p className="text-sm text-gray-800 mb-2">{q}</p>
          <div className="flex gap-3">
            {(["Yes", "No"] as const).map((l) => {
              const value = l === "Yes";
              const selected = answers[i] === value;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    const next = [...answers];
                    next[i] = value;
                    setAnswers(next);
                  }}
                  className={`px-5 py-2 rounded-full text-sm border ${
                    selected ? "bg-jade text-white border-jade" : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        disabled={!allAnswered}
        onClick={() => onSubmit(answers.filter(Boolean).length)}
        className="px-6 py-2 rounded-full bg-jade text-white text-sm disabled:opacity-40"
      >
        回答を送信
      </button>
    </div>
  );
}
