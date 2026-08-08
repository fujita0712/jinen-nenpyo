export type BirthOrder =
  | "長子"
  | "中間"
  | "末子"
  | "一人っ子"
  | "双子年上"
  | "双子年下";

export type ConcernTheme = "仕事" | "恋愛" | "家族" | "金運" | "自分らしさ";

export interface ReadingInput {
  name: string;
  gender: "女性" | "男性" | "回答しない";
  birthDate: string; // YYYY-MM-DD
  birthTimeUnknown: boolean;
  birthTime: string; // HH:MM
  birthPlace: string;
  birthOrder: BirthOrder;
  olderSiblings: number;
  youngerSiblings: number;
  favoriteSubjects: string[];
  favoriteSubjectOther?: string;
  recentEvents: string[];
  recentEventOther?: string;
  concerns: ConcernTheme[];
  newsletterOptIn: boolean;
  email: string;
}

export interface ConfidenceResult {
  yesCount: number;
  score: number; // 0.5 - 5
  stars: number; // rounded for display (0-5, step 0.5)
}

// URL の単一パラメータ `d` に JSON を詰めて画面間を橋渡しする(DB不要方針 §7)
export function encodeReadingInput(input: ReadingInput): string {
  return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(input)))));
}

export function decodeReadingInput(param: string | null): ReadingInput | null {
  if (!param) return null;
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(param))));
    return JSON.parse(json) as ReadingInput;
  } catch {
    return null;
  }
}

export function ageFromBirthDate(birthDate: string): number {
  const b = new Date(birthDate);
  if (Number.isNaN(b.getTime())) return 30;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}
