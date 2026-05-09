---
id: js-mid-run-length
title: RLE-кодирование
difficulty: medium
language: javascript
---

# Описание

Реализуйте RLE-кодирование строки. Каждый символ заменяется на символ и количество его последовательных повторений. Например, "aaabbc" превращается в "a3b2c1".

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();

function runLengthEncode(s) {
  // ваш код
}

console.log(runLengthEncode(data));
```

# Тесты

```json
[
  {"stdin": "aaabbc", "expected": "a3b2c1"},
  {"stdin": "a", "expected": "a1"},
  {"stdin": "aaa", "expected": "a3"},
  {"stdin": "abcd", "expected": "a1b1c1d1"},
  {"stdin": "aabbbcccc", "expected": "a2b3c4"}
]
```