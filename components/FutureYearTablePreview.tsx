import Link from "next/link";
import { FutureCell, FUTURE_THEMES } from "@/lib/mock/future-readings";
import { PERIOD_META } from "@/lib/period-types";
import { groupFutureSegments, HighlightSegment, QuietSegment } from "@/lib/future-segments";
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
  const segments = groupFutureSegments(cells);

  return (
    <div>
      <FutureIntensityTimeline cells={cells} />

      <div className="space-y-4">
        {segments.map((segment) =>
          segment.kind === "quiet" ? (
            <QuietRow key={`quiet-${segment.fromOffset}`} segment={segment} />
          ) : (
            <HighlightCard key={segment.yearOffset} segment={segment} paid={paid} />
          )
        )}
      </div>

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

function QuietRow({ segment }: { segment: QuietSegment }) {
  const label =
    segment.fromOffset === segment.toOffset
      ? `${segment.fromAge}才頃`
      : `${segment.fromAge}〜${segment.toAge}才頃`;
  return (
    <div className="flex items-center gap-3 py-1 px-2 text-xs text-gray-400">
      <span className="flex-1 h-px bg-gray-200" />
      <span>{label}・大きな変化は少なく、穏やかに過ぎやすい時期</span>
      <span className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function HighlightCard({ segment, paid }: { segment: HighlightSegment; paid: boolean }) {
  const meta = PERIOD_META[segment.periodType];
  const visible = paid || segment.isFree;
  const isBig = segment.periodType === "decisive" || segment.periodType === "turning_point";

  return (
    <div
      className={`border border-gray-100 rounded-lg overflow-hidden ${meta.borderClassName} ${
        isBig ? "shadow-sm" : ""
      }`}
    >
      <div className="bg-jade/10 px-4 py-2 flex flex-wrap items-center gap-2">
        <span className={`font-medium text-jade-dark ${isBig ? "text-base" : "text-xs"}`}>
          {segment.isFree ? "直近12ヶ月" : `${segment.age}才頃`}
        </span>
        {segment.isFree && <span className="text-jade text-xs">無料公開中</span>}
        {segment.periodType !== "steady" && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${meta.badgeClassName} ${
              isBig ? "text-xs" : "text-[11px]"
            }`}
          >
            <span aria-hidden>{meta.mark}</span>
            {meta.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
        {FUTURE_THEMES.map((theme) => {
          const cell = segment.cellsByTheme[theme];
          return (
            <div key={theme} className="bg-white p-3 relative min-h-[92px]">
              <p className="text-xs text-gray-400 mb-1">{theme}</p>
              {visible ? (
                <p className="text-sm text-gray-700 leading-snug">{cell?.text}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-700 leading-snug pixelated-overlay">{cell?.text}</p>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                    <span className="text-[10px] text-gray-400">課金すると全文表示されます</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {visible && segment.advice && (
        <div className="px-4 py-3 bg-amber-50/60 border-t border-amber-100">
          <p className="text-xs font-medium text-amber-700 mb-0.5">アドバイス</p>
          <p className="text-sm text-amber-900 leading-snug">{segment.advice}</p>
        </div>
      )}
    </div>
  );
}
