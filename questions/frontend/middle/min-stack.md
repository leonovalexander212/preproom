---
id: js-mid-min-stack
title: Стек с минимумом
difficulty: medium
language: javascript
---

# Описание

Реализуйте стек, поддерживающий операции push, pop и получение текущего минимума за O(1). Для каждой операции "min" выведите текущий минимальный элемент стека.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const n = Number(lines[0]);

function processOperations(ops) {
  // ваш код
}

const ops = lines.slice(1, n + 1);
const results = processOperations(ops);
console.log(results.join('\n'));
```

# Тесты

```json
[
  {"stdin": "5\npush 3\npush 5\nmin\npush 1\nmin", "expected": "3\n1"},
  {"stdin": "3\npush 10\npush 20\nmin", "expected": "10"},
  {"stdin": "6\npush 2\npush 1\nmin\npop\nmin\npop", "expected": "1\n2"}
]
```