---
id: js-sr-expression-eval
title: Вычисление выражения
difficulty: hard
language: javascript
---

# Описание

Дано арифметическое выражение, содержащее целые числа, операторы +, -, *, / и скобки. Вычислите результат. Целочисленное деление округляется к нулю.

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();

function evaluate(expression) {
  // ваш код
}

console.log(evaluate(data));
```

# Тесты

```json
[
  {"stdin": "3+2*2", "expected": "7"},
  {"stdin": "(1+(4+5+2)-3)+(6+8)", "expected": "23"},
  {"stdin": "2*(5+5*2)/3+(6/2+8)", "expected": "21"},
  {"stdin": "1+1", "expected": "2"}
]
```