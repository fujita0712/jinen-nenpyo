// 数秘術: ライフパス / ディスティニー / ソウルナンバー を自作ロジックで算出
// (仕様 §2.2: Python 想定と記載があるが MVP はクライアント計算でよいため TS で実装)

function reduceToSingleDigit(n: number): number {
  // マスターナンバー 11 / 22 / 33 は保持する
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}

export function lifePathNumber(birthDate: string): number {
  const digits = birthDate.replace(/-/g, "");
  const sum = digits.split("").reduce((s, d) => s + Number(d), 0);
  return reduceToSingleDigit(sum);
}

// 姓名からディスティニーナンバーを簡易算出(母音/子音を問わず文字コード剰余で疑似割当)
export function destinyNumber(name: string): number {
  const clean = name.replace(/\s/g, "");
  if (!clean) return 1;
  const sum = clean
    .split("")
    .reduce((s, ch) => s + (ch.codePointAt(0) ?? 0), 0);
  return reduceToSingleDigit(sum);
}

export function soulNumber(name: string): number {
  const clean = name.replace(/\s/g, "");
  if (!clean) return 1;
  // 奇数インデックス文字だけを母音相当として扱う簡易版
  const sum = clean
    .split("")
    .filter((_, i) => i % 2 === 0)
    .reduce((s, ch) => s + (ch.codePointAt(0) ?? 0), 0);
  return reduceToSingleDigit(sum);
}

export interface NumerologyResult {
  lifePath: number;
  destiny: number;
  soul: number;
}

export function calcNumerology(name: string, birthDate: string): NumerologyResult {
  return {
    lifePath: lifePathNumber(birthDate),
    destiny: destinyNumber(name),
    soul: soulNumber(name),
  };
}
