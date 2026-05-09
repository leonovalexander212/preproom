---
id: js-sr-coin-change
title: Размен монет
difficulty: hard
language: javascript
---

# Описание

Даны номиналы монет и целевая сумма. Найдите минимальное количество монет, необходимое для набора этой суммы. Если размен невозможен, верните -1.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const coins = lines[0].split(' ').map(Number);
const amount = Number(lines[1]);

function coinChange(coins, amount) {
  // ваш код
}

console.log(coinChange(coins, amount));
```

# Тесты

```json
[
  {"stdin": "1 5 10\n11", "expected": "2"},
  {"stdin": "2\n3", "expected": "-1"},
  {"stdin": "1\n0", "expected": "0"},
  {"stdin": "1 2 5\n11", "expected": "3"}
]
```