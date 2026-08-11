import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import { ReadingInput } from "@/lib/types";
import { PastReadingSegment } from "@/lib/mock/past-readings";
import { FutureCell } from "@/lib/mock/future-readings";
import { PeriodType } from "@/lib/period-types";
import { computeDivinationSummary } from "@/lib/divination-summary";

const PERIOD_PDF_META: Record<PeriodType, { label: string; mark: string; color: string; bg: string }> = {
  decisive: { label: "勝負の年", mark: "◆", color: "#be123c", bg: "#fff1f2" },
  turning_point: { label: "転機", mark: "▲", color: "#b45309", bg: "#fffbeb" },
  endurance: { label: "耐える時期", mark: "●", color: "#475569", bg: "#f1f5f9" },
  steady: { label: "安定期", mark: "―", color: "#3E5957", bg: "#F4F0EE" },
};

Font.register({
  family: "Noto Sans JP",
  fonts: [
    { src: path.join(process.cwd(), "assets/fonts/NotoSansJP-Regular.ttf"), fontWeight: 400 },
    { src: path.join(process.cwd(), "assets/fonts/NotoSansJP-Bold.ttf"), fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans JP",
    fontSize: 10,
    padding: 40,
    color: "#2A2A2A",
  },
  coverTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: "#5C7C7A",
    marginTop: 220,
    textAlign: "center",
  },
  coverName: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  coverDate: {
    fontSize: 9,
    color: "#888888",
    marginTop: 40,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#5C7C7A",
    marginBottom: 16,
  },
  chapterBlock: {
    marginBottom: 18,
  },
  chapterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  chapterTitle: {
    fontSize: 12,
    fontWeight: 700,
  },
  periodBadge: {
    fontSize: 8,
    fontWeight: 700,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  chapterAgeRange: {
    fontSize: 9,
    color: "#888888",
    marginBottom: 6,
  },
  chapterBody: {
    fontSize: 10,
    lineHeight: 1.7,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#5C7C7A",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: "#5C7C7A",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E0DC",
    paddingVertical: 6,
  },
  cellAge: {
    width: 60,
    paddingRight: 6,
  },
  cellAgeText: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2A2A2A",
  },
  cellFlow: {
    flex: 1,
    paddingRight: 6,
  },
  cellAdvice: {
    width: 150,
  },
  cellBodyText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: "#2A2A2A",
  },
  summaryBox: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#E5E0DC",
    borderRadius: 3,
  },
  summaryTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#5C7C7A",
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  summaryLabel: {
    width: 70,
    fontSize: 8,
    color: "#888888",
  },
  summaryValue: {
    flex: 1,
    fontSize: 8,
    color: "#2A2A2A",
  },
  insightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  insightCard: {
    width: "48%",
    padding: 6,
    borderWidth: 0.5,
    borderColor: "#E5E0DC",
    borderRadius: 3,
  },
  insightLabel: {
    fontSize: 8,
    color: "#888888",
    marginBottom: 2,
  },
  insightText: {
    fontSize: 8,
    color: "#2A2A2A",
    lineHeight: 1.4,
  },
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#AAAAAA",
    textAlign: "center",
  },
});

function ReadingPdfDocument({
  input,
  past,
  future,
}: {
  input: ReadingInput;
  past: PastReadingSegment;
  future: FutureCell[];
}) {
  const generatedAt = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const divination = computeDivinationSummary(input);
  const maxYearOffset = Math.max(...future.map((c) => c.yearOffset));
  const futureYears = Array.from({ length: maxYearOffset + 1 }, (_, yearOffset) => {
    const cell = future.find((c) => c.yearOffset === yearOffset);
    return {
      yearOffset,
      age: cell?.age ?? 0,
      free: yearOffset === 0,
      periodType: cell?.periodType ?? ("steady" as PeriodType),
      flow: cell?.flow ?? "",
      advice: cell?.advice ?? "",
    };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.coverTitle}>人生年表</Text>
        <Text style={styles.coverName}>{input.name} さまの過去・未来年表</Text>
        <Text style={styles.coverDate}>作成日: {generatedAt}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>過去年表</Text>

        <View style={styles.summaryBox} wrap={false}>
          <Text style={styles.summaryTitle}>4占術 算出結果</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>西洋占星術</Text>
            <Text style={styles.summaryValue}>
              太陽星座 {divination.sunSign}
              {divination.nearSaturnReturn ? "（土星回帰の時期に近い）" : ""}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>数秘術</Text>
            <Text style={styles.summaryValue}>
              ライフパス {divination.lifePath} ／ ディスティニー {divination.destiny} ／ ソウル {divination.soul}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>四柱推命</Text>
            <Text style={styles.summaryValue}>
              年柱 {divination.yearPillar} ・ 月柱 {divination.monthPillar} ・ 日柱 {divination.dayPillar} ・ 時柱{" "}
              {divination.hourPillar}（{divination.daiun}）
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>タロット</Text>
            <Text style={styles.summaryValue}>
              {divination.tarotName}（{divination.tarotReversed ? "逆位置" : "正位置"}）
            </Text>
          </View>
        </View>

        {past.chapters.map((chapter) => {
          const meta = PERIOD_PDF_META[chapter.periodType];
          return (
            <View key={chapter.title} style={styles.chapterBlock} wrap={false}>
              <View style={styles.chapterHeaderRow}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text
                  style={[styles.periodBadge, { color: meta.color, backgroundColor: meta.bg }]}
                >
                  {meta.mark} {meta.label}（{chapter.periodAge}）
                </Text>
              </View>
              <Text style={styles.chapterAgeRange}>{chapter.ageRange}</Text>
              <Text style={styles.chapterBody}>{chapter.body}</Text>
            </View>
          );
        })}
        <Text style={styles.summaryTitle}>テーマ別の傾向</Text>
        <View style={styles.insightGrid}>
          {past.themeInsights.map((insight) => (
            <View key={insight.theme} style={styles.insightCard}>
              <Text style={styles.insightLabel}>{insight.theme}</Text>
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.pageFooter} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>未来年表</Text>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, styles.cellAge]}>年齢</Text>
          <Text style={[styles.tableHeaderCell, styles.cellFlow]}>運気の流れ</Text>
          <Text style={[styles.tableHeaderCell, styles.cellAdvice]}>アドバイス</Text>
        </View>
        {futureYears.map((y) => {
          const meta = PERIOD_PDF_META[y.periodType];
          return (
            <View key={y.yearOffset} style={styles.tableRow} wrap={false}>
              <View style={styles.cellAge}>
                <Text style={styles.cellAgeText}>{y.free ? "直近12ヶ月" : `${y.age}才`}</Text>
                {y.periodType !== "steady" && (
                  <Text
                    style={[
                      styles.periodBadge,
                      { color: meta.color, backgroundColor: meta.bg, marginTop: 2, alignSelf: "flex-start" },
                    ]}
                  >
                    {meta.mark} {meta.label}
                  </Text>
                )}
              </View>
              <View style={styles.cellFlow}>
                <Text style={styles.cellBodyText}>{y.flow}</Text>
              </View>
              <View style={styles.cellAdvice}>
                <Text style={styles.cellBodyText}>{y.advice}</Text>
              </View>
            </View>
          );
        })}
        <Text style={styles.pageFooter} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>
    </Document>
  );
}

export async function generateReadingPdf(
  input: ReadingInput,
  past: PastReadingSegment,
  future: FutureCell[]
): Promise<Buffer> {
  return renderToBuffer(<ReadingPdfDocument input={input} past={past} future={future} />);
}
