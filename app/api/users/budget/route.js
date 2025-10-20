import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/auth";

export async function POST(req){
  const me = getUserFromRequest();
  if(!me) return new Response("Unauthorized",{status:401});
  const { theme } = await req.json();
  if(!["system","light","dark"].includes(theme)) return new Response("Bad theme",{status:400});
  await dbConnect();
  const user = await User.findByIdAndUpdate(me._id, { themePreference: theme }, { new:true });
  return Response.json({ themePreference: user.themePreference });
}
