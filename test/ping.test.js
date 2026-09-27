import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

let server;
let base;

before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));

test("GET /ping renvoie 200 et le texte 'pong'", async () => {
  const res = await fetch(`${base}/ping`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "pong");
});
