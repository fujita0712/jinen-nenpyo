import { generatePastReading } from "@/lib/ai/generate-past-reading";
import { generateFutureReading } from "@/lib/ai/generate-future-reading";
import { generateReadingPdf } from "@/lib/pdf/generate-reading-pdf";
import { ReadingInput } from "@/lib/types";

export async function buildFullReadingPdf(input: ReadingInput): Promise<Buffer> {
  const [past, future] = await Promise.all([
    generatePastReading(input),
    generateFutureReading(input),
  ]);
  return generateReadingPdf(input, past, future);
}
