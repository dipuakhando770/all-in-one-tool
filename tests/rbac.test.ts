import test from "node:test";
import assert from "node:assert/strict";
import { hasRole, isAdmin } from "../src/lib/auth/rbac.ts";

test("rbac isAdmin", () => {
  assert.equal(isAdmin(["admin"]), true);
  assert.equal(isAdmin(["user"]), false);
});
test("rbac hasRole admin bypass", () => {
  assert.equal(hasRole(["admin"], "editor"), true);
  assert.equal(hasRole(["user"], "admin"), false);
  assert.equal(hasRole(["user"], "user"), true);
});
