import { dbConnect } from "@/lib/db";
import Expense from "@/models/Expense";
import { getUserFromRequest } from "@/utils/auth";

export async function PUT(req, { params }) {
  const user = getUserFromRequest();
  if (!user) return new Response("Unauthorized", { status: 401 });
  await dbConnect();
  const body = await req.json();
  const updated = await Expense.findOneAndUpdate(
    { _id: params.id, userId: user._id },
    { $set: { title: body.title, amount: Number(body.amount), category: body.category, kind: body.kind, date: new Date(body.date) } },
    { new: true }
  );
  if (!updated) return new Response("Not found", { status: 404 });
  return Response.json({ item: updated });
}

export async function DELETE(req, { params }) {
  const user = getUserFromRequest();
  if (!user) return new Response("Unauthorized", { status: 401 });
  await dbConnect();
  await Expense.findOneAndDelete({ _id: params.id, userId: user._id });
  return Response.json({ ok: true });
}
