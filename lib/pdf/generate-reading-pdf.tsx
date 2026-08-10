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
  chapterTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 2,
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
  yearLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#5C7C7A",
    marginBottom: 6,
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
  const maxYearOffset = Math.max(...future.map((c) => c.yearOffset));
  const years = Array.from({ length: maxYearOffset + 1 }, (_, y) => y);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.coverTitle}>人生年表</Text>
        <Text style={styles.coverName}>{input.name} さまの過去・未来年表</Text>
        <Text style={styles.coverDate}>作成日: {generatedAt}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>過去年表</Text>
        {past.chapters.map((chapter) => (
          <View key={chapter.title} style={styles.chapterBlock} wrap={false}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.chapterAgeRange}>{chapter.ageRange}</Text>
            <Text style={styles.chapterBody}>{chapter.body}</Text>
          </View>
        ))}
        <Text style={styles.pageFooter} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>未来年表（20年 × 4テーマ）</Text>
        {years.map((yearOffset) => {
          const rowCells = future.filter((c) => c.yearOffset === yearOffset);
          const label = yearOffset === 0 ? "直近12ヶ月" : `${rowCells[0]?.age ?? ""}才頃`;
          return (
            <View key={yearOffset} style={styles.yearBlock} wrap={false}>
              <Text style={styles.yearLabel}>{label}</Text>
              {FUTURE_THEMES.map((theme) => {
                const cell = rowCells.find((c) => c.theme === theme);
                if (!cell) return null;
                return (
                  <View key={theme} style={styles.themeRow}>
                    <Text style={styles.themeLabel}>{theme}</Text>
                    <Text style={styles.themeText}>{cell.text}</Text>
                  </View>
                );
              })}
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
