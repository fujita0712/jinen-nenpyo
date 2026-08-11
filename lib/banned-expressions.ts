// 仕様§2.4の禁止表現(断定・保証・医療/金銭を煽る表現)を機械的にも弾く最終防衛ライン
// 「確実に」「絶対」は、それぞれ「着実に」「絶対に譲らない(性格描写)」のような、断定・保証の
// 意図がない一般的な副詞としても頻用され誤検知が多かったため対象から除外した。
// 「絶対に当たる」のような保証表現は「当たる」側のパターンで引き続き検出される。
export const BANNED_PATTERNS = [
  "当たる",
  "必ずそうなる",
  "100%",
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

// 「必ず」も「必ずしも〜ない」(=not necessarily)という否定表現の一部として使われることが多く、
// これは断定・保証とは正反対の意味のため除外する
const BENIGN_KANARAZU_COMPOUNDS = ["必ずしも"];

function matchesPattern(text: string, w: string): boolean {
  if (w === "当たる") {
    const stripped = BENIGN_ATARU_COMPOUNDS.reduce(
      (acc, benign) => acc.split(benign).join(""),
      text
    );
    return stripped.includes("当たる");
  }
  if (w === "必ず") {
    const stripped = BENIGN_KANARAZU_COMPOUNDS.reduce(
      (acc, benign) => acc.split(benign).join(""),
      text
    );
    return stripped.includes("必ず");
  }
  return text.includes(w);
}

export function containsBannedExpression(text: string): boolean {
  return BANNED_PATTERNS.some((w) => matchesPattern(text, w));
}

// デバッグ用: どの禁止語がどの文脈でマッチしたかを特定する
export function findBannedMatch(text: string): { pattern: string; snippet: string } | null {
  for (const w of BANNED_PATTERNS) {
    if (!matchesPattern(text, w)) continue;
    const idx = text.indexOf(w === "当たる" ? "当たる" : w);
    const snippet = idx >= 0 ? text.slice(Math.max(0, idx - 15), idx + 15) : "";
    return { pattern: w, snippet };
  }
  return null;
}
