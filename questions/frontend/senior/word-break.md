---
id: js-sr-word-break
title: Разбиение строки
difficulty: hard
language: javascript
---

# Описание

Дана строка и словарь слов. Определите, можно ли разбить строку на последовательность слов из словаря. Каждое слово может использоваться многократно.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const s = lines[0];
const dict = lines[1].split(' ');

function wordBreak(s, dict) {
  // ваш код
}

console.log(wordBreak(s, dict));
```

# Тесты

```json
[
  {"stdin": "leetcode\nleet code", "expected": "true"},
  {"stdin": "applepenapple\napple pen", "expected": "true"},
  {"stdin": "catsandog\ncats dog sand and cat", "expected": "false"}
]
```