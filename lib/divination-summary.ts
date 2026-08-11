import { ReadingInput, ageFromBirthDate } from "@/lib/types";
import { calcNumerology } from "@/lib/numerology";
import { sunSign, isNearSaturnReturn } from "@/lib/astrology";
import { calcSizhu } from "@/lib/sizhu";
import { drawCard, seedFromString } from "@/lib/tarot";

export interface DivinationSummary {
  age: number;
  sunSign: string;
  nearSaturnReturn: boolean;
  lifePath: number;
  destiny: number;
  soul: number;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  daiun: string;
  tarotName: string;
  tarotReversed: boolean;
}

// 生年月日等から4占術の算出結果を求める。AIの生成結果とは独立に、常に同じ入力からは
// 同じ値が決定的に求まる(西洋占星術・数秘術・四柱推命・タロットいずれも純粋関数)。
export function computeDivinationSummary(input: ReadingInput): DivinationSummary {
  const age = ageFromBirthDate(input.birthDate);
  const numerology = calcNumerology(input.name, input.birthDate);
  const sign = sunSign(input.birthDate);
  const sizhu = calcSizhu(input.birthDate, input.birthTime);
  const tarot = drawCard(seedFromString(input.name + input.birthDate));

  return {
    age,
    sunSign: sign,
    nearSaturnReturn: isNearSaturnReturn(age),
    lifePath: numerology.lifePath,
    destiny: numerology.destiny,
    soul: numerology.soul,
    yearPillar: sizhu.yearPillar,
    monthPillar: sizhu.monthPillar,
    dayPillar: sizhu.dayPillar,
    hourPillar: sizhu.hourPillar,
    daiun: sizhu.daiun,
    tarotName: tarot.name,
    tarotReversed: tarot.reversed,
  };
}
