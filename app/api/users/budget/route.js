import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/auth";

export async function POST(req){
  const me = getUserFromRequest();
  if(!me) return new Response("Unauthorized",{status:401});
  await dbConnect();
  const { monthlyBudget } = await req.json();
  const user = await User.findByIdAndUpdate(me._id, { monthlyBudget:Number(monthlyBudget||0) }, { new:true });
  return Response.json({ user:{ _id:user._id, monthlyBudget:user.monthlyBudget } });
}
