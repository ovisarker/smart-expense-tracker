import { dbConnect } from "@/lib/db";
import Expense from "@/models/Expense";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/auth";

export async function GET(req){
  const me = getUserFromRequest();
  if(!me) return new Response("Unauthorized",{status:401});
  await dbConnect();
  const user = await User.findById(me._id);

  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  const query = {};
  if(params.scope==="household" && user.householdId) query.householdId = user.householdId;
  else query.userId = user._id;

  if(params.category) query.category = params.category;
  if(params.kind) query.kind = params.kind;
  if(params.month){
    const [y,m] = params.month.split("-").map(Number);
    const start = new Date(Date.UTC(y,m-1,1)), end = new Date(Date.UTC(y,m,1));
    query.date = { $gte:start, $lt:end };
  }

  const items = await Expense.find(query).sort({ date:-1 });
  const header = "Title,Category,Kind,Amount,Date\n";
  const rows = items.map(x =>
    `"${
      String(x.title).replace(/"/g,'""')
    }",${x.category},${x.kind},${x.amount},${new Date(x.date).toISOString().slice(0,10)}`
  ).join("\n");
  const csv = header + rows;

  return new Response(csv, {
    headers:{
      "Content-Type":"text/csv; charset=utf-8",
      "Content-Disposition":"attachment; filename=expenses.csv"
    }
  });
}
