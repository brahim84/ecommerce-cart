"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useProductStore } from "../../_zustand/store";

export default function SuccessPage() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");
  const clearCart = useProductStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-xl py-16 px-4">
      <h1 className="text-2xl font-bold">Thanks! Your payment was successful.</h1>
      <p className="mt-2 text-gray-700">
        Session ID: {sessionId ?? "—"} (keep for reference)
      </p>
      <Link href="/" className="mt-6 inline-block underline">
        Continue shopping
      </Link>
    </div>
  );
}