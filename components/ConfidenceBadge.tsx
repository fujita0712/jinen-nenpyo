export default function ConfidenceBadge({ score }: { score: number }) {
  const fillPercent = Math.max(0, Math.min(100, (score / 5) * 100));

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative text-2xl tracking-wide leading-none" aria-label={`確信度 ${score} / 5`}>
        <span className="text-gray-300">★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden text-jade"
          style={{ width: `${fillPercent}%` }}
        >
          ★★★★★
        </span>
      </div>
      <p className="text-xs text-gray-500">確信度 Confidence {score.toFixed(1)} / 5</p>
    </div>
  );
}
