// タロット 78 枚メタデータ
// ライダー・ウェイト版(1909年発行、パブリックドメイン)のカード名称のみを採用する。
// 市販大手メーカーのカード名称・図案は一切使用しないこと(仕様 §2.2 / §9)

export const MAJOR_ARCANA = [
  "愚者",
  "魔術師",
  "女教皇",
  "女帝",
  "皇帝",
  "教皇",
  "恋人",
  "戦車",
  "力",
  "隠者",
  "運命の輪",
  "正義",
  "吊るされた男",
  "死神",
  "節制",
  "悪魔",
  "塔",
  "星",
  "月",
  "太陽",
  "審判",
  "世界",
] as const;

const SUITS = ["ワンド", "カップ", "ソード", "ペンタクル"] as const;
const MINOR_RANKS = [
  "エース",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "ペイジ",
  "ナイト",
  "クイーン",
  "キング",
] as const;

export interface TarotCard {
  name: string;
  arcana: "major" | "minor";
  reversed: boolean;
}

export const MINOR_ARCANA: string[] = SUITS.flatMap((suit) =>
  MINOR_RANKS.map((rank) => `${suit}の${rank}`)
);

export const FULL_DECK: string[] = [...MAJOR_ARCANA, ...MINOR_ARCANA]; // 22 + 56 = 78枚

// 生年月日をシードにした疑似乱数でカードを引く(実 API 未接続、§7)
export function drawCard(seed: number): TarotCard {
  const index = Math.abs(seed) % FULL_DECK.length;
  const reversed = Math.abs(Math.floor(seed / FULL_DECK.length)) % 2 === 1;
  return { name: FULL_DECK[index], arcana: index < MAJOR_ARCANA.length ? "major" : "minor", reversed };
}

export function seedFromString(input: string): number {
  let seed = 0;
  for (const ch of input) seed = (seed * 31 + (ch.codePointAt(0) ?? 0)) % 100000;
  return seed;
}
