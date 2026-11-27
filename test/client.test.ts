import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "../src/client.ts";

const reply = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status });

test("retries a 503 and then succeeds", async () => {
  const seen: number[] = [];
  const statuses = [503, 200];
  const fake = (async () => {
    const s = statuses.shift()!;
    seen.push(s);
    return reply(s, { ok: true });
  }) as typeof fetch;
  const c = new Client({ baseUrl: "http://x", backoffMs: 1 }, fake);
  assert.deepEqual(await c.get("/a"), { ok: true });
  assert.deepEqual(seen, [503, 200]);
});

test("does not retry a 404", async () => {
  let calls = 0;
  const fake = (async () => {
    calls++;
    return reply(404);
  }) as typeof fetch;
  const c = new Client({ baseUrl: "http://x", backoffMs: 1 }, fake);
  await assert.rejects(c.get("/a"), /404/);
  assert.equal(calls, 1);
});
