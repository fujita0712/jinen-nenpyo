import { PastReadingSegment } from "@/lib/mock/past-readings";

export default function PastYearTable({ segment }: { segment: PastReadingSegment }) {
  return (
    <div className="space-y-8">
      {segment.chapters.map((chapter) => (
        <div key={chapter.title}>
          <h3 className="font-serif text-lg text-jade-dark">{chapter.title}</h3>
          <p className="text-xs text-gray-400 mb-2">{chapter.ageRange}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{chapter.body}</p>
        </div>
      ))}

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
