---
id: js-sr-lcs
title: Наибольшая общая подпоследовательность
difficulty: hard
language: javascript
---

# Описание

Даны две строки. Найдите длину их наибольшей общей подпоследовательности (LCS). Подпоследовательность не обязана быть непрерывной.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const s1 = lines[0];
const s2 = lines[1];

function lcs(s1, s2) {
  // ваш код
}

console.log(lcs(s1, s2));
```

# Тесты

```json
[
  {"stdin": "abcde\nace", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "3"},
  {"stdin": "abc\ndef", "expected": "0"},
  {"stdin": "abcd\naecbd", "expected": "3"}
]
```