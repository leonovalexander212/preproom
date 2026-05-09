---
id: js-sr-tree-serialize
title: Сериализация дерева
difficulty: hard
language: javascript
---

# Описание

Дано бинарное дерево в формате level-order (с "null" для отсутствующих узлов). Постройте дерево и выполните inorder-обход. Выведите значения узлов через пробел.

# Стартовый код

```javascript
const data = require('fs').readFileSync(0, 'utf8').trim();
const values = data.split(' ');

function inorderTraversal(values) {
  // ваш код
}

console.log(inorderTraversal(values).join(' '));
```

# Тесты

```json
[
  {"stdin": "1 2 3 null null 4 5", "expected": "2 1 4 3 5"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "1 null 2 null 3", "expected": "1 2 3"}
]
```