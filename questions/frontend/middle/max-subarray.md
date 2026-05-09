---
id: js-mid-max-subarray
title: Максимальный подмассив
difficulty: medium
language: javascript
---

# Описание

Дан массив целых чисел. Найдите непрерывный подмассив с максимальной суммой и выведите эту сумму (алгоритм Кадане).

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();
const arr = data.split(' ').map(Number);

function maxSubarray(arr) {
  // ваш код
}

console.log(maxSubarray(arr));
```

# Тесты

```json
[
  {"stdin": "-2 1 -3 4 -1 2 1 -5 4", "expected": "6"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "-1 -2 -3", "expected": "-1"},
  {"stdin": "5 -3 5", "expected": "7"}
]
```