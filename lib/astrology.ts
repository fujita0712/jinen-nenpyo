// 西洋占星術ユーティリティ
// TODO: Swiss Ephemeris 相当の厳密計算は本フェーズのスコープ外のためモック実装とする(§4.1)

const SUN_SIGNS = [
  { name: "牡羊座", start: [3, 21], end: [4, 19] },
  { name: "牡牛座", start: [4, 20], end: [5, 20] },
  { name: "双子座", start: [5, 21], end: [6, 21] },
  { name: "蟹座", start: [6, 22], end: [7, 22] },
  { name: "獅子座", start: [7, 23], end: [8, 22] },
  { name: "乙女座", start: [8, 23], end: [9, 22] },
  { name: "天秤座", start: [9, 23], end: [10, 23] },
  { name: "蠍座", start: [10, 24], end: [11, 22] },
  { name: "射手座", start: [11, 23], end: [12, 21] },
  { name: "山羊座", start: [12, 22], end: [1, 19] },
  { name: "水瓶座", start: [1, 20], end: [2, 18] },
  { name: "魚座", start: [2, 19], end: [3, 20] },
];

export function sunSign(birthDate: string): string {
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return "牡羊座";
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const found = SUN_SIGNS.find(({ start, end }) => {
    const [sm, sd] = start;
    const [em, ed] = end;
    if (sm === em) return month === sm && day >= sd && day <= ed;
    if (sm < em) return (month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em);
    // 山羊座のような年またぎ
    return (month === sm && day >= sd) || (month === em && day <= ed);
  });
  return found?.name ?? "山羊座";
}

// 土星回帰(Saturn Return)のおおよその年齢帯。二度目の到来もモック的に扱う。
export const SATURN_RETURN_AGE_RANGES: [number, number][] = [
  [28, 30],
  [57, 59],
];

export function isNearSaturnReturn(age: number): boolean {
  return SATURN_RETURN_AGE_RANGES.some(([start, end]) => age >= start - 1 && age <= end + 1);
}
