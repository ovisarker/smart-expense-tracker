"use client";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
    if (res.ok) window.location.href = "/dashboard";
    else setErr(await res.text());
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <input className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl" placeholder="Email" type="email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl" placeholder="Password" type="password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="w-full bg-black text-white p-3 rounded-xl">Log in</button>
        <p className="text-sm">No account? <a className="underline" href="/register">Create one</a></p>
      </form>
    </div>
  );
}
