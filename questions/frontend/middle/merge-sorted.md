---
id: js-mid-merge-sorted
title: Слияние отсортированных массивов
difficulty: medium
language: javascript
---

# Описание

Даны два отсортированных массива целых чисел. Объедините их в один отсортированный массив и выведите элементы через пробел.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const arr1 = lines[0] ? lines[0].split(' ').map(Number) : [];
const arr2 = lines[1] ? lines[1].split(' ').map(Number) : [];

function mergeSorted(arr1, arr2) {
  // ваш код
}

console.log(mergeSorted(arr1, arr2));
```

# Тесты

```json
[
  {"stdin": "1 3 5\n2 4 6", "expected": "1 2 3 4 5 6"},
  {"stdin": "1\n2", "expected": "1 2"},
  {"stdin": "1 2 3\n", "expected": "1 2 3"},
  {"stdin": "\n4 5 6", "expected": "4 5 6"}
]
```