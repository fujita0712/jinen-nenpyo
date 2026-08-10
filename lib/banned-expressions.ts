// 仕様§2.4の禁止表現(断定・保証・医療/金銭を煽る表現)を機械的にも弾く最終防衛ライン
export const BANNED_PATTERNS = [
  "当たる",
  "必ずそうなる",
  "絶対",
  "100%",
  "確実に",
  "必ず",
  "儲かる",
  "治る",
  "寿命",
  "あなたにだけ当たる",
];

// 「当たる」は「心当たり」「思い当たる」「見当たる」等の無害な複合語にも部分一致してしまうため、
// それらを除去した残りに「当たる」が含まれるかどうかで判定する
const BENIGN_ATARU_COMPOUNDS = [
  "心当たり",
  "思い当たる",
  "思い当たった",
  "思い当たり",
  "見当たる",
  "見当たらない",
  "見当たり",
  "突き当たる",
  "突き当たった",
  "行き当たる",
  "行き当たった",
  "差し当たり",
  "当たり前",
  "当たり障り",
  "当たり年",
];

export function containsBannedExpression(text: string): boolean {
  return BANNED_PATTERNS.some((w) => {
    if (w !== "当たる") return text.includes(w);
    const stripped = BENIGN_ATARU_COMPOUNDS.reduce(
      (acc, benign) => acc.split(benign).join(""),
      text
    );
    return stripped.includes("当たる");
  });
}
