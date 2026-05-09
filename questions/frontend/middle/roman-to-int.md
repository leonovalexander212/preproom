---
id: js-mid-roman-to-int
title: Римские числа
difficulty: medium
language: javascript
---

# Описание

Дана строка с римским числом. Преобразуйте его в целое число. Поддерживаемые символы: I, V, X, L, C, D, M.

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();

function romanToInt(s) {
  // ваш код
}

console.log(romanToInt(data));
```

# Тесты

```json
[
  {"stdin": "III", "expected": "3"},
  {"stdin": "IV", "expected": "4"},
  {"stdin": "IX", "expected": "9"},
  {"stdin": "XLII", "expected": "42"},
  {"stdin": "MCMXCIV", "expected": "1994"}
]
```