import { FutureCell } from "@/lib/mock/future-readings";
import { PERIOD_META } from "@/lib/period-types";

export default function FutureIntensityTimeline({ cells }: { cells: FutureCell[] }) {
  const maxYearOffset = Math.max(...cells.map((c) => c.yearOffset));
  const years = Array.from({ length: maxYearOffset + 1 }, (_, yearOffset) => {
    const cell = cells.find((c) => c.yearOffset === yearOffset);
    return { yearOffset, age: cell?.age ?? 0, periodType: cell?.periodType ?? "steady" };
  });

  return (
    <div className="mb-8">
      <div className="flex items-end gap-[3px] h-14">
        {years.map((y) => {
          const meta = PERIOD_META[y.periodType];
          const heightPercent = 25 + meta.intensity * 18.75; // 1→43.75%, 4→100%
          return (
            <div
              key={y.yearOffset}
              className="flex-1 rounded-t-sm transition-all"
              style={{ height: `${heightPercent}%`, backgroundColor: meta.hex }}
              title={`${y.age}才頃・${meta.label}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{years[0]?.age}才</span>
        <span>{years[years.length - 1]?.age}才</span>
      </div>
    </div>
  );
}
