import { Resend } from "resend";
import { ReadingInput } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

// 独自ドメイン未取得のため、暫定的にResendの共有ドメインから送信する(§: 本番ドメイン確定タスクで差し替え予定)
const FROM_ADDRESS = "人生年表 <onboarding@resend.dev>";

export async function sendReadingEmail(
  input: ReadingInput,
  pdfBuffer: Buffer
): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: input.email,
    subject: `【人生年表】${input.name}様の年表PDFが届きました`,
    html: `
      <p>${input.name} 様</p>
      <p>この度は「人生年表」をご利用いただきありがとうございます。</p>
      <p>ご注文いただいた年表PDF（過去年表 + 未来20年 × 4テーマ）を添付にてお送りいたします。</p>
      <p>ご不明点がございましたら、本メールにご返信ください。</p>
    `,
    attachments: [
      {
        filename: "jinsei-nenpyo.pdf",
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    throw new Error(`resend send failed: ${error.message}`);
  }
}
