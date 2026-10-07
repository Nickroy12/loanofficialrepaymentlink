"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Countdown from "../components/Countdown";
import ExpiredPaymentLink from "../components/ExpiredPaymentLink";

const PAYMENT_METHODS = [
  { id: "phonepe", label: "PhonePe", icon: "/payment/phonepe.png" },
  { id: "paytm", label: "Paytm", icon: "/payment/paytm.png" },
  { id: "gpay", label: "G Pay", icon: "/payment/gpay.png" },
  { id: "upi", label: "UPI", icon: "/payment/upi.png" },
];

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const paymentId = searchParams.get("paymentId");
  const amount = searchParams.get("amount");
  const expiresParam = searchParams.get("expires");

  const [isExpired, setIsExpired] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!name || !paymentId || !amount || !expiresParam) {
    return (
      <ExpiredPaymentLink
        type="invalid"
        message="This payment link is invalid or incomplete."
      />
    );
  }

  const expiresAt = parseInt(expiresParam, 10);

  if (isNaN(expiresAt) || expiresAt <= 0) {
    return (
      <ExpiredPaymentLink
        type="invalid"
        message="This payment link contains an invalid expiration timestamp."
      />
    );
  }

  if (isExpired || expiresAt <= Date.now()) {
    return (
      <ExpiredPaymentLink
        type="expired"
        message="This temporary loan repayment link has expired."
      />
    );
  }

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-999999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleSubmit = async () => {
    const trimmed = utr.trim();
    if (!trimmed) {
      setUtrError("Please enter your UTR / transaction number.");
      return;
    }
    if (trimmed.length < 6) {
      setUtrError("UTR number seems too short. Please check and try again.");
      return;
    }
    setUtrError("");
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 700));

    const params = new URLSearchParams({
      utr: trimmed,
      amount: amount ?? "",
      name: name ?? "",
      paymentId: paymentId ?? "",
    });
    router.push(`/payment/success?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden text-left">
      {/* Session / countdown header */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50/60 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500">
          Session expires in
        </span>
        <Countdown expiresAt={expiresAt} onExpire={() => setIsExpired(true)} />
      </div>

      <div className="p-6">
        {/* Borrower & Amount Header */}
        <div className="pb-5 border-b border-gray-100">
          <div className="flex items-start justify-between">

            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">Due Amount</p>
              <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                <span className="text-xl font-bold text-gray-900 tracking-tight">₹{amount}</span>
                <button
                  type="button"
                  onClick={() => copyText(amount, setCopiedAmount)}
                  className="text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 px-2 py-0.5 rounded transition-all cursor-pointer"
                >
                  {copiedAmount ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* UPI ID / VPA field */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">UPI ID / VPA</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                {paymentId}
              </span>
              <button
                type="button"
                onClick={() => copyText(paymentId, setCopiedVpa)}
                className="text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 px-2.5 py-1 rounded transition-all cursor-pointer"
              >
                {copiedVpa ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Notice */}
        <div className="my-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100/70 text-xs text-amber-900/80 leading-relaxed space-y-1">
          <p className="font-semibold text-amber-950 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Important Notice
          </p>
          <p className="text-[11px] text-amber-900/75 pl-3">
            • Each UPI ID can only receive payment once.<br />
            • Do not alter the payment amount, otherwise the order will not settle.
          </p>
        </div>

        {/* Payment Methods - 2 Columns */}
        <div className="py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Select Payment App
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${isSelected
                      ? "border-[#5F259F] bg-[#5F259F]/5 ring-1 ring-[#5F259F]"
                      : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/50"
                    }`}
                >
                  <img
                    src={method.icon}
                    alt={method.label}
                    className="h-7 w-auto max-w-[85px] object-contain"
                  />
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${isSelected
                        ? "border-[#5F259F] bg-[#5F259F]"
                        : "border-gray-300 bg-transparent"
                      }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* UTR Input */}
        <div className="pt-4">
          <label htmlFor="utrInput" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Enter Transaction UTR
          </label>
          <input
            type="text"
            id="utrInput"
            value={utr}
            onChange={(e) => {
              setUtr(e.target.value);
              if (utrError) setUtrError("");
            }}
            placeholder="12-digit UTR number"
            className="w-full h-11 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#5F259F] focus:ring-1 focus:ring-[#5F259F] transition-all font-mono"
          />
          {utrError && (
            <p className="text-xs text-red-500 mt-1.5 pl-0.5">{utrError}</p>
          )}

          <button
            type="button"
            id="submitUtrBtn"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-11 mt-3 bg-[#5F259F] hover:bg-[#4d1d84] active:scale-[0.99] disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-sm shadow-[#5F259F]/20"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit UTR"
            )}
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="pt-6 mt-4 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-4 mb-2 opacity-60">
            <img src="/payment/phonepe.png" alt="PhonePe" className="h-4 w-auto object-contain" />
            <img src="/payment/gpay.png" alt="G Pay" className="h-3.5 w-auto object-contain" />
            <img src="/payment/paytm.png" alt="Paytm" className="h-3.5 w-auto object-contain" />
          </div>
          <p className="text-[11px] text-gray-400">
            256-bit encrypted transfer · ICICI Bank guaranteed
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-white">
      <div className="w-full max-w-[420px]">
        <Suspense
          fallback={
            <div className="w-full bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            </div>
          }
        >
          <PaymentContent />
        </Suspense>
      </div>
    </main>
  );
}
