"use client";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import FooterCredit from "@/components/FooterCredit";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CATEGORIES = ["Food","Transport","Rent","Shopping","Bills","Other"];
const KINDS = ["expense","income"];

export default function Dashboard(){
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user,setUser] = useState(null);
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ title:"", amount:"", category:"Food", kind:"expense", date: dayjs().format("YYYY-MM-DD") });
  const [editing,setEditing] = useState(null);
  const [err,setErr] = useState("");

  // Filters
  const [month,setMonth] = useState(dayjs().format("YYYY-MM"));
  const [fCategory,setFCategory] = useState("");
  const [fKind,setFKind] = useState("");

  useEffect(()=>{ (async()=>{
    const me = await fetch("/api/auth/me");
    if(!me.ok) return (window.location.href="/login");
    setUser((await me.json()).user);
    await load();
  })(); },[]);

  async function load(){
    const qs = new URLSearchParams({});
    if(month) qs.set("month", month);
    if(fCategory) qs.set("category", fCategory);
    if(fKind) qs.set("kind", fKind);
    const res = await fetch(`/api/expenses?${qs.toString()}`);
    if(res.ok) setItems((await res.json()).items);
  }

  async function logout(){
    await fetch("/api/auth/logout",{method:"POST"});
    window.location.href="/login";
  }

  async function addOrUpdate(e){
    e.preventDefault();
    setErr("");
    const payload = { ...form, amount:Number(form.amount) };
    if(!payload.title || !payload.amount) return setErr("Please fill all fields");
    const url = editing ? `/api/expenses/${editing}` : "/api/expenses";
    const method = editing ? "PUT":"POST";
    const res = await fetch(url,{ method, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    if(res.ok){
      setForm({ title:"", amount:"", category:"Food", kind:"expense", date: dayjs().format("YYYY-MM-DD") });
      setEditing(null);
      load();
    }else setErr(await res.text());
  }

  async function del(id){
    if(!confirm("Delete this entry?")) return;
    await fetch(`/api/expenses/${id}`,{ method:"DELETE" });
    load();
  }

  function startEdit(it){
    setEditing(it._id);
    setForm({ title:it.title, amount:it.amount, category:it.category, kind:it.kind, date: it.date?.slice(0,10) });
  }

  // Aggregates
  const totalsByCategory = useMemo(()=>{
    const t = Object.fromEntries(CATEGORIES.map(c=>[c,0]));
    for(const x of items) if(x.kind==="expense") t[x.category] = (t[x.category]||0) + x.amount;
    return t;
  },[items]);

  const income = items.filter(x=>x.kind==="income").reduce((s,x)=>s+x.amount,0);
  const expense = items.filter(x=>x.kind==="expense").reduce((s,x)=>s+x.amount,0);
  const savings = Math.max(income - expense, 0);
  const savingsPct = income ? (savings/income)*100 : 0;

  // Budget alerts
  const overBudget = user?.monthlyBudget && expense > user.monthlyBudget;
  const nearBudget  = user?.monthlyBudget && expense > user.monthlyBudget*0.8 && !overBudget;

  const chartData = useMemo(()=>({
    labels: CATEGORIES,
    datasets: [{ label:"Expenses by Category", data: CATEGORIES.map(c=>totalsByCategory[c]||0) }]
  }),[totalsByCategory]);

  async function exportCSV(){
    const qs = new URLSearchParams({});
    if(month) qs.set("month", month);
    if(fCategory) qs.set("category", fCategory);
    if(fKind) qs.set("kind", fKind);
    const a = document.createElement("a");
    a.href = `/api/expenses/export?${qs.toString()}`;
    a.click();
  }

  async function invite(){
    const email = prompt("Enter family member's email to invite:");
    if(!email) return;
    const res = await fetch("/api/household/invite",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email }) });
    if(res.ok) alert("Invited!");
    else alert(await res.text());
  }

  async function saveBudget(){
    const v = prompt("Set your monthly budget (number):", String(user?.monthlyBudget||0));
    if(v==null) return;
    const r = await fetch("/api/users/budget",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ monthlyBudget:Number(v) }) });
    if(r.ok){ const me = await fetch("/api/auth/me"); setUser((await me.json()).user); load(); }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar (desktop + mobile) */}
      <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} />

      {/* Top bar */}
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
              <h2 className="text-xl sm:text-2xl font-semibold">
                {user ? `Welcome, ${user.name}!` : "Welcome back!"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage your expenses and budget below</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <button onClick={invite} className="px-3 py-2 rounded-xl border dark:border-gray-700">Invite</button>
            <button onClick={logout} className="px-3 py-2 rounded-xl border dark:border-gray-700">Log out</button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="md:ml-64 p-4 sm:p-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mb-6 grid sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Month</label>
            <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="w-full border dark:border-gray-700 bg-transparent p-2 rounded-xl" />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Category</label>
            <select value={fCategory} onChange={e=>setFCategory(e.target.value)} className="w-full border dark:border-gray-700 bg-transparent p-2 rounded-xl">
              <option value="">All</option>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Kind</label>
            <select value={fKind} onChange={e=>setFKind(e.target.value)} className="w-full border dark:border-gray-700 bg-transparent p-2 rounded-xl">
              <option value="">All</option>
              {KINDS.map(k=><option key={k}>{k}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={load} className="px-4 py-2 rounded-xl bg-black text-white">Apply</button>
            <button onClick={exportCSV} className="px-4 py-2 rounded-xl border dark:border-gray-700">Export CSV</button>
          </div>
        </div>

        <section className="grid md:grid-cols-3 gap-6">
          {/* Add / Edit */}
          <div className="md:col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow">
            <h2 className="font-medium mb-4">{editing ? "Edit entry" : "Add entry"}</h2>
            {err && <p className="text-sm text-red-500 mb-2">{err}</p>}
            <form onSubmit={addOrUpdate} className="space-y-3">
              <input className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl" placeholder="Title"
                value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
              <input className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl" placeholder="Amount" type="number" step="0.01"
                value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
              <select className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl"
                value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <select className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl"
                value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}>
                {KINDS.map(k=><option key={k}>{k}</option>)}
              </select>
              <input className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl" type="date"
                value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
              <div className="flex gap-2">
                <button className="flex-1 bg-black text-white p-3 rounded-xl">{editing ? "Update":"Add"}</button>
                {editing && <button type="button" onClick={()=>{setEditing(null); setForm({ title:"", amount:"", category:"Food", kind:"expense", date: dayjs().format("YYYY-MM-DD") });}} className="px-4 rounded-xl border dark:border-gray-700">Cancel</button>}
              </div>
            </form>
          </div>

          {/* Analytics & List */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
                <p className="text-2xl font-bold">${income.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">Expense</p>
                <p className="text-2xl font-bold">${expense.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">Savings %</p>
                <p className="text-2xl font-bold">{savingsPct.toFixed(0)}%</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                  <button onClick={saveBudget} className="text-xs underline">Set</button>
                </div>
                <p className="text-2xl font-bold">${(user?.monthlyBudget||0).toFixed(0)}</p>
                {overBudget && <p className="text-xs text-red-500 mt-2">Over budget!</p>}
                {nearBudget && !overBudget && <p className="text-xs text-amber-500 mt-2">Near budget (80%+)</p>}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow"><Bar data={chartData} /></div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow">
              <h2 className="font-medium mb-4">Recent Entries</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b dark:border-gray-800">
                      <th className="py-2">Title</th><th>Category</th><th>Kind</th><th>Amount</th><th>Date</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(it=>(
                      <tr key={it._id} className="border-b dark:border-gray-800 last:border-0">
                        <td className="py-2">{it.title}</td>
                        <td>{it.category}</td>
                        <td className="uppercase">{it.kind}</td>
                        <td>${it.amount.toFixed(2)}</td>
                        <td>{new Date(it.date).toLocaleDateString()}</td>
                        <td className="text-right">
                          <button onClick={()=>startEdit(it)} className="px-3 py-1 rounded-lg border dark:border-gray-700 mr-2">Edit</button>
                          <button onClick={()=>del(it._id)} className="px-3 py-1 rounded-lg border dark:border-gray-700">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {!items.length && <tr><td className="py-4 text-gray-500 dark:text-gray-400" colSpan={6}>No data.</td></tr>}
                  </tbody>
                </table>
              </div>
              <FooterCredit />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
