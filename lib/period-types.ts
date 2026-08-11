export type PeriodType = "decisive" | "turning_point" | "endurance" | "steady";

export const PERIOD_TYPES: PeriodType[] = ["decisive", "turning_point", "endurance", "steady"];

export const PERIOD_META: Record<
  PeriodType,
  {
    label: string;
    mark: string;
    badgeClassName: string;
    borderClassName: string;
    /** 1(弱)〜4(強) のグラデーション・強調表示用の強度 */
    intensity: 1 | 2 | 3 | 4;
    /** グラフ・PDF等、Tailwindクラスが使えない箇所向けの実カラーコード */
    hex: string;
  }
> = {
  decisive: {
    label: "勝負の年",
    mark: "◆",
    badgeClassName: "text-rose-700 bg-rose-50 border border-rose-200",
    borderClassName: "border-l-4 border-l-rose-400",
    intensity: 4,
    hex: "#e11d48",
  },
  turning_point: {
    label: "転機",
    mark: "▲",
    badgeClassName: "text-amber-700 bg-amber-50 border border-amber-200",
    borderClassName: "border-l-4 border-l-amber-400",
    intensity: 3,
    hex: "#f59e0b",
  },
  endurance: {
    label: "耐える時期",
    mark: "●",
    badgeClassName: "text-slate-600 bg-slate-100 border border-slate-300",
    borderClassName: "border-l-4 border-l-slate-400",
    intensity: 2,
    hex: "#64748b",
  },
  steady: {
    label: "安定期",
    mark: "―",
    badgeClassName: "text-jade-dark bg-jade/5 border border-jade/20",
    borderClassName: "border-l-4 border-l-transparent",
    intensity: 1,
    hex: "#c9beb2",
  },
};
