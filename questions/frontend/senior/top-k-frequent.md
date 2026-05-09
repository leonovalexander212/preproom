---
id: js-sr-top-k-frequent
title: Top-K частых элементов
difficulty: hard
language: javascript
---

# Описание

Дан массив целых чисел и число K. Найдите K наиболее часто встречающихся элементов. Выведите их в порядке убывания частоты; при одинаковой частоте меньший элемент идёт первым.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const arr = lines[0].split(' ').map(Number);
const k = Number(lines[1]);

function topKFrequent(arr, k) {
  // ваш код
}

console.log(topKFrequent(arr, k).join(' '));
```

# Тесты

```json
[
  {"stdin": "1 1 1 2 2 3\n2", "expected": "1 2"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "4 4 4 1 1 2 2 2\n2", "expected": "4 2"}
]
```