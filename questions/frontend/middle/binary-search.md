---
id: js-mid-binary-search
title: Бинарный поиск
difficulty: medium
language: javascript
---

# Описание

Дан отсортированный массив целых чисел и целевое значение. Найдите индекс целевого значения в массиве, используя бинарный поиск. Если элемент не найден, верните -1.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const arr = lines[0].split(' ').map(Number);
const target = Number(lines[1]);

function binarySearch(arr, target) {
  // ваш код
}

console.log(binarySearch(arr, target));
```

# Тесты

```json
[
  {"stdin": "1 3 5 7 9\n5", "expected": "2"},
  {"stdin": "1 3 5 7 9\n6", "expected": "-1"},
  {"stdin": "10\n10", "expected": "0"},
  {"stdin": "1 2 3 4 5 6 7 8 9 10\n1", "expected": "0"}
]
```