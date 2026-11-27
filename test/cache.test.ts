import { test } from "node:test";
import assert from "node:assert/strict";
import { Cache } from "../src/cache.ts";

test("keeps at most limit entries", () => {
  const c = new Cache<number>(2);
  c.set("a", 1);
  c.set("b", 2);
  c.set("c", 3);
  assert.equal(c.size, 2);
  assert.equal(c.get("a"), undefined);
});
