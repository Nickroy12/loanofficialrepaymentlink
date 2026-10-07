"use client";

import React from "react";
import Link from "next/link";

interface ExpiredPaymentLinkProps {
  type?: "expired" | "invalid";
  message?: string;
}

export default function ExpiredPaymentLink({
  type = "expired",
  message,
}: ExpiredPaymentLinkProps) {
  const isInvalid = type === "invalid";

  const title = isInvalid ? "Invalid Payment Link" : "Payment Link Expired";
  const defaultMessage = isInvalid
    ? "This payment link is invalid or incomplete."
    : "This temporary loan repayment link is no longer available.";
  const buttonText = isInvalid ? "Generate New Link" : "Create New Payment Link";

  return (
    <div className="w-full bg-white rounded-[12px] p-[30px] shadow-2xl shadow-black/25 text-center transition-all duration-300">
      {/* Visual Status Indicator Icon */}
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-100">
        {isInvalid ? (
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ) : (
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
        {title}
      </h1>

      <p className="text-gray-600 text-sm mb-7 leading-relaxed">
        {message || defaultMessage}
      </p>

      <Link
        href="/admin"
        className="w-full h-[55px] flex items-center justify-center bg-[#7928CA] hover:bg-[#6820b0] active:bg-[#581a95] text-white font-semibold rounded-[8px] transition-colors duration-200 shadow-sm"
      >
        {buttonText}
      </Link>
    </div>
  );
}
