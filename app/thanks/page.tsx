"use client";

import { Suspense } from "react";
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
        24時間以内に、ご登録のメールアドレスへ年表PDFを送付いたします。
      </p>

      {/* PDF生成はスコープ外のため、SVGによる1ページ分のプレビューをモック表示する(§5画面⑦) */}
      <PdfPreviewMock />

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

function PdfPreviewMock() {
  return (
    <svg
      viewBox="0 0 320 420"
      className="mx-auto w-56 h-auto drop-shadow-md rounded-md bg-white"
      role="img"
      aria-label="年表PDFのプレビュー"
    >
      <rect x="0" y="0" width="320" height="420" fill="#ffffff" stroke="#e5e0dc" />
      <text x="160" y="40" textAnchor="middle" fontSize="16" fill="#5C7C7A" fontFamily="serif">
        人生年表
      </text>
      <line x1="24" y1="56" x2="296" y2="56" stroke="#e5e0dc" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x="24"
          y={72 + i * 40}
          width="272"
          height="28"
          rx="4"
          fill={i % 2 === 0 ? "#F4F0EE" : "#ffffff"}
          stroke="#e5e0dc"
        />
      ))}
    </svg>
  );
}
