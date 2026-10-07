"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PaymentLinkGenerator() {
  const [borrowerName, setBorrowerName] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = borrowerName.trim();
    const trimmedPaymentId = paymentId.trim();
    const trimmedAmount = amount.trim();

    if (!trimmedName || !trimmedPaymentId || !trimmedAmount) {
      setValidationError("Please fill out all fields before generating the link.");
      return;
    }

    const expiresAt = Date.now() + 10 * 60 * 1000;
    const token =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).substring(2, 10);

    const params = new URLSearchParams({
      name: trimmedName,
      paymentId: trimmedPaymentId,
      amount: trimmedAmount,
      expires: expiresAt.toString(),
      token: token,
    });

    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";
    const fullUrl = `${origin}/payment?${params.toString()}`;

    setGeneratedUrl(fullUrl);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = generatedUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const fillSampleData = () => {
    setBorrowerName("Nick");
    setPaymentId("example@upi");
    setAmount("৳1,450");
    setValidationError(null);
  };

  return (
    <div className="w-full bg-white rounded-[12px] p-[30px] shadow-2xl shadow-black/25 text-left">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Loan Repayment
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create a temporary loan repayment link
          </p>
        </div>
        <button
          type="button"
          onClick={fillSampleData}
          className="text-xs text-purple-700 hover:text-purple-900 font-medium px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
          title="Fill with sample values"
        >
          Use Example
        </button>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label
            htmlFor="borrowerName"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            Borrower Name
          </label>
          <input
            id="borrowerName"
            type="text"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            placeholder="Enter borrower name"
            className="w-full h-[48px] px-3.5 bg-gray-50/50 border border-gray-300 rounded-[8px] text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#7928CA] focus:ring-1 focus:ring-[#7928CA] transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="paymentId"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            Payment ID
          </label>
          <input
            id="paymentId"
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Enter UPI ID / payment identifier"
            className="w-full h-[48px] px-3.5 bg-gray-50/50 border border-gray-300 rounded-[8px] text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#7928CA] focus:ring-1 focus:ring-[#7928CA] transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            Loan Repayment Amount
          </label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full h-[48px] px-3.5 bg-gray-50/50 border border-gray-300 rounded-[8px] text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#7928CA] focus:ring-1 focus:ring-[#7928CA] transition-colors"
          />
        </div>

        {validationError && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-200">
            {validationError}
          </p>
        )}

        <button
          type="submit"
          className="w-full h-[55px] bg-[#7928CA] hover:bg-[#6820b0] active:bg-[#581a95] text-white font-bold text-base rounded-[8px] transition-colors duration-200 shadow-sm cursor-pointer"
        >
          Generate Payment Link
        </button>
      </form>

      {generatedUrl && (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-900">
              Payment Link Generated
            </h2>
            <span className="text-xs text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Valid for 10 minutes
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={generatedUrl}
              className="flex-1 h-[44px] px-3 bg-gray-100 border border-gray-300 rounded-[8px] text-xs font-mono text-gray-700 select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`h-[44px] px-5 font-semibold text-sm rounded-[8px] transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-900 hover:bg-black text-white"
              }`}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Link
              href={generatedUrl.replace(/^https?:\/\/[^/]+/, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#7928CA] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Open Payment Link in new tab</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
