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

test("GET /version renvoie le statut 200 et le numéro de version", async () => {
  const res = await fetch(`${base}/version`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { version: "1.0.0" });
});
