import { FutureCell, FUTURE_THEMES, FutureTheme } from "@/lib/mock/future-readings";
import { PeriodType } from "@/lib/period-types";

export interface HighlightSegment {
  kind: "highlight";
  yearOffset: number;
  age: number;
  periodType: PeriodType;
  advice: string;
  isFree: boolean;
  cellsByTheme: Record<FutureTheme, FutureCell>;
}

export interface QuietSegment {
  kind: "quiet";
  fromOffset: number;
  toOffset: number;
  fromAge: number;
  toAge: number;
}

export type FutureSegment = HighlightSegment | QuietSegment;

/**
 * 20年分のセルを、節目の年(highlight)と、連続する安定期(quiet)にグループ化する。
 * 安定期が2年以上連続する場合は1つのquietセグメントにまとめて存在感を弱め、
 * 節目の年は個別のhighlightセグメントとして強調する。yearOffset=0は常にhighlight扱い。
 */
export function groupFutureSegments(cells: FutureCell[]): FutureSegment[] {
  const maxYearOffset = Math.max(...cells.map((c) => c.yearOffset));
  const years = Array.from({ length: maxYearOffset + 1 }, (_, yearOffset) => {
    const rowCells = cells.filter((c) => c.yearOffset === yearOffset);
    const cellsByTheme = Object.fromEntries(
      FUTURE_THEMES.map((theme) => [theme, rowCells.find((c) => c.theme === theme)!])
    ) as Record<FutureTheme, FutureCell>;
    return {
      yearOffset,
      age: rowCells[0]?.age ?? 0,
      periodType: rowCells[0]?.periodType ?? ("steady" as PeriodType),
      advice: rowCells[0]?.advice ?? "",
      isFree: yearOffset === 0,
      cellsByTheme,
    };
  });

  const segments: FutureSegment[] = [];
  let i = 0;
  while (i < years.length) {
    const y = years[i];
    const isQuiet = y.periodType === "steady" && !y.isFree;
    if (!isQuiet) {
      segments.push({
        kind: "highlight",
        yearOffset: y.yearOffset,
        age: y.age,
        periodType: y.periodType,
        advice: y.advice,
        isFree: y.isFree,
        cellsByTheme: y.cellsByTheme,
      });
      i++;
      continue;
    }
    // 連続するsteady(非free)をまとめる
    let j = i;
    while (j < years.length && years[j].periodType === "steady" && !years[j].isFree) {
      j++;
    }
    const run = years.slice(i, j);
    segments.push({
      kind: "quiet",
      fromOffset: run[0].yearOffset,
      toOffset: run[run.length - 1].yearOffset,
      fromAge: run[0].age,
      toAge: run[run.length - 1].age,
    });
    i = j;
  }
  return segments;
}
