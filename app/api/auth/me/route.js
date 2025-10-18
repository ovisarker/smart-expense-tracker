import { getUserFromRequest } from "@/utils/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const userPayload = getUserFromRequest();
  if (!userPayload) return new Response("Unauthorized", { status: 401 });
  await dbConnect();
  const user = await User.findById(userPayload._id).lean();
  return Response.json({ user: { _id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget||0 } });
}
