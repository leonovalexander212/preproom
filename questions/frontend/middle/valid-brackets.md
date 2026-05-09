---
id: js-mid-valid-brackets
title: Валидные скобки
difficulty: medium
language: javascript
---

# Описание

Дана строка, содержащая символы '(', ')', '{', '}', '[', ']'. Определите, является ли скобочная последовательность валидной. Пустая строка считается валидной.

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();

function isValid(s) {
  // ваш код
}

console.log(isValid(data));
```

# Тесты

```json
[
  {"stdin": "()", "expected": "true"},
  {"stdin": "()[]{}", "expected": "true"},
  {"stdin": "(]", "expected": "false"},
  {"stdin": "([)]", "expected": "false"},
  {"stdin": "{[]}", "expected": "true"},
  {"stdin": "", "expected": "true"}
]
```