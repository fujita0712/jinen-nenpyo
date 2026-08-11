import { PastReadingSegment } from "@/lib/mock/past-readings";
import { PERIOD_META } from "@/lib/period-types";

export default function PastYearTable({ segment }: { segment: PastReadingSegment }) {
  return (
    <div className="space-y-8">
      {segment.chapters.map((chapter) => {
        const meta = PERIOD_META[chapter.periodType];
        return (
          <div key={chapter.title} className={`pl-4 ${meta.borderClassName}`}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-serif text-lg text-jade-dark">{chapter.title}</h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${meta.badgeClassName}`}
              >
                <span aria-hidden>{meta.mark}</span>
                {meta.label}（{chapter.periodAge}）
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{chapter.ageRange}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{chapter.body}</p>
          </div>
        );
      })}

      <div>
        <p className="text-sm font-medium text-jade-dark mb-3">テーマ別の傾向</p>
        <div className="grid grid-cols-2 gap-3">
          {segment.themeInsights.map((insight) => (
            <div key={insight.theme} className="p-3 rounded-lg border border-gray-100 bg-white">
              <p className="text-xs text-gray-400 mb-1">{insight.theme}</p>
              <p className="text-sm text-gray-700 leading-snug">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-lg bg-jade/10">
        <p className="text-sm font-medium text-jade-dark mb-2">ハイライト</p>
        <ul className="space-y-1 text-sm text-gray-700">
          {segment.highlights.map((h) => (
            <li key={h}>・{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
