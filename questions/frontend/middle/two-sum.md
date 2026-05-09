---
id: js-mid-two-sum
title: Два слагаемых
difficulty: medium
language: javascript
---

# Описание

Дан массив целых чисел и целевое значение. Найдите два элемента, сумма которых равна целевому значению, и верните их индексы через пробел (меньший индекс первым).

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const arr = lines[0].split(' ').map(Number);
const target = Number(lines[1]);

function twoSum(arr, target) {
  // ваш код
}

console.log(twoSum(arr, target));
```

# Тесты

```json
[
  {"stdin": "2 7 11 15\n9", "expected": "0 1"},
  {"stdin": "3 2 4\n6", "expected": "1 2"},
  {"stdin": "1 5 3 7\n8", "expected": "1 3"}
]
```