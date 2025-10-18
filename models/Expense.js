import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  householdId: { type: mongoose.Schema.Types.ObjectId, ref:"Household" },
  title: { type:String, required:true },
  amount: { type:Number, required:true, min:0 },
  category: { type:String, required:true },
  kind: { type:String, enum:["expense","income"], default:"expense" },
  date: { type:Date, required:true }
},{ timestamps:true });

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
