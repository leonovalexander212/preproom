---
id: js-sr-lru-cache
title: LRU-кэш
difficulty: hard
language: javascript
---

# Описание

Реализуйте LRU-кэш заданной ёмкости. Операция "get K" возвращает значение по ключу или -1, если ключ отсутствует. Операция "put K V" добавляет или обновляет пару ключ-значение, вытесняя наименее недавно использованный элемент при переполнении.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const capacity = Number(lines[0]);
const n = Number(lines[1]);

function lruCache(capacity, ops) {
  // ваш код
}

const ops = lines.slice(2, 2 + n);
const results = lruCache(capacity, ops);
console.log(results.join('\n'));
```

# Тесты

```json
[
  {"stdin": "2\n5\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2", "expected": "1\n-1"},
  {"stdin": "1\n4\nput 1 10\nget 1\nput 2 20\nget 1", "expected": "10\n-1"}
]
```