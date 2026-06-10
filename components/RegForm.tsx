"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegForm({ initialReg }: { initialReg?: string }) {
  const [reg, setReg] = useState(initialReg || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = reg.trim().toUpperCase();
    if (!cleaned) return;
    setLoading(true);
    // Navigate to results page (works with or without JS)
    router.push(`/results?reg=${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={reg}
          onChange={(e) => setReg(e.target.value)}
          placeholder="e.g. AB12 CDE or BX15KLM"
          className="input flex-1 text-xl"
          maxLength={12}
          required
        />
        <button
          type="submit"
          disabled={loading || !reg.trim()}
          className="btn-primary whitespace-nowrap disabled:opacity-60"
        >
          {loading ? "Looking up..." : "Find matching batteries"}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-ink/50">
        UK registration. We normalise spaces &amp; case. Demo regs work immediately after seeding.
      </p>
    </form>
  );
}
