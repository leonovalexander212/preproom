---
id: js-sr-topo-sort
title: Топологическая сортировка
difficulty: hard
language: javascript
---

# Описание

Дан ориентированный граф. Выполните топологическую сортировку алгоритмом Кана с использованием мин-кучи для детерминированного порядка. Если граф содержит цикл, выведите "CYCLE".

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const [N, M] = lines[0].split(' ').map(Number);
const edges = [];
for (let i = 1; i <= M; i++) {
  edges.push(lines[i].split(' ').map(Number));
}

function topoSort(N, edges) {
  // ваш код
}

console.log(topoSort(N, edges));
```

# Тесты

```json
[
  {"stdin": "4 3\n1 2\n1 3\n3 4", "expected": "1 2 3 4"},
  {"stdin": "3 2\n3 1\n3 2", "expected": "3 1 2"},
  {"stdin": "2 2\n1 2\n2 1", "expected": "CYCLE"}
]
```