"use client";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch current user info
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {}
    })();
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          💰 Smart Expense
        </h1>
        <p className="text-xs text-gray-500 mt-1">Budget Smarter. Live Better.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2 text-gray-700 dark:text-gray-200">
          <a href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            📊 Dashboard
          </a>
          <a href="/expenses" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            🧾 All Expenses
          </a>
          <a href="/budget" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            💼 Budgets
          </a>
          <a href="/settings" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            ⚙️ Settings
          </a>
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-sm text-gray-800 dark:text-gray-100">
            {user ? user.name : "Loading..."}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="text-sm text-red-600 dark:text-red-400 hover:underline">Logout</button>
        </form>
      </div>
    </aside>
  );
}
