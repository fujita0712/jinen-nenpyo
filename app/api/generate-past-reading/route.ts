import { NextRequest, NextResponse } from "next/server";
import { generatePastReading } from "@/lib/ai/generate-past-reading";
import { ReadingInput } from "@/lib/types";

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
    return NextResponse.json({ error: "generation failed" }, { status: 500 });
  }
}
