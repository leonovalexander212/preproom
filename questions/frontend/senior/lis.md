---
id: js-sr-lis
title: Наибольшая возрастающая подпоследовательность
difficulty: hard
language: javascript
---

# Описание

Дан массив целых чисел. Найдите длину наибольшей строго возрастающей подпоследовательности.

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();
const arr = data.split(' ').map(Number);

function lis(arr) {
  // ваш код
}

console.log(lis(arr));
```

# Тесты

```json
[
  {"stdin": "10 9 2 5 3 7 101 18", "expected": "4"},
  {"stdin": "0 1 0 3 2 3", "expected": "4"},
  {"stdin": "7 7 7 7", "expected": "1"},
  {"stdin": "1 2 3 4 5", "expected": "5"}
]
```