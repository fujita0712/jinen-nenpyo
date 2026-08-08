import { ConfidenceResult } from "./types";

// 仕様 §2.3 の Yes 数 → Confidence 対応表をそのまま実装
export function calcConfidence(answers: boolean[]): ConfidenceResult {
  return calcConfidenceFromYesCount(answers.filter(Boolean).length);
}

export function calcConfidenceFromYesCount(yesCountRaw: number): ConfidenceResult {
  const yesCount = Math.max(0, Math.min(5, yesCountRaw));

  let score: number;
  switch (yesCount) {
    case 0:
      score = 0.5;
      break;
    case 1:
      score = 1;
      break;
    case 2:
      score = 2.5;
      break;
    case 3:
      score = 3.5;
      break;
    case 4:
      score = 4;
      break;
    case 5:
    default:
      score = 5;
      break;
  }

  return { yesCount, score, stars: score };
}

export type ConfidenceAction =
  | "reroll-candidates" // 0-1 yes: 候補年代3つ提示
  | "extra-questions" // 2 yes: 追加質問2つ
  | "one-more-question" // 3 yes: あと1問
  | "cta" // 4 yes: 即課金CTA
  | "cta-gift"; // 5 yes: 完全一致 + ギフトオプション

export function nextAction(yesCount: number): ConfidenceAction {
  if (yesCount <= 1) return "reroll-candidates";
  if (yesCount === 2) return "extra-questions";
  if (yesCount === 3) return "one-more-question";
  if (yesCount === 4) return "cta";
  return "cta-gift";
}
