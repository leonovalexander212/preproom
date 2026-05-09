---
id: js-mid-spiral-matrix
title: Спиральный обход матрицы
difficulty: medium
language: javascript
---

# Описание

Дана матрица размером R x C. Выведите все элементы матрицы в порядке спирального обхода (по часовой стрелке, начиная с левого верхнего угла).

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const [R, C] = lines[0].split(' ').map(Number);
const matrix = [];
for (let i = 1; i <= R; i++) {
  matrix.push(lines[i].split(' ').map(Number));
}

function spiralOrder(matrix) {
  // ваш код
}

console.log(spiralOrder(matrix).join(' '));
```

# Тесты

```json
[
  {"stdin": "2 3\n1 2 3\n4 5 6", "expected": "1 2 3 6 5 4"},
  {"stdin": "3 3\n1 2 3\n4 5 6\n7 8 9", "expected": "1 2 3 6 9 8 7 4 5"},
  {"stdin": "1 1\n42", "expected": "42"}
]
```