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
import { FutureCell, FUTURE_THEMES } from "@/lib/mock/future-readings";
import { PeriodType } from "@/lib/period-types";
import { groupFutureSegments } from "@/lib/future-segments";

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
  yearBlock: {
    marginBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E0DC",
    paddingBottom: 10,
  },
  yearHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  yearLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#5C7C7A",
  },
  themeRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  themeLabel: {
    width: 40,
    fontSize: 9,
    color: "#888888",
  },
  themeText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.5,
  },
  adviceBox: {
    marginTop: 4,
    padding: 6,
    backgroundColor: "#FFFBEB",
    borderRadius: 3,
  },
  adviceLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: "#B45309",
    marginBottom: 2,
  },
  adviceText: {
    fontSize: 9,
    color: "#78350F",
    lineHeight: 1.4,
  },
  quietRow: {
    fontSize: 8,
    color: "#AAAAAA",
    marginBottom: 8,
    textAlign: "center",
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
  const segments = groupFutureSegments(future);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.coverTitle}>人生年表</Text>
        <Text style={styles.coverName}>{input.name} さまの過去・未来年表</Text>
        <Text style={styles.coverDate}>作成日: {generatedAt}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>過去年表</Text>
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
        <Text style={styles.pageFooter} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>未来年表（20年 × 4テーマ）</Text>
        {segments.map((segment) => {
          if (segment.kind === "quiet") {
            const label =
              segment.fromOffset === segment.toOffset
                ? `${segment.fromAge}才頃`
                : `${segment.fromAge}〜${segment.toAge}才頃`;
            return (
              <Text key={`quiet-${segment.fromOffset}`} style={styles.quietRow}>
                {label}・大きな変化は少なく、穏やかに過ぎやすい時期
              </Text>
            );
          }
          const label = segment.isFree ? "直近12ヶ月" : `${segment.age}才頃`;
          const meta = PERIOD_PDF_META[segment.periodType];
          return (
            <View key={segment.yearOffset} style={styles.yearBlock} wrap={false}>
              <View style={styles.yearHeaderRow}>
                <Text style={styles.yearLabel}>{label}</Text>
                {segment.periodType !== "steady" && (
                  <Text
                    style={[styles.periodBadge, { color: meta.color, backgroundColor: meta.bg }]}
                  >
                    {meta.mark} {meta.label}
                  </Text>
                )}
              </View>
              {FUTURE_THEMES.map((theme) => {
                const cell = segment.cellsByTheme[theme];
                if (!cell) return null;
                return (
                  <View key={theme} style={styles.themeRow}>
                    <Text style={styles.themeLabel}>{theme}</Text>
                    <Text style={styles.themeText}>{cell.text}</Text>
                  </View>
                );
              })}
              {segment.advice && (
                <View style={styles.adviceBox}>
                  <Text style={styles.adviceLabel}>アドバイス</Text>
                  <Text style={styles.adviceText}>{segment.advice}</Text>
                </View>
              )}
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
