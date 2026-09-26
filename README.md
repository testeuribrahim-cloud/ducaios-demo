# ducaios-demo

Petite application Node de démonstration, sur laquelle travaille l'agent Coding
de [DucAiOs](https://github.com/testeuribrahim-cloud/ducaios). Elle ne contient
aucun secret et n'a aucune dépendance.

- `src/todos.js` : une liste de tâches en mémoire.
- `src/app.js` : une API HTTP (`GET /todos`, `POST /todos`,
  `POST /todos/:id/complete`).
- `test/` : les tests, avec le lanceur intégré de Node.

```bash
npm test      # Node 22 ou plus
npm start     # http://localhost:3000
```

## Règles du dépôt

- La branche `main` est protégée : aucun push direct, et toute modification
  passe par une pull request qui doit recevoir une revue approuvée avant la
  fusion. Les administrateurs n'y échappent pas.
- DucAiOs travaille sur des branches `ducaios/<tâche>` et ouvre des pull
  requests ; il ne fusionne jamais. La fusion est faite par une personne.
