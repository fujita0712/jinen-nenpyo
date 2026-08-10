import { NextRequest, NextResponse } from "next/server";
import { buildFullReadingPdf } from "@/lib/pdf/build-full-pdf";
import { sendReadingEmail } from "@/lib/email/send-reading-email";
import { decodeReadingInput } from "@/lib/types";

// PDF生成(50秒前後) + メール送信を1回のリクエストで行うため、タイムアウトを延長する
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: { d?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const input = decodeReadingInput(body.d ?? null);
  if (!input) {
    return NextResponse.json({ error: "invalid or missing d" }, { status: 400 });
  }

  try {
    const pdfBuffer = await buildFullReadingPdf(input);
    await sendReadingEmail(input, pdfBuffer);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-reading-email failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "email send failed", detail: message }, { status: 500 });
  }
}
