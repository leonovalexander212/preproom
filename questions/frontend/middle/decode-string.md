---
id: js-mid-decode-string
title: Декодирование строки
difficulty: medium
language: javascript
---

# Описание

Дана закодированная строка вида "3[ab]2[c]". Число перед квадратными скобками означает количество повторений содержимого. Поддерживается вложенность. Декодируйте строку и выведите результат.

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();

function decodeString(s) {
  // ваш код
}

console.log(decodeString(data));
```

# Тесты

```json
[
  {"stdin": "3[a]2[bc]", "expected": "aaabcbc"},
  {"stdin": "3[a2[c]]", "expected": "accaccacc"},
  {"stdin": "abc", "expected": "abc"},
  {"stdin": "2[abc]3[cd]ef", "expected": "abcabccdcdcdef"}
]
```