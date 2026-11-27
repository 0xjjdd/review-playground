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

test("reading a key keeps it", () => {
  const c = new Cache<number>(2);
  c.set("a", 1);
  c.set("b", 2);
  c.get("a");
  c.set("c", 3);
  assert.equal(c.has("a"), true);
  assert.equal(c.has("b"), false);
});

test("rejects a zero limit", () => {
  assert.throws(() => new Cache<number>(0), RangeError);
});
