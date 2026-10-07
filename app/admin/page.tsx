import React from "react";
import type { Metadata } from "next";
import PaymentLinkGenerator from "../components/PaymentLinkGenerator";

export const metadata: Metadata = {
  title: "Admin - Loan Repayment Link Generator",
  description: "Create temporary loan repayment links",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-white">
      <div className="w-full max-w-[500px]">
        <PaymentLinkGenerator />
      </div>
    </main>
  );
}
