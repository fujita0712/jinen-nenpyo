import { NextRequest, NextResponse } from "next/server";
import { generatePastReading } from "@/lib/ai/generate-past-reading";
import { ReadingInput } from "@/lib/types";

// AI生成に30〜40秒かかるため、Vercelのデフォルトタイムアウト(Hobbyでは短い)を延長する
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
    const segment = await generatePastReading(input);
    return NextResponse.json(segment);
  } catch (err) {
    console.error("generate-past-reading failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "generation failed", detail: message }, { status: 500 });
  }
}
