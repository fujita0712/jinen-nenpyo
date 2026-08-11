// 未来年表(有料)のダミー文章生成
// §7: LLM未接続のためテンプレート+入力値によるバリエーションで代替する
// §2.4 禁止表現は使用しない

import { PeriodType } from "@/lib/period-types";

export interface FutureCell {
  yearOffset: number; // 0 = 直近12ヶ月
  age: number;
  free: boolean;
  periodType: PeriodType;
  flow: string;
  advice: string;
}

function isNearSaturnReturnAge(age: number): boolean {
  return (age >= 27 && age <= 30) || (age >= 57 && age <= 60);
}

function periodTypeForYear(yearOffset: number, age: number, seed: number): PeriodType {
  if (isNearSaturnReturnAge(age)) return "turning_point";
  const bucket = (seed + yearOffset * 5) % 10;
  if (bucket === 0) return "decisive";
  if (bucket === 5) return "endurance";
  return "steady";
}

const ADVICE_BY_TYPE: Record<PeriodType, string[]> = {
  decisive: ["迷ったら動く方を選ぶタイミングです。", "小さく試すより、腹をくくって進める年。"],
  turning_point: ["環境を変える選択肢を検討してみましょう。", "これまでのやり方に固執しすぎないこと。"],
  endurance: ["一人で抱え込まず、早めに相談を。", "無理に結果を急がず、力を溜める時期。"],
  steady: ["今のペースを維持で十分です。", "特別なことをせず、日々を大切に。"],
};

const FLOW_BY_TYPE: Record<PeriodType, string[]> = {
  decisive: [
    "これまで積み上げてきたものを形にする決断のタイミングが訪れやすく、迷いより行動が優勢になる一年です。",
    "曖昧にしてきた選択を一つ片付ける年。周囲の反応より、自分の納得感を優先しやすい時期です。",
  ],
  turning_point: [
    "環境や関係性が自然と動き出し、これまでの延長線上にない選択肢が見えてくる一年です。",
    "積み重ねてきた土台の上に、新しい方向性が加わりやすいタイミングです。",
  ],
  endurance: [
    "派手な変化より、内側の負荷とじっくり向き合う時間が優勢になる一年です。",
    "結果を急がず力を溜める時期。焦りが出やすい分、ペース配分が鍵になります。",
  ],
  steady: [
    "大きな変化は少なく、これまでの流れを穏やかに引き継ぐ一年です。",
    "落ち着いて過ごせる時期で、日々の積み重ねがそのまま力になります。",
  ],
};

export function generateFutureTable(currentAge: number, seed: number): FutureCell[] {
  const cells: FutureCell[] = [];
  for (let yearOffset = 0; yearOffset < 20; yearOffset++) {
    const age = currentAge + yearOffset;
    const periodType = periodTypeForYear(yearOffset, age, seed);
    const adviceBank = ADVICE_BY_TYPE[periodType];
    const advice = adviceBank[(seed + yearOffset) % adviceBank.length];
    const flowBank = FLOW_BY_TYPE[periodType];
    const flow = flowBank[(seed + yearOffset) % flowBank.length];
    cells.push({
      yearOffset,
      age,
      free: yearOffset === 0,
      periodType,
      flow,
      advice,
    });
  }
  return cells;
}
