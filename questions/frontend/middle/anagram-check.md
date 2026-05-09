---
id: js-mid-anagram-check
title: Проверка анаграмм
difficulty: medium
language: javascript
---

# Описание

Даны две строки. Определите, являются ли они анаграммами друг друга (без учёта регистра). Выведите "true" или "false".

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const s1 = lines[0];
const s2 = lines[1];

function isAnagram(s1, s2) {
  // ваш код
}

console.log(isAnagram(s1, s2));
```

# Тесты

```json
[
  {"stdin": "listen\nsilent", "expected": "true"},
  {"stdin": "Hello\nWorld", "expected": "false"},
  {"stdin": "abc\ncba", "expected": "true"},
  {"stdin": "a\na", "expected": "true"}
]
```