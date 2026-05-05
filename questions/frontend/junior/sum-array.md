---
id: js-sum-array
title: Сумма массива
difficulty: easy
language: javascript
---

# Описание

На первой строке — N. На второй — N чисел через пробел. Выведи их сумму. Без библиотек.

# Стартовый код

```javascript
const lines = require('fs').readFileSync(0, 'utf8').trim().split('\n');
const n = parseInt(lines[0], 10);
const nums = (lines[1] || '').split(' ').map(Number);

function sum(arr) {
  // твой код
  return 0;
}

console.log(sum(nums));
```

# Тесты

```json
[
  {"stdin": "3\n1 2 3", "expected": "6"},
  {"stdin": "1\n42", "expected": "42"},
  {"stdin": "4\n10 20 30 40", "expected": "100"},
  {"stdin": "5\n-1 -2 -3 -4 -5", "expected": "-15"}
]
```