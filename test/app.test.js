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

const post = (path, body) =>
  fetch(`${base}${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("GET /health renvoie 200 et {status: ok}", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok" });
});

test("GET /todos renvoie une liste vide au départ", async () => {
  const res = await fetch(`${base}/todos`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), []);
});

test("POST /todos crée une tâche, puis POST /todos/:id/complete la termine", async () => {
  const created = await post("/todos", { title: "Tester l'API" });
  assert.equal(created.status, 201);
  const todo = await created.json();
  assert.equal(todo.title, "Tester l'API");

  const done = await post(`/todos/${todo.id}/complete`, {});
  assert.equal(done.status, 200);
  assert.equal((await done.json()).done, true);
});

test("titre vide → 400, tâche ou route inconnue → 404", async () => {
  assert.equal((await post("/todos", { title: "" })).status, 400);
  assert.equal((await post("/todos/999/complete", {})).status, 404);
  assert.equal((await fetch(`${base}/inconnu`)).status, 404);
});
