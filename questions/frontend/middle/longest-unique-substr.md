---
id: js-mid-longest-unique-substr
title: Подстрока без повторов
difficulty: medium
language: javascript
---

# Описание

Дана строка. Найдите длину самой длинной подстроки, не содержащей повторяющихся символов.

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();

function lengthOfLongestSubstring(s) {
  // ваш код
}

console.log(lengthOfLongestSubstring(data));
```

# Тесты

```json
[
  {"stdin": "abcabcbb", "expected": "3"},
  {"stdin": "bbbbb", "expected": "1"},
  {"stdin": "pwwkew", "expected": "3"},
  {"stdin": "a", "expected": "1"},
  {"stdin": "abcdef", "expected": "6"}
]
```