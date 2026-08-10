import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ReadingInput, ageFromBirthDate } from "@/lib/types";
import { calcNumerology } from "@/lib/numerology";
import { sunSign, isNearSaturnReturn } from "@/lib/astrology";
import { FutureCell, FUTURE_THEMES } from "@/lib/mock/future-readings";

const client = new Anthropic();

const YEAR_COUNT = 20;

const PERIOD_TYPE_ENUM = ["decisive", "turning_point", "endurance", "steady"] as const;

const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    years: {
      type: "array",
      items: {
        type: "object",
        properties: {
          yearOffset: { type: "integer" },
          work: { type: "string" },
          love: { type: "string" },
          money: { type: "string" },
          family: { type: "string" },
          periodType: { type: "string", enum: PERIOD_TYPE_ENUM as unknown as string[] },
        },
        required: ["yearOffset", "work", "love", "money", "family", "periodType"],
        additionalProperties: false,
      },
    },
  },
  required: ["years"],
  additionalProperties: false,
} as const;

const YearSchema = z.object({
  yearOffset: z.number(),
  work: z.string(),
  love: z.string(),
  money: z.string(),
  family: z.string(),
  periodType: z.enum(PERIOD_TYPE_ENUM),
});
const ResponseSchema = z.object({ years: z.array(YearSchema) });

const BANNED_PATTERNS = [
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
function containsBannedExpression(text: string): boolean {
  return BANNED_PATTERNS.some((w) => text.includes(w));
}

const SYSTEM_PROMPT = `あなたは「人生年表」というサービスの未来年表(有料鑑定)の文章を書くライターです。
西洋占星術・数秘術・四柱推命・タロットの4占術の結果を統合し、ユーザー本人の入力データに基づいた未来20年分の年表を書いてください。

【厳守事項】
1. 直近12ヶ月(yearOffset=0)から19年後(yearOffset=19)まで、合計20年分すべてを出力すること。
2. 各年について「仕事」「恋愛」「金運」「家族」の4テーマそれぞれに1〜2文の短い文章を書くこと(1テーマあたり40〜90文字程度)。
3. 入力データ(性別・出生順位・過去のライフイベント・心配しているテーマ・占術の算出結果)を踏まえ、この人固有の傾向が感じられる文章にすること。ただし同じ表現の繰り返しは避け、年ごとにテーマの強弱や具体性を変化させること。
4. 土星回帰(27〜30才前後、57〜60才前後)にあたる年齢の年は、そのテーマを明確に反映させること。
5. 各年(yearOffset)に、その年の性質を表す periodType を1つ割り当てること。値は以下の4種類のいずれか:
   - "decisive"(勝負の年): 大きな決断・行動に踏み切りやすい年
   - "turning_point"(転機): 環境や方向性が変わりやすい年
   - "endurance"(耐える時期): プレッシャーや葛藤を抱えながら耐える傾向がある年
   - "steady"(安定期): 落ち着いて過ごしやすい年
   20年間のうち大半は"steady"とし、"decisive"は2〜3年、"turning_point"は2〜4年、"endurance"は2〜3年程度に絞ること(多用しすぎない)。土星回帰にあたる年は"turning_point"または"decisive"を優先すること。
6. 次の表現は絶対に使用禁止: 「当たる」「必ずそうなる」「絶対」「100%」「確実に」「必ず」「儲かる」「治る」「寿命」「あなたにだけ当たる」。代わりに「〜しやすい」「テーマが優勢」「傾向がある」「タイミングとして」「選択肢が増える」のような中立的な表現を使うこと。

出力は指定されたJSONスキーマに厳密に従い、yearsは必ず20件(yearOffset 0〜19)にすること。`;

export async function generateFutureReading(
  input: ReadingInput
): Promise<FutureCell[]> {
  const age = ageFromBirthDate(input.birthDate);
  const numerology = calcNumerology(input.name, input.birthDate);
  const sign = sunSign(input.birthDate);

  const saturnYears: number[] = [];
  for (let offset = 0; offset < YEAR_COUNT; offset++) {
    if (isNearSaturnReturn(age + offset)) saturnYears.push(offset);
  }

  const userPrompt = `以下はユーザーの入力データと、算出結果です。現在の年齢は${age}才です。

【基本情報】
氏名: ${input.name}
性別: ${input.gender}
出生順位: ${input.birthOrder}
過去5年以内のライフイベント: ${[...input.recentEvents, input.recentEventOther].filter(Boolean).join("、") || "特になし"}
今心配しているテーマ: ${input.concerns.join("、") || "特になし"}

【占術の算出結果】
西洋占星術: 太陽星座は${sign}
数秘術: ライフパスナンバー${numerology.lifePath}、ディスティニーナンバー${numerology.destiny}、ソウルナンバー${numerology.soul}
土星回帰に該当する未来の年(yearOffset): ${saturnYears.length > 0 ? saturnYears.join("、") : "該当なし"}

現在(yearOffset=0、${age}才)から19年後(yearOffset=19、${age + 19}才)まで、20年分すべてを生成してください。`;

  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 8000,
    thinking: { type: "disabled" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
    output_config: { format: { type: "json_schema", schema: RESPONSE_JSON_SCHEMA } },
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("no text block in response");
  }

  const parsed = ResponseSchema.parse(JSON.parse(textBlock.text));

  const allText = parsed.years
    .map((y) => `${y.work}${y.love}${y.money}${y.family}`)
    .join("");
  if (containsBannedExpression(allText)) {
    throw new Error("banned expression detected in generated text");
  }

  const byOffset = new Map(parsed.years.map((y) => [y.yearOffset, y]));

  const cells: FutureCell[] = [];
  for (let yearOffset = 0; yearOffset < YEAR_COUNT; yearOffset++) {
    const year = byOffset.get(yearOffset);
    const themeText: Record<(typeof FUTURE_THEMES)[number], string> = {
      仕事: year?.work ?? "この時期のテーマはまだ言語化の途中です。",
      恋愛: year?.love ?? "この時期のテーマはまだ言語化の途中です。",
      金運: year?.money ?? "この時期のテーマはまだ言語化の途中です。",
      家族: year?.family ?? "この時期のテーマはまだ言語化の途中です。",
    };
    for (const theme of FUTURE_THEMES) {
      cells.push({
        yearOffset,
        age: age + yearOffset,
        theme,
        text: themeText[theme],
        free: yearOffset === 0,
        periodType: year?.periodType ?? "steady",
      });
    }
  }

  return cells;
}
