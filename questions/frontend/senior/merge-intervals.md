---
id: js-sr-merge-intervals
title: Слияние интервалов
difficulty: hard
language: javascript
---

# Описание

Дан набор интервалов. Объедините все пересекающиеся интервалы и выведите результат в отсортированном порядке, по одному интервалу на строку.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const n = Number(lines[0]);
const intervals = [];
for (let i = 1; i <= n; i++) {
  intervals.push(lines[i].split(' ').map(Number));
}

function mergeIntervals(intervals) {
  // ваш код
}

const result = mergeIntervals(intervals);
console.log(result.map(iv => iv.join(' ')).join('\n'));
```

# Тесты

```json
[
  {"stdin": "3\n1 3\n2 6\n8 10", "expected": "1 6\n8 10"},
  {"stdin": "2\n1 4\n4 5", "expected": "1 5"},
  {"stdin": "1\n1 1", "expected": "1 1"},
  {"stdin": "3\n1 4\n0 4\n3 5", "expected": "0 5"}
]
```