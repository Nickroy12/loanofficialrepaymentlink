"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();

  const utr = searchParams.get("utr") ?? "—";
  const amount = searchParams.get("amount") ?? "—";
  const name = searchParams.get("name") ?? "Customer";

  return (
    <div className="w-full max-w-[400px] mx-auto text-center px-4">
      {/* Animated checkmark */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-60" />
          <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg
              className="w-12 h-12 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
        UTR Submitted!
      </h1>


      {/* Details card */}


      {/* Status badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-8">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-amber-700 text-xs font-semibold tracking-wide">
          Under Review · Usually takes 5–30 minutes
        </span>
      </div>

      {/* Info text */}
      <p className="text-gray-400 text-xs leading-relaxed max-w-[280px] mx-auto">
        Our team will verify your transaction and update your account status shortly. You may close this page.
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 bg-white">
      <Suspense
        fallback={
          <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse mx-auto" />
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
