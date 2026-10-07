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

  const [activeTab, setActiveTab] = useState<"direct" | "qr">("direct");

  return (
    <div className="w-full bg-[#F6F5FD] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-purple-100/60 text-left">
      {/* Solid Purple Header */}
      <div className="bg-[#7635DC] text-white pt-7 pb-6 px-4 text-center">
        <p className="text-xs font-medium text-purple-100/90 tracking-wide mb-1">
          Payment Amount
        </p>
        <div className="text-3xl font-extrabold tracking-tight mb-2">
          ₹ {amount}
        </div>
        <div className="inline-block">
          <Countdown
            expiresAt={expiresAt}
            onExpire={() => setIsExpired(true)}
            format="hh:mm:ss"
            className="font-mono text-sm font-semibold tracking-wider text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-purple-100 bg-[#FAF9FD] px-5 pt-3">
        <button
          type="button"
          onClick={() => setActiveTab("direct")}
          className={`pb-2.5 text-sm font-bold transition-all cursor-pointer relative mr-6 ${
            activeTab === "direct"
              ? "text-[#7635DC] border-b-2 border-[#7635DC]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Direct Transfer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("qr")}
          className={`pb-2.5 text-sm font-bold transition-all cursor-pointer relative ${
            activeTab === "qr"
              ? "text-[#7635DC] border-b-2 border-[#7635DC]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Scan QRCode
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "direct" ? (
        <div className="p-4 space-y-3.5 bg-[#F6F5FD]">
          {/* Card 1: Select Payment Method */}
          <div className="bg-[#EBE7FA] rounded-2xl p-3.5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-2.5">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-sm border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "border-[#7635DC] ring-1 ring-[#7635DC]"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={method.icon}
                      alt={method.label}
                      className="h-5 w-auto max-w-[45px] object-contain"
                    />
                    <span className="text-xs font-bold text-gray-800 truncate">
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: Notice Box */}
          <div className="bg-[#DCD5F7] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-[#7635DC]/15 flex items-center justify-center shrink-0">
              <svg
                className="w-3.5 h-3.5 text-[#7635DC]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[11px] text-[#3e1e82] font-semibold leading-tight">
              Payment can only be made once. Multiple payments are not valid!!!
            </p>
          </div>

          {/* Card 3: Transfer & UTR Card */}
          <div className="bg-[#EBE7FA] rounded-2xl p-3.5 space-y-3.5 shadow-sm">
            {/* 1. Transfer RS to the following upi */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 mb-2">
                1. Transfer RS to the following upi
              </h4>
              <div className="space-y-2">
                {/* UPI Box */}
                <div className="bg-white rounded-xl h-10 px-3 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-mono font-medium text-gray-700 truncate max-w-[220px]">
                    {paymentId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(paymentId, setCopiedVpa)}
                    className="text-gray-400 hover:text-[#7635DC] transition-colors p-1 cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedVpa ? (
                      <span className="text-[10px] font-bold text-green-600">Copied!</span>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Amount Box */}
                <div className="bg-white rounded-xl h-10 px-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-gray-700">RS</span>
                    <span className="font-bold text-gray-900">{amount}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(amount, setCopiedAmount)}
                    className="text-gray-400 hover:text-[#7635DC] transition-colors p-1 cursor-pointer"
                    title="Copy Amount"
                  >
                    {copiedAmount ? (
                      <span className="text-[10px] font-bold text-green-600">Copied!</span>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Submit Ref No/Reference No/UTR */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 mb-2">
                2. Submit Ref No/Reference No/UTR
              </h4>
              <div className="bg-white rounded-xl p-1 pl-3 flex items-center justify-between shadow-sm">
                <input
                  type="text"
                  id="utrInput"
                  value={utr}
                  onChange={(e) => {
                    setUtr(e.target.value);
                    if (utrError) setUtrError("");
                  }}
                  placeholder="UTR(UPI Ref.ID)"
                  className="w-full text-xs text-gray-800 placeholder:text-gray-400 bg-transparent outline-none font-mono pr-2"
                />
                <button
                  type="button"
                  id="submitUtrBtn"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#7635DC] hover:bg-[#6829D1] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all shrink-0"
                >
                  {submitting ? "..." : "Submit"}
                </button>
              </div>
              {utrError && (
                <p className="text-[11px] text-red-500 mt-1 pl-1 font-medium">{utrError}</p>
              )}
            </div>
          </div>

          {/* Footer UPI | BHIM Logo */}
          <div className="pt-3 pb-2 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 opacity-70">
              <span className="text-gray-400 font-extrabold italic text-sm tracking-wider">UPI</span>
              <span className="text-gray-300 font-bold">|</span>
              <span className="text-gray-400 font-bold text-xs tracking-wide">BHIM</span>
              <div className="flex gap-0.5 ml-1">
                <span className="w-1.5 h-3 bg-[#FF9933] rounded-xs" />
                <span className="w-1.5 h-3 bg-[#138808] rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scan QRCode Tab */
        <div className="p-4 space-y-3.5 bg-[#F6F5FD] text-center">
          <div className="bg-white rounded-2xl p-5 shadow-sm max-w-[260px] mx-auto border border-purple-50">
            <p className="text-xs font-semibold text-gray-500 mb-2">Scan & Pay ₹{amount}</p>
            <div className="w-[180px] h-[180px] mx-auto bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `upi://pay?pa=${paymentId}&pn=${encodeURIComponent(name ?? "Merchant")}&am=${amount}&cu=INR`
                )}`}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-mono truncate">{paymentId}</p>
          </div>

          <div className="bg-[#DCD5F7] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-sm text-left">
            <p className="text-[11px] text-[#3e1e82] font-semibold leading-tight">
              After completing payment via QR code, enter UTR number below to confirm.
            </p>
          </div>

          {/* UTR Input */}
          <div className="bg-[#EBE7FA] rounded-2xl p-3.5 text-left shadow-sm">
            <h4 className="text-xs font-bold text-gray-800 mb-2">
              Submit Ref No/Reference No/UTR
            </h4>
            <div className="bg-white rounded-xl p-1 pl-3 flex items-center justify-between shadow-sm">
              <input
                type="text"
                value={utr}
                onChange={(e) => {
                  setUtr(e.target.value);
                  if (utrError) setUtrError("");
                }}
                placeholder="UTR(UPI Ref.ID)"
                className="w-full text-xs text-gray-800 placeholder:text-gray-400 bg-transparent outline-none font-mono pr-2"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#7635DC] hover:bg-[#6829D1] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all shrink-0"
              >
                {submitting ? "..." : "Submit"}
              </button>
            </div>
            {utrError && (
              <p className="text-[11px] text-red-500 mt-1 pl-1 font-medium">{utrError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 bg-white sm:bg-[#F0EEF8]">
      <div className="w-full max-w-[390px]">
        <Suspense
          fallback={
            <div className="w-full bg-white rounded-3xl p-8 shadow-sm text-center">
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
