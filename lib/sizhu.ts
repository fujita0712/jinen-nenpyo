// 四柱推命ユーティリティ(年柱・月柱・日柱・時柱)
// TODO: 本格的な干支暦計算は本フェーズのスコープ外のため簡易モック実装とする(§4.1)

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

function pillar(offset: number): string {
  const stem = HEAVENLY_STEMS[offset % 10];
  const branch = EARTHLY_BRANCHES[offset % 12];
  return `${stem}${branch}`;
}

export interface SizhuResult {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  daiun: string; // 大運(10年単位の運勢テーマ、モック)
}

export function calcSizhu(birthDate: string, birthTime: string): SizhuResult {
  const d = new Date(`${birthDate}T${birthTime || "12:00"}`);
  const year = Number.isNaN(d.getTime()) ? 2000 : d.getFullYear();
  const month = Number.isNaN(d.getTime()) ? 1 : d.getMonth() + 1;
  const day = Number.isNaN(d.getTime()) ? 1 : d.getDate();
  const hour = Number.isNaN(d.getTime()) ? 12 : d.getHours();

  return {
    yearPillar: pillar(year),
    monthPillar: pillar(year + month),
    dayPillar: pillar(year + month + day),
    hourPillar: pillar(hour),
    daiun: pillar(year + hour).slice(0, 1) + "の大運",
  };
}
