"use client";

import React, { useEffect, useState } from "react";

interface CountdownProps {
  expiresAt: number;
  onExpire?: () => void;
}

export default function Countdown({ expiresAt, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        if (onExpire) {
          onExpire();
        }
        return 0;
      }
      setTimeLeft(remaining);
      return remaining;
    };

    // Initial calculation
    const initial = calculateTimeLeft();
    if (initial <= 0) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (timeLeft === null) {
    return <span className="font-mono font-semibold">--:--</span>;
  }

  const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <span className="font-mono text-xs font-semibold tracking-wide text-[#5F259F] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
      {formattedTime}
    </span>
  );
}
