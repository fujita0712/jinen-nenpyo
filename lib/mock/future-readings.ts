// 未来年表(有料)のダミー文章生成
// §7: LLM未接続のためテンプレート+入力値によるバリエーションで代替する
// §2.4 禁止表現は使用しない

import { PeriodType } from "@/lib/period-types";

export type FutureTheme = "仕事" | "恋愛" | "金運" | "家族";
export const FUTURE_THEMES: FutureTheme[] = ["仕事", "恋愛", "金運", "家族"];

export interface FutureCell {
  yearOffset: number; // 0 = 直近12ヶ月
  age: number;
  theme: FutureTheme;
  text: string;
  free: boolean;
  periodType: PeriodType;
  advice: string;
}

const THEME_TEMPLATES: Record<FutureTheme, string[]> = {
  仕事: [
    "これまでの積み重ねが評価され、役割の幅が広がりやすいタイミングです。",
    "環境を変える選択肢が視野に入り、迷いながらも一歩を選びやすい時期です。",
    "自分の得意分野に集中したい気持ちが強まり、専門性を深める行動が優勢になります。",
    "周囲との協働がテーマになり、一人で抱え込む働き方を見直しやすい時期です。",
    "これまでの経験を人に伝える側に回る機会が増えやすい傾向があります。",
  ],
  恋愛: [
    "身近な関係性が変化しやすく、距離感を見直すタイミングが訪れやすい時期です。",
    "新しい出会いよりも、既存の関係を深める選択肢が優勢になりやすい傾向です。",
    "自分の気持ちに正直になることがテーマになり、関係の整理が進みやすい時期です。",
    "パートナーシップにおける役割分担を話し合う機会が増えやすい傾向があります。",
    "一人の時間を大切にしたい気持ちと、誰かと歩みたい気持ちが揺れ動きやすい時期です。",
  ],
  金運: [
    "収入源を見直す、あるいは増やす選択肢を検討しやすいタイミングです。",
    "大きな支出よりも、堅実な積み立てを意識したくなる時期です。",
    "これまでの支出パターンを振り返り、優先順位を組み直しやすい傾向があります。",
    "副業や新しい収入の形を試したい気持ちが強まりやすい時期です。",
    "将来設計を見据えた資産形成に関心が向きやすい傾向があります。",
  ],
  家族: [
    "家族との関わり方を見直す出来事が起こりやすいタイミングです。",
    "自分の家庭を持つ、あるいは今の家族との距離を調整する選択肢が優勢になります。",
    "親世代との関係を見つめ直すきっかけが訪れやすい時期です。",
    "家族に対する責任と自分の時間のバランスを取り直したくなる傾向があります。",
    "家族という単位そのものを自分なりに再定義したい気持ちが強まりやすい時期です。",
  ],
};

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

export function generateFutureTable(currentAge: number, seed: number): FutureCell[] {
  const cells: FutureCell[] = [];
  for (let yearOffset = 0; yearOffset < 20; yearOffset++) {
    const age = currentAge + yearOffset;
    const periodType = periodTypeForYear(yearOffset, age, seed);
    const adviceBank = ADVICE_BY_TYPE[periodType];
    const advice = adviceBank[(seed + yearOffset) % adviceBank.length];
    FUTURE_THEMES.forEach((theme, themeIndex) => {
      const bank = THEME_TEMPLATES[theme];
      const idx = (seed + yearOffset * 3 + themeIndex * 7) % bank.length;
      cells.push({
        yearOffset,
        age,
        theme,
        text: bank[idx],
        free: yearOffset === 0,
        periodType,
        advice,
      });
    });
  }
  return cells;
}
