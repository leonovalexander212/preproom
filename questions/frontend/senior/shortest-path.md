---
id: js-sr-shortest-path
title: Кратчайший путь в графе
difficulty: hard
language: javascript
---

# Описание

Дан невзвешенный неориентированный граф. Найдите кратчайший путь между двумя вершинами, используя BFS. Если путь не существует, верните -1.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const [N, M] = lines[0].split(' ').map(Number);
const edges = [];
for (let i = 1; i <= M; i++) {
  edges.push(lines[i].split(' ').map(Number));
}
const [start, end] = lines[M + 1].split(' ').map(Number);

function shortestPath(N, edges, start, end) {
  // ваш код
}

console.log(shortestPath(N, edges, start, end));
```

# Тесты

```json
[
  {"stdin": "4 4\n1 2\n2 3\n3 4\n1 3\n1 4", "expected": "2"},
  {"stdin": "3 1\n1 2\n1 3", "expected": "-1"},
  {"stdin": "2 1\n1 2\n1 2", "expected": "1"}
]
```