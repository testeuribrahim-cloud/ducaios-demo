import { createServer } from "node:http";
import { TodoList } from "./todos.js";

const MAX_BODY = 10_000;

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error("too_large");
  }
  return raw === "" ? {} : JSON.parse(raw);
}

/** L'application HTTP : GET /health, GET /todos, POST /todos, POST /todos/:id/complete. */
export function createApp(todos = new TodoList()) {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    try {
      if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { status: "ok" });
      if (req.method === "GET" && url.pathname === "/todos") return send(res, 200, todos.list());
      if (req.method === "POST" && url.pathname === "/todos") {
        const body = await readJson(req);
        return send(res, 201, todos.add(body.title));
      }
      const match = /^\/todos\/(\d+)\/complete$/.exec(url.pathname);
      if (req.method === "POST" && match) {
        const todo = todos.complete(Number(match[1]));
        return todo ? send(res, 200, todo) : send(res, 404, { error: "not_found" });
      }
      return send(res, 404, { error: "not_found" });
    } catch (error) {
      return send(res, 400, { error: error instanceof TypeError ? error.message : "bad_request" });
    }
  });
}
