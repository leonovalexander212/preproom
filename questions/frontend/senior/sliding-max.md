---
id: js-sr-sliding-max
title: Максимум в скользящем окне
difficulty: hard
language: javascript
---

# Описание

Дан массив целых чисел и размер окна K. Найдите максимум в каждом скользящем окне размера K и выведите результаты через пробел.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const arr = lines[0].split(' ').map(Number);
const k = Number(lines[1]);

function slidingMax(arr, k) {
  // ваш код
}

console.log(slidingMax(arr, k).join(' '));
```

# Тесты

```json
[
  {"stdin": "1 3 -1 -3 5 3 6 7\n3", "expected": "3 3 5 5 6 7"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "1 -1\n1", "expected": "1 -1"},
  {"stdin": "9 8 7 6 5\n2", "expected": "9 8 7 6"}
]
```