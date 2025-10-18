import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type:String, required:true, trim:true },
  email: { type:String, required:true, unique:true, lowercase:true },
  password: { type:String, required:true },
  role: { type:String, enum:["owner","member"], default:"owner" },
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household" },
  monthlyBudget: { type:Number, default: 0 }
},{ timestamps:true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
