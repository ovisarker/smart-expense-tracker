"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProfilePage(){
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState("");
  const [theme, setTheme] = useState("system");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) { window.location.href="/login"; return; }
      const data = await res.json();
      setUser(data.user);
      setBudget(String(data.user.monthlyBudget || 0));
      setTheme(data.user.themePreference || "system");
    })();
  }, []);

  async function saveAll(e){
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      await fetch("/api/users/budget", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ monthlyBudget: Number(budget || 0) })
      });
      await fetch("/api/users/theme", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ theme })
      });
      setMsg("Saved successfully!");
    } catch {
      setMsg("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function logout(){
    await fetch("/api/auth/logout",{method:"POST"});
    window.location.href="/login";
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} />

      <header className="md:ml-64 sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={()=>setSidebarOpen(true)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-700"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Profile</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">View & update your settings</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="px-3 py-2 rounded-xl border dark:border-gray-700">Log out</button>
          </div>
        </div>
      </header>

      <main className="md:ml-64 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-5">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-medium">{user?.name || "…"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium">{user?.email || "…"}</p>
          </div>

          <form onSubmit={saveAll} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Budget</label>
              <input
                type="number"
                className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl"
                value={budget}
                onChange={e=>setBudget(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Theme Preference</label>
              <select
                className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl"
                value={theme}
                onChange={e=>setTheme(e.target.value)}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Tip: The theme toggle also cycles between these modes.</p>
            </div>

            <div className="flex items-center gap-2">
              <button disabled={saving} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60">
                {saving ? "Saving…" : "Save changes"}
              </button>
              {msg && <span className="text-sm text-gray-600 dark:text-gray-300">{msg}</span>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
