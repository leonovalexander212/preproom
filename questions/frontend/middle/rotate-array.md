---
id: js-mid-rotate-array
title: Ротация массива
difficulty: medium
language: javascript
---

# Описание

Дан массив целых чисел и число K. Выполните циклический сдвиг массива вправо на K позиций и выведите результат.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const arr = lines[0].split(' ').map(Number);
const k = Number(lines[1]);

function rotateArray(arr, k) {
  // ваш код
}

console.log(rotateArray(arr, k).join(' '));
```

# Тесты

```json
[
  {"stdin": "1 2 3 4 5\n2", "expected": "4 5 1 2 3"},
  {"stdin": "1 2 3\n1", "expected": "3 1 2"},
  {"stdin": "1\n5", "expected": "1"},
  {"stdin": "1 2 3 4\n4", "expected": "1 2 3 4"}
]
```