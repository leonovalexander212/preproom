---
id: js-flatten
title: Flatten вложенного массива
difficulty: medium
language: javascript
---

# Описание

На вход — JSON-строка с массивом произвольной вложенности. Выведи JSON одномерного массива (порядок сохранить). Нельзя `Array.prototype.flat()`.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const arr = JSON.parse(input);

function flatten(a) {
  // твой код
  return a;
}

console.log(JSON.stringify(flatten(arr)));
```

# Тесты

```json
[
  {"stdin": "[1,[2,[3,[4]]],5]", "expected": "[1,2,3,4,5]"},
  {"stdin": "[]", "expected": "[]"},
  {"stdin": "[[1,2],[3,4]]", "expected": "[1,2,3,4]"},
  {"stdin": "[1,2,3]", "expected": "[1,2,3]"}
]
```