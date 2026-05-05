---
id: js-unique-chars
title: Все ли символы строки уникальны?
difficulty: medium
language: javascript
---

# Описание

На вход — одна строка. Выведи "true" если все символы уникальны (учитывай регистр), иначе "false".

# Стартовый код

```javascript
const s = require('fs').readFileSync(0, 'utf8').replace(/\n$/, '');

function allUnique(s) {
  // твой код
  return false;
}

console.log(allUnique(s) ? 'true' : 'false');
```

# Тесты

```json
[
  {"stdin": "abcdef", "expected": "true"},
  {"stdin": "hello", "expected": "false"},
  {"stdin": "aA", "expected": "true"},
  {"stdin": "", "expected": "true"},
  {"stdin": "12321", "expected": "false"}
]
```