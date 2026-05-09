---
id: php-sr-tree-serialize
title: Сериализация дерева
difficulty: hard
language: php
---

# Описание

Дано бинарное дерево в формате level-order (с "null" для отсутствующих узлов). Постройте дерево и выведите его inorder-обход (левое поддерево, корень, правое поддерево) через пробел.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$tokens = explode(' ', trim($input));

function treeInorder($tokens) {
    // ваш код
}

echo implode(' ', treeInorder($tokens));
```

# Тесты

```json
[
  {"stdin": "1 2 3 null null 4 5", "expected": "2 1 4 3 5"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "1 null 2 null 3", "expected": "1 2 3"}
]
```
