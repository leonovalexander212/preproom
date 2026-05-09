---
id: php-sr-knapsack
title: Задача о рюкзаке
difficulty: hard
language: php
---

# Описание

Решите задачу о рюкзаке 0/1. Дано N предметов с весом и стоимостью, и рюкзак грузоподъёмностью W. Найдите максимальную суммарную стоимость предметов, которые можно поместить в рюкзак. Каждый предмет можно взять не более одного раза.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$firstLine = explode(' ', trim($lines[0]));
$N = intval($firstLine[0]);
$W = intval($firstLine[1]);
$items = [];
for ($i = 1; $i <= $N; $i++) {
    $parts = explode(' ', trim($lines[$i]));
    $items[] = [intval($parts[0]), intval($parts[1])];
}

function knapsack($N, $W, $items) {
    // ваш код
}

echo knapsack($N, $W, $items);
```

# Тесты

```json
[
  {"stdin": "3 50\n10 60\n20 100\n30 120", "expected": "220"},
  {"stdin": "1 5\n10 100", "expected": "0"},
  {"stdin": "2 10\n5 50\n5 60", "expected": "110"}
]
```
