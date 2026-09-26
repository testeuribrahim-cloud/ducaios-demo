/** Une liste de tâches en mémoire : la logique métier, sans HTTP. */
export class TodoList {
  #items = [];
  #nextId = 1;

  add(title) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new TypeError("Le titre d'une tâche est obligatoire");
    }
    const todo = { id: this.#nextId++, title: title.trim(), done: false };
    this.#items.push(todo);
    return { ...todo };
  }

  complete(id) {
    const todo = this.#items.find((t) => t.id === id);
    if (!todo) return undefined;
    todo.done = true;
    return { ...todo };
  }

  list() {
    return this.#items.map((t) => ({ ...t }));
  }
}
