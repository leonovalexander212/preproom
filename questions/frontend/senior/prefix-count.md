---
id: js-sr-prefix-count
title: Поиск по префиксу
difficulty: hard
language: javascript
---

# Описание

Дан список слов и набор запросов-префиксов. Для каждого префикса подсчитайте, сколько слов из списка начинаются с этого префикса.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const n = Number(lines[0]);
const words = lines.slice(1, n + 1);
const q = Number(lines[n + 1]);
const prefixes = lines.slice(n + 2, n + 2 + q);

function prefixCount(words, prefixes) {
  // ваш код
}

const results = prefixCount(words, prefixes);
console.log(results.join('\n'));
```

# Тесты

```json
[
  {"stdin": "5\napple\napp\napricot\nbanana\nband\n3\nap\nban\nz", "expected": "3\n2\n0"},
  {"stdin": "2\nhello\nhelp\n1\nhel", "expected": "2"}
]
```