---
id: php-sr-lru-cache
title: LRU-кэш
difficulty: hard
language: php
---

# Описание

Реализуйте LRU-кэш (Least Recently Used) заданной ёмкости. Поддерживаются операции "put K V" (добавить/обновить) и "get K" (получить значение). При get выведите значение или -1, если ключ отсутствует. При переполнении удаляется наименее недавно использованный элемент.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$capacity = intval(trim($lines[0]));
$n = intval(trim($lines[1]));

function processLRU($capacity, $operations) {
    // ваш код
}

$ops = [];
for ($i = 2; $i < 2 + $n; $i++) {
    $ops[] = trim($lines[$i]);
}

$results = processLRU($capacity, $ops);
echo implode("\n", $results);
```

# Тесты

```json
[
  {"stdin": "2\n5\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2", "expected": "1\n-1"},
  {"stdin": "1\n4\nput 1 10\nget 1\nput 2 20\nget 1", "expected": "10\n-1"}
]
```
