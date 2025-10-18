import { dbConnect } from "@/lib/db";
import Expense from "@/models/Expense";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/auth";

function toDateRange(month){
  if(!month) return null;
  const [y,m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m-1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return { start, end };
}

export async function GET(req){
  const me = getUserFromRequest();
  if(!me) return new Response("Unauthorized",{status:401});
  await dbConnect();
  const user = await User.findById(me._id);

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const category = searchParams.get("category");
  const kind = searchParams.get("kind");
  const scope = searchParams.get("scope");

  const query = {};
  if(scope==="household" && user.householdId) query.householdId = user.householdId;
  else query.userId = user._id;

  const range = toDateRange(month);
  if(range) query.date = { $gte: range.start, $lt: range.end };
  if(category) query.category = category;
  if(kind) query.kind = kind;

  const items = await Expense.find(query).sort({ date:-1 });
  return Response.json({ items });
}

export async function POST(req){
  const me = getUserFromRequest();
  if(!me) return new Response("Unauthorized",{status:401});
  await dbConnect();
  const user = await User.findById(me._id);
  const body = await req.json();

  const item = await Expense.create({
    userId: user._id,
    householdId: user.householdId,
    title: body.title,
    amount: Number(body.amount),
    category: body.category || "Other",
    kind: body.kind || "expense",
    date: body.date ? new Date(body.date) : new Date()
  });
  return Response.json({ item },{status:201});
}
