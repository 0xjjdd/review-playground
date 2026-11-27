import { test } from "node:test";
import assert from "node:assert/strict";
import { paginate, pageCount } from "../src/paginate.ts";

test("page 1 starts at the first item", () => {
  assert.deepEqual(paginate([1, 2, 3, 4, 5], 1, 2), [1, 2]);
});

test("page 0 is rejected", () => {
  assert.throws(() => paginate([1], 0, 2), RangeError);
});

test("a partial last page counts", () => {
  assert.equal(pageCount(5, 2), 3);
});
