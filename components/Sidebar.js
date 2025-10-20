"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Sidebar({ open, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) setUser((await res.json()).user);
      } catch {}
    })();
  }, []);

  // Shared sidebar content
  const Nav = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">💰 Smart Expense</h1>
          <p className="text-[11px] text-gray-500">Budget Smarter. Live Better.</p>
        </div>
        <div className="md:hidden">
          <button onClick={onClose} aria-label="Close sidebar" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            ✖
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        <a href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">📊 Dashboard</a>
        <a href="/profile" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">👤 Profile</a>
        <a href="/expenses" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">🧾 All Expenses</a>
        <a href="/budget" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">💼 Budgets</a>
        <a href="/settings" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">⚙️ Settings</a>
      </nav>

      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{user ? user.name : "Loading…"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <ThemeToggle />
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="w-full text-left text-sm text-red-600 dark:text-red-400 hover:underline">Logout</button>
        </form>
      </div>
    </div>
  );

  // Desktop (fixed)
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 w-64 h-screen border-r border-gray-200 dark:border-gray-800 z-30">
        <Nav />
      </aside>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        {/* Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-72 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="h-full border-r border-gray-200 dark:border-gray-800">
            <Nav />
          </div>
        </div>
      </div>
    </>
  );
}
