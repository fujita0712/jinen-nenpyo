"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ThanksPage() {
  return (
    <Suspense fallback={null}>
      <ThanksPageInner />
    </Suspense>
  );
}

function ThanksPageInner() {
  const searchParams = useSearchParams();
  const d = searchParams.get("d") ?? "";

  return (
    <main className="px-6 py-16 max-w-lg mx-auto text-center">
      <h1 className="font-serif text-2xl text-jade-dark mb-4">ご注文ありがとうございます</h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-8">
        24時間以内に、ご登録のメールアドレスへ年表PDFを送付いたします。今すぐ手元で確認したい場合は、下のボタンからその場でPDFを作成してダウンロードできます。
      </p>

      <PdfDownloadButton d={d} />

      <div className="mt-10">
        <p className="text-xs text-gray-400 mb-3">マイページ ─ 1クリックで戻り表示</p>
        <Link
          href={`/reading/future?paid=true&d=${encodeURIComponent(d)}`}
          className="inline-block px-8 py-4 rounded-full bg-jade text-white text-lg font-medium hover:bg-jade-dark transition-colors"
        >
          年表をマイページで確認する
        </Link>
        <p className="text-xs text-gray-400 mt-3">
          過去年表 + 未来年表（20年 × 4テーマ）を同じページで確認できます
        </p>
      </div>
    </main>
  );
}

function PdfDownloadButton({ d }: { d: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleDownload = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/generate-pdf?d=${encodeURIComponent(d)}`);
      if (!res.ok) {
        throw new Error(`status ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "jinsei-nenpyo.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-jade text-jade text-sm font-medium hover:bg-jade/5 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "PDFを作成しています…(通常45秒前後)" : "PDFを今すぐダウンロード"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-500 mt-2">
          PDFの作成に失敗しました。しばらくしてから再度お試しください。
        </p>
      )}
    </div>
  );
}
