import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Household from "@/models/Household";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/utils/auth";

export async function POST(req){
  await dbConnect();
  const { name, email, password } = await req.json();
  if(!name || !email || !password) return new Response("Missing fields",{status:400});

  const exists = await User.findOne({ email });
  if(exists) return new Response("Email already registered",{status:409});

  const hashed = await bcrypt.hash(password,10);
  const hh = await Household.create({ name: `${name}'s Household`, members:[] });
  const user = await User.create({ name, email, password:hashed, role:"owner", householdId: hh._id });
  hh.members.push(user._id); await hh.save();

  return setAuthCookie(user);
}
