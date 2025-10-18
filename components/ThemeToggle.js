"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [dark,setDark] = useState(false);
  useEffect(()=>{
    const d = localStorage.getItem("darkMode")==="1";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  },[]);
  function toggle(){
    const next = !dark;
    setDark(next);
    localStorage.setItem("darkMode", next ? "1":"0");
    document.documentElement.classList.toggle("dark", next);
  }
  return (
    <button onClick={toggle} className="px-3 py-2 rounded-xl border dark:border-gray-700">
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
