import { NextRequest, NextResponse } from "next/server";
import { generateFutureReading } from "@/lib/ai/generate-future-reading";
import { ReadingInput } from "@/lib/types";

// AI生成に約50秒かかるため、Vercelのデフォルトタイムアウト(Hobbyでは短い)を延長する
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let input: ReadingInput;
  try {
    input = (await req.json()) as ReadingInput;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!input?.name || !input?.birthDate) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  try {
    const cells = await generateFutureReading(input);
    return NextResponse.json(cells);
  } catch (err) {
    console.error("generate-future-reading failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "generation failed", detail: message }, { status: 500 });
  }
}
