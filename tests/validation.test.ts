import test from "node:test";
import assert from "node:assert/strict";
import { registerSchema, loginSchema } from "../src/lib/validation/auth.ts";

test("registerSchema accepts valid", () => {
  const r = registerSchema.safeParse({ email: "a@b.com", password: "password123" });
  assert.equal(r.success, true);
});
test("registerSchema rejects short password", () => {
  const r = registerSchema.safeParse({ email: "a@b.com", password: "short" });
  assert.equal(r.success, false);
});
test("loginSchema validates", () => {
  const r = loginSchema.safeParse({ email: "a@b.com", password: "x" });
  assert.equal(r.success, true);
});
