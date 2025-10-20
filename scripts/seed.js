// Standalone seed (no imports from app to avoid ESM/CJS issues)
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ Please set MONGODB_URI before running the seed script.");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["owner", "member"], default: "owner" },
  householdId: mongoose.Schema.Types.ObjectId,
  monthlyBudget: { type: Number, default: 1500 },
  themePreference: { type: String, enum: ["system", "light", "dark"], default: "system" }
});
const householdSchema = new mongoose.Schema({
  name: String,
  members: [mongoose.Schema.Types.ObjectId]
});
const expenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  householdId: mongoose.Schema.Types.ObjectId,
  title: String,
  amount: Number,
  category: String,
  kind: { type: String, enum: ["expense", "income"], default: "expense" },
  date: Date
});

const User = mongoose.model("User", userSchema);
const Household = mongoose.model("Household", householdSchema);
const Expense = mongoose.model("Expense", expenseSchema);

async function main() {
  await mongoose.connect(uri, { dbName: "expense_tracker" });

  // idempotent: run many times safely
  const email = "demo@tracker.com";
  let user = await User.findOne({ email });
  if (!user) {
    const hh = await Household.create({ name: "Demo Household", members: [] });
    user = await User.create({
      name: "Demo User",
      email,
      password: await bcrypt.hash("Demo12345!", 10),
      role: "owner",
      householdId: hh._id,
      monthlyBudget: 2000,
      themePreference: "system"
    });
    hh.members.push(user._id);
    await hh.save();
  }

  const now = new Date();
  const month = now.getUTCMonth();
  const year = now.getUTCFullYear();
  const mkDate = (m, d) => new Date(Date.UTC(year, m, d));

  const rows = [
    { title: "Freelance", amount: 2000, category: "Work", kind: "income", date: mkDate(month, 1) },
    { title: "Groceries", amount: 350, category: "Food", kind: "expense", date: mkDate(month, 3) },
    { title: "Transport pass", amount: 60, category: "Transport", kind: "expense", date: mkDate(month, 5) },
    { title: "Electricity Bill", amount: 120, category: "Bills", kind: "expense", date: mkDate(month, 9) },
    { title: "Shopping", amount: 90, category: "Shopping", kind: "expense", date: mkDate(month, 12) }
  ];

  // upsert by title+month for demo
  for (const x of rows) {
    const exists = await Expense.findOne({
      userId: user._id,
      title: x.title,
      date: { $gte: new Date(Date.UTC(year, month, 1)), $lt: new Date(Date.UTC(year, month + 1, 1)) }
    });
    if (!exists) {
      await Expense.create({ ...x, userId: user._id, householdId: user.householdId });
    }
  }

  console.log("✅ Seed complete. Demo user:", email, "password: Demo12345!");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
