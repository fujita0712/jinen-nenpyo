import Link from "next/link";
import { FutureCell, FUTURE_THEMES } from "@/lib/mock/future-readings";

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
  const rows = Array.from({ length: maxYearOffset + 1 }, (_, y) => y);

  return (
    <div className="space-y-4">
      {rows.map((yearOffset) => {
        const rowCells = cells.filter((c) => c.yearOffset === yearOffset);
        const isFree = yearOffset === 0;
        const visible = paid || isFree;

        return (
          <div key={yearOffset} className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="bg-jade/10 px-4 py-2 text-xs font-medium text-jade-dark">
              {isFree ? "直近12ヶ月" : `${rowCells[0]?.age ?? ""}才頃`}
              {isFree && <span className="ml-2 text-jade">無料公開中</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
              {FUTURE_THEMES.map((theme) => {
                const cell = rowCells.find((c) => c.theme === theme);
                return (
                  <div key={theme} className="bg-white p-3 relative min-h-[92px]">
                    <p className="text-xs text-gray-400 mb-1">{theme}</p>
                    {visible ? (
                      <p className="text-sm text-gray-700 leading-snug">{cell?.text}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-700 leading-snug pixelated-overlay">
                          {cell?.text}
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                          <span className="text-[10px] text-gray-400">課金すると全文表示されます</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {!paid && (
        <div className="text-center pt-6">
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
