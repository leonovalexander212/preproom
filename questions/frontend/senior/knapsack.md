---
id: js-sr-knapsack
title: Задача о рюкзаке
difficulty: hard
language: javascript
---

# Описание

Дан рюкзак вместимостью W и N предметов, каждый с весом и ценностью. Определите максимальную суммарную ценность предметов, которые можно поместить в рюкзак (каждый предмет можно взять не более одного раза).

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const [N, W] = lines[0].split(' ').map(Number);
const items = [];
for (let i = 1; i <= N; i++) {
  const [weight, value] = lines[i].split(' ').map(Number);
  items.push({ weight, value });
}

function knapsack(W, items) {
  // ваш код
}

console.log(knapsack(W, items));
```

# Тесты

```json
[
  {"stdin": "3 50\n10 60\n20 100\n30 120", "expected": "220"},
  {"stdin": "1 5\n10 100", "expected": "0"},
  {"stdin": "2 10\n5 50\n5 60", "expected": "110"}
]
```