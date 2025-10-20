import mongoose from "mongoose";
import { Expense } from "../models/Expense.js";
import { Household } from "../models/Household.js";
import { User } from "../models/User.js";

const uri = process.env.MONGODB_URI;

const seed = async () => {
  await mongoose.connect(uri);

  const user = await User.create({
    name: "Demo User",
    email: "demo@tracker.com",
    password: "Demo12345!"
  });

  const household = await Household.create({
    name: "Demo Household",
    members: [user._id],
  });

  const demoExpenses = [
    { title: "Groceries", amount: 200, category: "Food", kind: "expense" },
    { title: "Electricity Bill", amount: 120, category: "Utilities", kind: "expense" },
    { title: "Freelance Income", amount: 800, category: "Work", kind: "income" },
  ];

  for (const item of demoExpenses) {
    await Expense.create({ ...item, user: user._id, household: household._id });
  }

  console.log("✅ Demo data added!");
  process.exit();
};

seed();
