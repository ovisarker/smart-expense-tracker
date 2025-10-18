import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/utils/auth";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return new Response("Invalid credentials", { status: 401 });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return new Response("Invalid credentials", { status: 401 });
  return setAuthCookie(user);
}
