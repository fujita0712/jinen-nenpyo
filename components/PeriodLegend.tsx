import { PERIOD_TYPES, PERIOD_META } from "@/lib/period-types";

export default function PeriodLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {PERIOD_TYPES.filter((t) => t !== "steady").map((type) => {
        const meta = PERIOD_META[type];
        return (
          <span
            key={type}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${meta.badgeClassName}`}
          >
            <span aria-hidden>{meta.mark}</span>
            {meta.label}
          </span>
        );
      })}
      <span className="text-[11px] text-gray-400 self-center">が付いている年・時期は特に節目となりやすいタイミングです</span>
    </div>
  );
}
