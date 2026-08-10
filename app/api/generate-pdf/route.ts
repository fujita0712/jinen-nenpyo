import { NextRequest, NextResponse } from "next/server";
import { generatePastReading } from "@/lib/ai/generate-past-reading";
import { generateFutureReading } from "@/lib/ai/generate-future-reading";
import { generateReadingPdf } from "@/lib/pdf/generate-reading-pdf";
import { decodeReadingInput } from "@/lib/types";

// 過去/未来の生成を並列実行しても合計50秒前後かかるため、タイムアウトを延長する
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const d = req.nextUrl.searchParams.get("d");
  const input = decodeReadingInput(d);

  if (!input) {
    return NextResponse.json({ error: "invalid or missing d param" }, { status: 400 });
  }

  try {
    const [past, future] = await Promise.all([
      generatePastReading(input),
      generateFutureReading(input),
    ]);
    const pdfBuffer = await generateReadingPdf(input, past, future);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="jinsei-nenpyo.pdf"`,
      },
    });
  } catch (err) {
    console.error("generate-pdf failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "pdf generation failed", detail: message }, { status: 500 });
  }
}
