import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ReadingInput, ageFromBirthDate } from "@/lib/types";
import { calcNumerology } from "@/lib/numerology";
import { sunSign, isNearSaturnReturn } from "@/lib/astrology";
import { calcSizhu } from "@/lib/sizhu";
import { drawCard, seedFromString } from "@/lib/tarot";
import { PastReadingSegment } from "@/lib/mock/past-readings";
import { containsBannedExpression, findBannedMatch } from "@/lib/banned-expressions";

const client = new Anthropic();

// output_config.format に渡す生の JSON Schema
// (zodOutputFormat ヘルパーはインストール済み zod のバージョンと型が合わないため使わない)
const PERIOD_TYPE_ENUM = ["decisive", "turning_point", "endurance", "steady"] as const;

// Claude の構造化出力(output_config.format)は配列の minItems/maxItems を実質サポートしない
// (0 or 1 のみ許可され、それ以外を指定すると400エラーになる)。配列の長さで「章が足りない」
// 不具合が起きたため、chapter1〜4 / highlight1〜3 を個別の必須プロパティとして持たせ、
// スキーマの required 制約(こちらは確実に強制される)で4章・3行を保証する。
const CHAPTER_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    ageRange: { type: "string" },
    body: { type: "string" },
    periodType: { type: "string", enum: PERIOD_TYPE_ENUM as unknown as string[] },
    periodAge: { type: "string" },
  },
  required: ["title", "ageRange", "body", "periodType", "periodAge"],
  additionalProperties: false,
} as const;

const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    chapter1: CHAPTER_SCHEMA,
    chapter2: CHAPTER_SCHEMA,
    chapter3: CHAPTER_SCHEMA,
    chapter4: CHAPTER_SCHEMA,
    highlight1: { type: "string" },
    highlight2: { type: "string" },
    highlight3: { type: "string" },
  },
  required: ["chapter1", "chapter2", "chapter3", "chapter4", "highlight1", "highlight2", "highlight3"],
  additionalProperties: false,
} as const;

const ChapterZodSchema = z.object({
  title: z.string(),
  ageRange: z.string(),
  body: z.string(),
  periodType: z.enum(PERIOD_TYPE_ENUM),
  periodAge: z.string(),
});

const ResponseSchema = z.object({
  chapter1: ChapterZodSchema,
  chapter2: ChapterZodSchema,
  chapter3: ChapterZodSchema,
  chapter4: ChapterZodSchema,
  highlight1: z.string(),
  highlight2: z.string(),
  highlight3: z.string(),
});

