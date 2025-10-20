"use client";
import { useEffect, useState } from "react";

function applyTheme(pref) {
  if (pref === "system") {
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.classList.toggle("dark", sys === "dark");
  } else {
    document.documentElement.classList.toggle("dark", pref === "dark");
  }
}

export default function ThemeToggle(){
  const [pref, setPref] = useState("system");

  useEffect(() => {
    const saved = localStorage.getItem("themePref") || "system";
    setPref(saved);
    applyTheme(saved);
    // react to OS changes when in system mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => saved === "system" && applyTheme("system");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  async function cycle(){
    const order = ["system","light","dark"];
    const next = order[(order.indexOf(pref) + 1) % order.length];
    setPref(next);
    localStorage.setItem("themePref", next);
    applyTheme(next);
    // best-effort save to profile (ignore if not logged in)
    try { await fetch("/api/users/theme", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ theme: next }) }); } catch {}
  }

  const label = pref === "system" ? "🖥️ System" : (pref === "dark" ? "🌙 Dark" : "☀️ Light");

  return (
    <button onClick={cycle} className="px-3 py-2 rounded-xl border dark:border-gray-700">
      {label}
    </button>
  );
}
