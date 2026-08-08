import { z } from "zod";

export const FAVORITE_SUBJECTS = ["国語", "算数", "理科", "社会", "図工", "音楽", "体育"] as const;
export const RECENT_EVENTS = [
  "結婚",
  "出産",
  "転職",
  "独立",
  "留学",
  "転居",
  "離婚",
  "特になし",
] as const;
export const CONCERN_THEMES = ["仕事", "恋愛", "家族", "金運", "自分らしさ"] as const;
export const BIRTH_ORDERS = ["長子", "中間", "末子", "一人っ子", "双子年上", "双子年下"] as const;

export const inputFormSchema = z.object({
  privacyAgree: z.literal(true, {
    errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }),
  }),
  name: z.string().min(1, "氏名を入力してください"),
  gender: z.enum(["女性", "男性", "回答しない"], {
    errorMap: () => ({ message: "性別を選択してください" }),
  }),
  birthYear: z.string().min(4, "生年を選択してください"),
  birthMonth: z.string().min(1, "生月を選択してください"),
  birthDay: z.string().min(1, "生日を選択してください"),
  birthTimeUnknown: z.boolean(),
  birthTime: z.string(),
  postalCode: z.string().optional(),
  birthPlace: z.string().min(1, "出生地を入力してください"),
  birthOrder: z.enum(BIRTH_ORDERS, {
    errorMap: () => ({ message: "出生順位を選択してください" }),
  }),
  olderSiblings: z.coerce.number().min(0).max(5),
  youngerSiblings: z.coerce.number().min(0).max(5),
  favoriteSubjects: z.array(z.string()).default([]),
  favoriteSubjectOther: z.string().optional(),
  recentEvents: z.array(z.string()).default([]),
  recentEventOther: z.string().optional(),
  concerns: z.array(z.enum(CONCERN_THEMES)).max(3, "テーマは最大3つまでです").default([]),
  newsletterOptIn: z.boolean().default(false),
  email: z.string().email("メールアドレスの形式が正しくありません"),
});

export type InputFormValues = z.infer<typeof inputFormSchema>;
