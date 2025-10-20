import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "exp_app_token";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}
export function verifyToken(token) {
  try { return jwt.verify(token, process.env.JWT_SECRET); } catch { return null; }
}
export function setAuthCookie(user) {
  const token = signToken({
    _id: user._id,
    email: user.email,
    name: user.name,
    monthlyBudget: user.monthlyBudget,
    themePreference: user.themePreference || "system"      // ← add
  });
  const res = NextResponse.json({
    ok: true,
    user: {
      name: user.name,
      email: user.email,
      _id: user._id,
      monthlyBudget: user.monthlyBudget || 0,
      themePreference: user.themePreference || "system"    // ← add
    }
  });
  res.cookies.set({ name: COOKIE_NAME, value: token, httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 7*24*60*60 });
  return res;
}
export function clearAuthCookie() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: COOKIE_NAME, value: "", maxAge: 0, path: "/" });
  return res;
}
export function getUserFromRequest() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
