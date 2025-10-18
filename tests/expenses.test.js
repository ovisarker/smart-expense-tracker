import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "../utils/auth.js";

describe("auth utils", () => {
  it("signs and verifies JWT payload", () => {
    process.env.JWT_SECRET = "testsecret";
    const token = signToken({ _id:"123", email:"a@b.c" });
    const data = verifyToken(token);
    expect(data.email).toBe("a@b.c");
  });
});
