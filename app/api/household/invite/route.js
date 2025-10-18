import { dbConnect } from "@/lib/db";
import { getUserFromRequest } from "@/utils/auth";
import User from "@/models/User";
import Household from "@/models/Household";
import bcrypt from "bcryptjs";

export async function POST(req){
  const me = getUserFromRequest();
  if(!me) return new Response("Unauthorized",{status:401});
  await dbConnect();

  const inviter = await User.findById(me._id);
  if(!inviter?.householdId) return new Response("No household",{status:400});

  const { email } = await req.json();
  if(!email) return new Response("Email required",{status:400});

  let invitee = await User.findOne({ email });
  if(!invitee) {
    const placeholder = await bcrypt.hash("temp-password", 10);
    invitee = await User.create({
      name: email.split("@")[0],
      email,
      password: placeholder,
      role: "member",
      householdId: inviter.householdId
    });
  } else {
    invitee.householdId = inviter.householdId;
    invitee.role = "member";
    await invitee.save();
  }
  await Household.findByIdAndUpdate(inviter.householdId, { $addToSet: { members: invitee._id }});
  return Response.json({ ok:true, invited: email });
}
