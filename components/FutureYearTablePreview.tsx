import Link from "next/link";
import { FutureCell } from "@/lib/mock/future-readings";
import { PERIOD_META } from "@/lib/period-types";
import FutureIntensityTimeline from "@/components/FutureIntensityTimeline";

export default function FutureYearTablePreview({
  cells,
  paid,
  paywallHref,
}: {
  cells: FutureCell[];
  paid: boolean;
  paywallHref: string;
}) {
  const maxYearOffset = Math.max(...cells.map((c) => c.yearOffset));
  const years = Array.from({ length: maxYearOffset + 1 }, (_, yearOffset) => {
    const cell = cells.find((c) => c.yearOffset === yearOffset);
    return {
      yearOffset,
      age: cell?.age ?? 0,
      free: yearOffset === 0,
      periodType: cell?.periodType ?? "steady",
      flow: cell?.flow ?? "",
      advice: cell?.advice ?? "",
    };
  });

  return (
    <div>
      <FutureIntensityTimeline cells={cells} />
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-200">
              <th className="py-2 pr-3 font-medium w-20">年齢</th>
              <th className="py-2 pr-3 font-medium">運気の流れ</th>
              <th className="py-2 font-medium w-56">アドバイス</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y) => {
              const meta = PERIOD_META[y.periodType];
              const visible = paid || y.free;
              return (
                <tr key={y.yearOffset} className={`border-b border-gray-100 ${meta.borderClassName} pl-2`}>
                  <td className="py-3 pr-3 align-top whitespace-nowrap">
                    <div className="text-gray-800">{y.free ? "直近12ヶ月" : `${y.age}才`}</div>
                    {y.periodType !== "steady" && (
                      <span
                        className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${meta.badgeClassName}`}
                      >
                        <span aria-hidden>{meta.mark}</span>
                        {meta.label}
                      </span>
                    )}
                    {y.free && <div className="text-[10px] text-jade mt-1">無料公開中</div>}
                  </td>
                  <td className="py-3 pr-3 align-top text-gray-700 leading-snug relative">
                    {visible ? y.flow : <MaskedText />}
                  </td>
                  <td className="py-3 align-top text-gray-700 leading-snug relative">
                    {visible ? y.advice : <MaskedText short />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!paid && (
        <div className="text-center pt-8">
          <Link
            href={paywallHref}
            className="inline-block px-8 py-4 rounded-full bg-jade text-white text-lg font-medium hover:bg-jade-dark transition-colors"
          >
            未来年表PDFを受け取る
          </Link>
        </div>
      )}
    </div>
  );
}

function MaskedText({ short }: { short?: boolean }) {
  return (
    <span className="text-xs text-gray-400">
      {short ? "課金すると表示されます" : "課金すると全文表示されます"}
    </span>
  );
}
