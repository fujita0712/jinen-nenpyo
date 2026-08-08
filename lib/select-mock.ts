import { ReadingInput, ageFromBirthDate } from "./types";
import { PAST_READING_SEGMENTS, PastReadingSegment } from "./mock/past-readings";

// 入力値からダミーセグメントをルーティングする(§7: LLM未接続方針)
export function selectPastReadingSegment(input: ReadingInput): PastReadingSegment {
  const hasEvent = (keyword: string) =>
    input.recentEvents.some((e) => e.includes(keyword)) ||
    (input.recentEventOther ?? "").includes(keyword);

  if (input.gender === "女性" && input.birthOrder === "長子" && hasEvent("転職")) {
    return PAST_READING_SEGMENTS[0];
  }
  if (input.gender === "男性" && input.birthOrder === "中間" && hasEvent("結婚")) {
    return PAST_READING_SEGMENTS[1];
  }
  if (
    input.gender === "女性" &&
    input.birthOrder === "末子" &&
    (hasEvent("独立") || hasEvent("留学"))
  ) {
    return PAST_READING_SEGMENTS[2];
  }

  // 性別・順位のゆるいマッチング(完全一致がない場合の準フォールバック)
  if (input.gender === "女性" && input.birthOrder === "長子") return PAST_READING_SEGMENTS[0];
  if (input.gender === "男性" && input.birthOrder === "中間") return PAST_READING_SEGMENTS[1];
  if (input.gender === "女性" && input.birthOrder === "末子") return PAST_READING_SEGMENTS[2];

  return PAST_READING_SEGMENTS[3]; // デフォルトセグメント
}

export function currentAge(input: ReadingInput): number {
  return ageFromBirthDate(input.birthDate);
}
