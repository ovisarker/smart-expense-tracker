"use client";
import { useEffect, useState } from "react";
import FooterCredit from "@/components/FooterCredit";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) window.location.href = "/dashboard";
      else setLoading(false);
    })();
  }, []);
  if (loading) return <div className="h-screen grid place-items-center">Loading…</div>;
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">Smart Expense Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300">Simple, fast and free expense tracking with charts & categories.</p>
        <div className="flex gap-4 justify-center">
          <a className="px-5 py-3 rounded-xl bg-black text-white" href="/register">Create Account</a>
          <a className="px-5 py-3 rounded-xl border dark:border-gray-700" href="/login">Log in</a>
        </div>
      </div>
      <FooterCredit />
    </main>
  );
}
