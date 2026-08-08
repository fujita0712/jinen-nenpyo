"use client";

import { useState } from "react";

export const VERIFICATION_QUESTIONS = [
  "15〜17歳前後で、ご家族や先生の期待とズレを感じる瞬間はありましたか？",
  "20〜23歳前後で、学校を離れる／環境を大きく変える経験はありましたか？",
  "27〜30歳前後で、結婚／出産／転職／独立／留学のいずれかが起こりましたか？",
  "30代に入って、仕事と家庭の両方を本気でやる前提で組み立て直す感覚が強まっていますか？",
  "今、「設計し直す段階」にあると感じますか？",
];

export default function VerificationQuestions({
  onSubmit,
  disabled,
}: {
  onSubmit: (answers: boolean[]) => void;
  disabled?: boolean;
}) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(VERIFICATION_QUESTIONS.length).fill(null)
  );

  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className="space-y-6">
      {VERIFICATION_QUESTIONS.map((q, i) => (
        <div key={q} className="border-b border-gray-100 pb-4">
          <p className="text-sm text-gray-800 mb-3">
            Q{i + 1}. {q}
          </p>
          <div className="flex gap-3">
            {(["Yes", "No"] as const).map((label) => {
              const value = label === "Yes";
              const selected = answers[i] === value;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    const next = [...answers];
                    next[i] = value;
                    setAnswers(next);
                  }}
                  className={`px-5 py-2 rounded-full text-sm border transition-colors ${
                    selected
                      ? "bg-jade text-white border-jade"
                      : "bg-white text-gray-600 border-gray-300 hover:border-jade"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={!allAnswered || disabled}
        onClick={() => onSubmit(answers as boolean[])}
        className="w-full py-3 rounded-full bg-jade text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-jade-dark transition-colors"
      >
        回答を送信
      </button>
    </div>
  );
}
