# Smart Expense Tracker (Next.js + MongoDB) — Developed by **Ovi Sarker**

A free, full‑stack expense/income tracker with dark mode, filters, CSV export, budget alerts, and role‑based sharing.

## Stack
- Next.js (App Router)
- Tailwind CSS (dark mode toggle)
- MongoDB Atlas (Mongoose)
- JWT auth via HTTP‑only cookies
- Chart.js (react-chartjs-2)
- Vitest (unit tests)

## Features
- Register/Login
- Add **income** and **expense**
- Filter by **month / category / kind**
- CSV export (`/api/expenses/export`)
- Dashboard analytics, savings %, budget & alerts
- Invite family member to shared household
- **Developed by Ovi Sarker** (credit in UI footer)

## Local Setup
```bash
npm i
# create .env.local (do not commit)
# MONGODB_URI=...
# JWT_SECRET=...
npm run dev
```
Open http://localhost:3000

## Deploy (Free)
1. Push to GitHub
2. Vercel → New Project → Import
3. Add env vars: `MONGODB_URI`, `JWT_SECRET`
4. Deploy

## Test
```bash
npm run test
```

## Folder Structure
(see repository tree)

---
✨ Deployment refresh triggered — Developed by **Ovi Sarker** ✨

