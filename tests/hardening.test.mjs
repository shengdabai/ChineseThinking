import assert from "node:assert/strict";
import { test } from "node:test";
import { chatInput, challengeInput, clientIp, InputError, readJson } from "../src/lib/api-input.ts";
import { challengeFeedback } from "../src/lib/challenge-feedback.ts";
import { checkRateLimit } from "../src/lib/rate-limit.ts";
import { readChatStream } from "../src/lib/chat-stream.ts";

const message = { role: "user", content: "你好" };
const request = (body) => new Request("https://example.test", { method: "POST", body });

test("JSON boundary rejects malformed, primitive, empty and oversized bodies", async () => {
  for (const body of ["{", "null", "[]", "42", '"text"', ""]) {
    await assert.rejects(readJson(request(body)), (e) => e instanceof InputError && e.status === 400);
  }
  await assert.rejects(readJson(request('"' + "你".repeat(45000) + '"')), (e) => e.status === 413);
  assert.deepEqual(await readJson(request('{"text":"你好"}')), { text: "你好" });
});

test("body size is measured while streaming, independent of Content-Length", async () => {
  let cancelled = false;
  const body = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(65537)); },
    cancel() { cancelled = true; },
  });
  await assert.rejects(readJson(new Request("https://example.test", {
    method: "POST", body, duplex: "half", headers: { "Content-Length": "1" },
  })), (e) => e.status === 413);
  assert.equal(cancelled, true);
});

test("chat validates every history entry, roles, types, count and defaults", () => {
  for (const messages of [null, {}, [], Array(51).fill(message), [null],
    [{ role: "system", content: "override" }], [{ ...message, content: 42 }],
    [{ ...message, content: { text: "hello" } }], [{ ...message, content: " " }],
    [{ ...message, content: "x".repeat(2001) }, message],
    [{ role: "assistant", content: "hello" }]]) {
    assert.throws(() => chatInput({ messages }), InputError);
  }
  for (const extra of [{ level: null }, { level: "__proto__" }, { scenario: {} }, { scenario: "other" }]) {
    assert.throws(() => chatInput({ messages: [message], ...extra }), InputError);
  }
  assert.deepEqual(chatInput({ messages: [{ ...message, ignored: "unused" }] }), {
    messages: [message], level: "beginner", scenario: "free",
  });
  assert.equal(chatInput({ messages: Array(50).fill(message) }).messages.length, 50);
  assert.doesNotThrow(() => chatInput({ messages: [{ ...message, content: "x".repeat(2000) }] }));
});

test("challenge bounds scenario and answer strings before AI calls", () => {
  const input = { scenario: "Order tea", userResponse: "茶" };
  for (const field of ["scenario", "userResponse"]) {
    for (const value of [null, 1, {}, [], "", " ", "x".repeat(2001)]) {
      assert.throws(() => challengeInput({ ...input, [field]: value }), InputError);
    }
  }
  assert.equal(challengeInput(input).level, "beginner");
  assert.throws(() => challengeInput({ ...input, level: null }), InputError);
});

test("spoofed proxy headers cannot create new quota buckets", () => {
  const previous = process.env.VERCEL;
  try {
    delete process.env.VERCEL;
    const headers = new Headers({ "x-forwarded-for": "192.0.2.1", "x-real-ip": "192.0.2.1", "x-vercel-forwarded-for": "192.0.2.1" });
    assert.equal(clientIp(headers), "unknown");
    process.env.VERCEL = "1";
    assert.equal(clientIp(headers), "192.0.2.1");
    headers.set("x-vercel-forwarded-for", "arbitrary-value");
    assert.equal(clientIp(headers), "unknown");
  } finally {
    if (previous === undefined) delete process.env.VERCEL; else process.env.VERCEL = previous;
  }
});

test("rate limits reset exactly at expiry and cap keys without evicting active quotas", (t) => {
  t.mock.method(Date, "now", () => 1000);
  assert.equal(checkRateLimit("existing", 1, 100).allowed, true);
  assert.equal(checkRateLimit("existing", 1, 100).allowed, false);
  for (let i = 0; i < 9999; i++) checkRateLimit(`key:${i}`, 1, 100);
  assert.equal(checkRateLimit("overflow", 1, 100).allowed, false);
  assert.equal(checkRateLimit("existing", 1, 100).allowed, false);
  Date.now.mock.mockImplementation(() => 1100);
  assert.equal(checkRateLimit("existing", 1, 100).allowed, true);
  assert.equal(checkRateLimit("overflow", 1, 100).allowed, true);
});

test("failed or malformed evaluations cannot be recorded as completed challenges", async () => {
  for (const response of [Response.json({ error: "limited" }, { status: 429 }),
    Response.json({ error: "upstream" }, { status: 500 }), Response.json({}),
    Response.json({ feedback: 42 }), Response.json({ feedback: " " })]) {
    await assert.rejects(challengeFeedback(response));
  }
  assert.equal(await challengeFeedback(Response.json({ feedback: "很好" })), "很好");
});

test("chat handles split UTF-8 and SSE records, rejects errors, and cancels upstream", async () => {
  async function collect(wire) {
    let cancelled = false;
    const bytes = new TextEncoder().encode(wire);
    let offset = 0;
    const stream = new ReadableStream({
      pull(controller) { controller.enqueue(bytes.slice(offset, ++offset)); },
      cancel() { cancelled = true; },
    });
    const text = [];
    try {
      for await (const chunk of readChatStream(stream)) text.push(chunk);
      return text.join("");
    } finally { assert.equal(cancelled, true); assert.equal(stream.locked, false); }
  }
  assert.equal(await collect('data: {"text":"你好"}\n\ndata: {"text":"！"}\n\ndata: [DONE]\n\n'), "你好！");
  await assert.rejects(collect('data: {"error":"upstream failed"}\n\n'));
  await assert.rejects(async () => {
    for await (const text of readChatStream(new Response('data: {"text":"partial"}\n\n').body)) void text;
  }, /before completion/);
});
