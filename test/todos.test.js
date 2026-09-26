import { test } from "node:test";
import assert from "node:assert/strict";
import { TodoList } from "../src/todos.js";

test("ajoute une tâche avec un identifiant et un titre nettoyé", () => {
  const todos = new TodoList();
  assert.deepEqual(todos.add("  Écrire les tests  "), { id: 1, title: "Écrire les tests", done: false });
  assert.equal(todos.add("Relire").id, 2);
});

test("refuse un titre vide", () => {
  assert.throws(() => new TodoList().add("   "), TypeError);
  assert.throws(() => new TodoList().add(undefined), TypeError);
});

test("termine une tâche existante, ignore une tâche inconnue", () => {
  const todos = new TodoList();
  todos.add("Déployer");
  assert.equal(todos.complete(1)?.done, true);
  assert.equal(todos.complete(99), undefined);
  assert.deepEqual(todos.list(), [{ id: 1, title: "Déployer", done: true }]);
});

test("la liste renvoyée est une copie", () => {
  const todos = new TodoList();
  todos.add("A");
  todos.list()[0].title = "modifié";
  assert.equal(todos.list()[0].title, "A");
});
