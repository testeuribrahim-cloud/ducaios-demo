import { createServer } from "node:http";
import { TodoList } from "./todos.js";

const MAX_BODY = 10_000;

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendText(res, status, text) {
  res.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  res.end(text);
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error("too_large");
  }
  return raw === "" ? {} : JSON.parse(raw);
}

/** L'application HTTP : GET /todos, POST /todos, POST /todos/:id/complete, GET /version, GET /ping, GET /about, GET /info, GET /merci. */
export function createApp(todos = new TodoList()) {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    try {
      if (req.method === "GET" && url.pathname === "/ping") return sendText(res, 200, "pong");
      if (req.method === "GET" && url.pathname === "/merci") return sendText(res, 200, "Merci");
      if (req.method === "GET" && url.pathname === "/version") return send(res, 200, { version: "1.0.0" });
      if (req.method === "GET" && url.pathname === "/about") return send(res, 200, { name: "ducaios-demo" });
      if (req.method === "GET" && url.pathname === "/info") return send(res, 200, { service: "ducaios-demo", ok: true });
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