const SYSTEM_PROMPT = `あなたは「人生年表」というサービスの過去年表(無料鑑定)の文章を書く、腕利きの占い師です。
読んだ人が「え、なんで分かるの」と息を呑むような、鋭く踏み込んだ鑑定文を書いてください。当たり障りのない一般論ではなく、この人だけに向けた、刺さる文章を目指します。

【文体・トーンについて(最重要)】
- 教科書のような説明口調ではなく、目の前で語りかけるように、断定的に書くこと。
- 文末を「〜傾向があります」「〜可能性があります」「〜やすい時期です」のようなヘッジ表現で埋め尽くさないこと。1つのChapter(本文)につきヘッジ表現は1〜2回までに抑え、それ以外は言い切りで書く。同じ文末表現を連続させない。
- 抽象的な説明ではなく、具体的な情景やワンシーンを描写すること(例:「教室の隅で一人、時間割を眺めていた」のような、目に浮かぶ描写)。
- 各Chapterの中に、読者の記憶を突く問いかけを最低1つ入れること(例:「〜という場面、心当たりはありませんか」)。
- 各Chapterの結びは、読み手の心に残る一文で締めること。尻すぼみに終わらせない。
- 「あなた」と直接語りかける文と、名前で呼ぶ文を織り交ぜ、一人の相手に向けて書いていることが伝わるようにすること。

【紋切り型を避ける(最重要)】
占い鑑定にありがちな、当たり障りのない自己啓発フレーズだけで構成された文章は絶対に書かないこと。以下のような表現を主軸にすることを禁止する:
「バランスを取る」「大切にする」「見直す」「向き合う」「整理する」「寄り添う」「〜という時期でした」で終わる説明文、「〜な傾向があります」の羅列。
これらは誰にでも当てはまってしまう「ありきたりな鑑定」であり、絶対に避けること。
代わりに、以下を満たすこと:
- 各Chapterに、この人の入力データの組み合わせでしか出てこないような、具体的で意外性のある切り口を最低1つ入れること(例:「好きな教科が図工」「兄弟がいない」「転職経験あり」等の複数の要素を掛け合わせた、この人固有の解釈)。
- 四柱推命の干支・タロットカード・数秘術の数字は、「〇〇が示す△△」という辞書的な説明で終わらせず、その人の具体的な行動や場面に翻訳して使うこと(例:干支の意味を直接説明するのではなく、その気質が実際にどんな行動として現れたかを描写する)。
- 誰が読んでも「まあそういう人多いよね」と思われるような凡庸な内容ではなく、この人だけに刺さる、少し踏み込んだ解釈を書くこと。無難さより具体性を優先する。

【厳守事項】
1. 出力は4つのChapterで構成すること:
   - Chapter 1: 幼児〜小学校(6〜12才)
   - Chapter 2: 中学〜高校(13〜18才)
   - Chapter 3: 大学〜20代前半(18〜25才)
   - Chapter 4: 20代後半〜現在(25才〜現在)
2. 各Chapterの本文(body)には、次の5項目のうち最低3つを必ず含めること: 年齢(具体的な年齢や年代)/出生順位(長子・中間・末子など)/兄弟構成(人数)/感情の描写/具体的な行動カテゴリ
3. 年齢の言及には必ず±2年程度の幅を持たせること(例:「15〜17才前後」「24〜27才頃」)。単一の年齢を断定的に書かない。
4. 他のユーザーにも使い回せるような一般論・テンプレート文を書かないこと。入力データ(性別・出生順位・兄弟構成・好きな教科・過去のライフイベント・心配しているテーマ・占術の算出結果)から具体的に分岐した、この人だけの文章にすること。
5. 次の表現は絶対に使用禁止: 「当たる」「必ずそうなる」「絶対」「100%」「確実に」「必ず」「儲かる」「治る」「寿命」「あなたにだけ当たる」。言い切り調で書きつつも、この禁止表現だけは避けること(「〜だった」「〜していた」のような事実断定調は問題ない。問題なのは上記の絶対視・保証を示す語のみ)。
6. 最後に、4つのChapterの内容を踏まえた3行のハイライト(highlights)を書くこと。この3行は、続きとなる有料の未来年表を読みたくなるような、余韻と引きを持たせた文章にすること。
7. 各Chapterに、その時期の性質を表す periodType を1つ割り当てること。値は以下の4種類のいずれか:
   - "decisive"(勝負の年): 大きな決断・行動に踏み切った時期
   - "turning_point"(転機): 環境や方向性が変わった時期
   - "endurance"(耐える時期): プレッシャーや葛藤を抱えながら耐えていた時期
   - "steady"(安定期): 土台形成・落ち着いていた時期
   4つのChapterのperiodTypeは、少なくとも2種類以上のバリエーションを持たせ、全て同じ値にしないこと。土星回帰の時期(27〜30才前後)にかかるChapterは"decisive"または"turning_point"を優先すること。
8. 各Chapterに periodAge(そのperiodTypeを象徴する具体的な年齢、例:「16才頃」)を1つ添えること。ageRangeの範囲内の年齢にすること。

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

  if (response.stop_reason === "max_tokens") {
    console.error("generate-past-reading hit max_tokens; output_tokens:", response.usage?.output_tokens);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(textBlock.text);
  } catch (err) {
    console.error(
      "generate-past-reading JSON parse failed. stop_reason:",
      response.stop_reason,
      "output_tokens:",
      response.usage?.output_tokens,
      "text tail:",
      textBlock.text.slice(-300)
    );
    throw err;
  }

  let parsed: z.infer<typeof ResponseSchema>;
  try {
    parsed = ResponseSchema.parse(parsedJson);
  } catch (err) {
    console.error(
      "generate-past-reading schema validation failed. stop_reason:",
      response.stop_reason,
      "output_tokens:",
      response.usage?.output_tokens
    );
    throw err;
  }

  const chapters = [parsed.chapter1, parsed.chapter2, parsed.chapter3, parsed.chapter4] as const;
  const highlights = [parsed.highlight1, parsed.highlight2, parsed.highlight3] as const;

  const allText = [...chapters.map((c) => c.body), ...highlights].join("\n");
  if (containsBannedExpression(allText)) {
    const match = findBannedMatch(allText);
    console.error("banned expression match:", match);
    throw new Error("banned expression detected in generated text");
  }

  return {
    id: `ai-${seedFromString(input.name + input.birthDate)}`,
    matchLabel: "AI生成",
    chapters: [chapters[0], chapters[1], chapters[2], chapters[3]],
    highlights: [highlights[0], highlights[1], highlights[2]],
  };
}
