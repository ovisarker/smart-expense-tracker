import mongoose from "mongoose";
const HouseholdSchema = new mongoose.Schema({
  name: { type:String, required:true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
},{ timestamps:true });
export default mongoose.models.Household || mongoose.model("Household", HouseholdSchema);
