import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Loan Repayment Portal",
  description: "Temporary loan repayment review and payment portal",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white w-full flex items-center justify-center p-4 sm:p-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#5F259F] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#5F259F]/30">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Loan Repayment Portal</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-[280px] mx-auto">
          This portal is used for secure loan repayment processing.
        </p>

      </div>
    </main>
  );
}
