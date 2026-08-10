import { NextRequest, NextResponse } from "next/server";
import { buildFullReadingPdf } from "@/lib/pdf/build-full-pdf";
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
    const pdfBuffer = await buildFullReadingPdf(input);

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
