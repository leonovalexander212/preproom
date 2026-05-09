---
id: js-sr-edit-distance
title: Расстояние редактирования
difficulty: hard
language: javascript
---

# Описание

Даны две строки. Найдите минимальное количество операций (вставка, удаление, замена символа) для преобразования первой строки во вторую (расстояние Левенштейна).

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const s1 = lines[0] || '';
const s2 = lines[1] || '';

function editDistance(s1, s2) {
  // ваш код
}

console.log(editDistance(s1, s2));
```

# Тесты

```json
[
  {"stdin": "kitten\nsitting", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "0"},
  {"stdin": "\nabc", "expected": "3"},
  {"stdin": "horse\nros", "expected": "3"}
]
```