import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ReadingInput, ageFromBirthDate } from "@/lib/types";
import { calcNumerology } from "@/lib/numerology";
import { sunSign, isNearSaturnReturn } from "@/lib/astrology";
import { FutureCell } from "@/lib/mock/future-readings";
import { containsBannedExpression } from "@/lib/banned-expressions";

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
          periodType: { type: "string", enum: PERIOD_TYPE_ENUM as unknown as string[] },
          flow: { type: "string" },
          advice: { type: "string" },
        },
        required: ["yearOffset", "periodType", "flow", "advice"],
        additionalProperties: false,
      },
    },
  },
  required: ["years"],
  additionalProperties: false,
} as const;

const YearSchema = z.object({
  yearOffset: z.number(),
  periodType: z.enum(PERIOD_TYPE_ENUM),
  flow: z.string(),
  advice: z.string(),
});
const ResponseSchema = z.object({ years: z.array(YearSchema) });

const SYSTEM_PROMPT = `あなたは「人生年表」というサービスの未来年表(有料鑑定)の文章を書くライターです。
西洋占星術・数秘術・四柱推命・タロットの4占術の結果を統合し、ユーザー本人の入力データに基づいた未来20年分の年表を書いてください。

【紋切り型を避ける(最重要)】
「バランスを取る」「大切にする」「見直す」「向き合う」「整理する」のような、誰にでも当てはまる自己啓発フレーズだけで埋めた、当たり障りのない鑑定は絶対に書かないこと。
periodTypeが"steady"以外の年(decisive/turning_point/endurance)は特に、その人の入力データの組み合わせでしか出てこない具体的な切り口を必ず入れ、「まあそういう人多いよね」で終わらない、この人だけに刺さる踏み込んだ内容にすること。無難さより具体性を優先する。

【厳守事項】
1. 直近12ヶ月(yearOffset=0)から19年後(yearOffset=19)まで、合計20年分すべてを出力すること。
2. 入力データ(性別・出生順位・過去のライフイベント・心配しているテーマ・占術の算出結果)を踏まえ、この人固有の傾向が感じられる文章にすること。ただし同じ表現の繰り返しは避け、年ごとに具体性を変化させること。
3. 土星回帰(27〜30才前後、57〜60才前後)にあたる年齢の年は、その影響を明確に反映させること。
4. 各年(yearOffset)に、その年の性質を表す periodType を1つ割り当てること。値は以下の4種類のいずれか:
   - "decisive"(勝負の年): 大きな決断・行動に踏み切りやすい年
   - "turning_point"(転機): 環境や方向性が変わりやすい年
   - "endurance"(耐える時期): プレッシャーや葛藤を抱えながら耐える傾向がある年
   - "steady"(安定期): 落ち着いて過ごしやすい年
   20年間のうち大半は"steady"とし、"decisive"は2〜3年、"turning_point"は2〜4年、"endurance"は2〜3年程度に絞ること(多用しすぎない)。土星回帰にあたる年は"turning_point"または"decisive"を優先すること。
5. 各年に flow(その年の運気の流れ)を1つ書くこと。仕事・恋愛・金運・家族という人生の主要な領域を念頭に置きつつ、それらを機械的に列挙するのではなく、その年全体としてどんな流れ・エネルギーの年なのかを80〜120文字程度の一つながりの文章にまとめること。periodTypeが"steady"の年は淡々とした短めの記述で構わないが、"decisive"「"turning_point"「"endurance"の年は、この人固有の具体的な状況が伝わる書き方にすること。
6. 各年に advice(一言アドバイス)を1つ添えること。periodTypeが"decisive"「"turning_point"「"endurance"の年は、flowの内容と具体的に紐づいた、この年ならではの行動や心構えを20〜40文字程度で書くこと。「一人で抱え込まず、早めに相談を」のような汎用フレーズの使い回しは避け、その年の具体的な状況(何についての決断か、何が変わるのか)が分かるアドバイスにすること。"steady"の年は「今のペースを維持で十分」のような軽い一言で構わない。
7. 次の表現は絶対に使用禁止: 「当たる」「必ずそうなる」「絶対」「100%」「必ず」「儲かる」「治る」「寿命」「あなたにだけ当たる」。代わりに「〜しやすい」「テーマが優勢」「傾向がある」「タイミングとして」「選択肢が増える」のような中立的な表現を使うこと。

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
    max_tokens: 6000,
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

  const allText = parsed.years.map((y) => `${y.flow}${y.advice}`).join("");
  if (containsBannedExpression(allText)) {
    throw new Error("banned expression detected in generated text");
  }

  const byOffset = new Map(parsed.years.map((y) => [y.yearOffset, y]));

  const cells: FutureCell[] = [];
  for (let yearOffset = 0; yearOffset < YEAR_COUNT; yearOffset++) {
    const year = byOffset.get(yearOffset);
    cells.push({
      yearOffset,
      age: age + yearOffset,
      free: yearOffset === 0,
      periodType: year?.periodType ?? "steady",
      flow: year?.flow ?? "落ち着いて過ごせる時期です。",
      advice: year?.advice ?? "今のペースを維持で十分です。",
    });
  }

  return cells;
}
