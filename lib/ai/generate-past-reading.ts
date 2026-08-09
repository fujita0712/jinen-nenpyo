import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ReadingInput, ageFromBirthDate } from "@/lib/types";
import { calcNumerology } from "@/lib/numerology";
import { sunSign, isNearSaturnReturn } from "@/lib/astrology";
import { calcSizhu } from "@/lib/sizhu";
import { drawCard, seedFromString } from "@/lib/tarot";
import { PastReadingSegment } from "@/lib/mock/past-readings";

const client = new Anthropic();

// output_config.format に渡す生の JSON Schema
// (zodOutputFormat ヘルパーはインストール済み zod のバージョンと型が合わないため使わない)
const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    chapters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          ageRange: { type: "string" },
          body: { type: "string" },
        },
        required: ["title", "ageRange", "body"],
        additionalProperties: false,
      },
    },
    highlights: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["chapters", "highlights"],
  additionalProperties: false,
} as const;

const ResponseSchema = z.object({
  chapters: z
    .array(
      z.object({
        title: z.string(),
        ageRange: z.string(),
        body: z.string(),
      })
    )
    .min(4),
  highlights: z.array(z.string()).min(3),
});

// 仕様§2.4の禁止表現(±バリエーション)を機械的にも弾く最終防衛ライン
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

const SYSTEM_PROMPT = `あなたは「人生年表」というサービスの過去年表(無料鑑定)の文章を書くライターです。
西洋占星術・数秘術・四柱推命・タロットの4占術の結果を統合し、ユーザー本人の入力データに基づいた説得力のある物語文を書いてください。

【厳守事項】
1. 出力は4つのChapterで構成すること:
   - Chapter 1: 幼児〜小学校(6〜12才)
   - Chapter 2: 中学〜高校(13〜18才)
   - Chapter 3: 大学〜20代前半(18〜25才)
   - Chapter 4: 20代後半〜現在(25才〜現在)
2. 各Chapterの本文(body)には、次の5項目のうち最低3つを必ず含めること: 年齢(具体的な年齢や年代)/出生順位(長子・中間・末子など)/兄弟構成(人数)/感情の描写/具体的な行動カテゴリ
3. 年齢の言及には必ず±2年程度の幅を持たせること(例:「15〜17才前後」「24〜27才頃」)。単一の年齢を断定的に書かない。
4. 他のユーザーにも使い回せるような一般論・テンプレート文を書かないこと。入力データ(性別・出生順位・兄弟構成・好きな教科・過去のライフイベント・心配しているテーマ・占術の算出結果)から具体的に分岐した、この人だけの文章にすること。
5. 次の表現は絶対に使用禁止: 「当たる」「必ずそうなる」「絶対」「100%」「確実に」「必ず」「儲かる」「治る」「寿命」「あなたにだけ当たる」。代わりに「〜しやすい」「テーマが優勢」「傾向がある」「タイミングとして」「選択肢が増える」のような中立的な表現を使うこと。
6. 最後に、4つのChapterの内容を踏まえた3行のハイライト(highlights)を書くこと。

出力は指定されたJSONスキーマに厳密に従うこと。`;

export async function generatePastReading(
  input: ReadingInput
): Promise<PastReadingSegment> {
  const age = ageFromBirthDate(input.birthDate);
  const numerology = calcNumerology(input.name, input.birthDate);
  const sign = sunSign(input.birthDate);
  const sizhu = calcSizhu(input.birthDate, input.birthTime);
  const tarot = drawCard(seedFromString(input.name + input.birthDate));
  const nearSaturnReturn = isNearSaturnReturn(age);

  const userPrompt = `以下はユーザーの入力データと、4占術による算出結果です。これらを踏まえて過去年表を書いてください。

【基本情報】
氏名: ${input.name}
性別: ${input.gender}
現在の年齢: ${age}才
出生順位: ${input.birthOrder}
兄の人数: ${input.olderSiblings}人 / 弟妹の人数: ${input.youngerSiblings}人
小学生時代に好きだった教科: ${[...input.favoriteSubjects, input.favoriteSubjectOther].filter(Boolean).join("、") || "特になし"}
過去5年以内のライフイベント: ${[...input.recentEvents, input.recentEventOther].filter(Boolean).join("、") || "特になし"}
今心配しているテーマ: ${input.concerns.join("、") || "特になし"}

【4占術の算出結果(この情報を文章内で自然に活かすこと)】
西洋占星術: 太陽星座は${sign}。土星回帰の時期に${nearSaturnReturn ? "近い、または通過中" : "まだ距離がある"}
数秘術: ライフパスナンバー${numerology.lifePath}、ディスティニーナンバー${numerology.destiny}、ソウルナンバー${numerology.soul}
四柱推命: 年柱${sizhu.yearPillar}・月柱${sizhu.monthPillar}・日柱${sizhu.dayPillar}・時柱${sizhu.hourPillar}(${sizhu.daiun})
タロット: ${tarot.name}${tarot.reversed ? "(逆位置)" : "(正位置)"}が示された`;

  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 3000,
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

  const chapters = parsed.chapters.slice(0, 4);
  const highlights = parsed.highlights.slice(0, 3);

  const allText = [...chapters.map((c) => c.body), ...highlights].join("\n");
  if (containsBannedExpression(allText)) {
    throw new Error("banned expression detected in generated text");
  }

  return {
    id: `ai-${seedFromString(input.name + input.birthDate)}`,
    matchLabel: "AI生成",
    chapters: [chapters[0], chapters[1], chapters[2], chapters[3]],
    highlights: [highlights[0], highlights[1], highlights[2]],
  };
}
