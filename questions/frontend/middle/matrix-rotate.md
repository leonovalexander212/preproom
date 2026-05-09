---
id: js-mid-matrix-rotate
title: Поворот матрицы
difficulty: medium
language: javascript
---

# Описание

Дана квадратная матрица NxN. Поверните её на 90 градусов по часовой стрелке и выведите результат.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const matrix = lines.map(line => line.split(' ').map(Number));

function rotate(matrix) {
  // ваш код
}

const result = rotate(matrix);
console.log(result.map(row => row.join(' ')).join('\n'));
```

# Тесты

```json
[
  {"stdin": "1 2\n3 4", "expected": "3 1\n4 2"},
  {"stdin": "1 2 3\n4 5 6\n7 8 9", "expected": "7 4 1\n8 5 2\n9 6 3"},
  {"stdin": "1", "expected": "1"}
]
```