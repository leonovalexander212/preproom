---
id: php-sr-topo-sort
title: Топологическая сортировка
difficulty: hard
language: php
---

# Описание

Дан ориентированный граф. Выполните топологическую сортировку алгоритмом Кана с использованием min-кучи (при нескольких вершинах с нулевой входящей степенью выбирается вершина с наименьшим номером). Если граф содержит цикл, выведите "CYCLE".

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$firstLine = explode(' ', trim($lines[0]));
$N = intval($firstLine[0]);
$M = intval($firstLine[1]);
$edges = [];
for ($i = 1; $i <= $M; $i++) {
    $parts = explode(' ', trim($lines[$i]));
    $edges[] = [intval($parts[0]), intval($parts[1])];
}

function topoSort($N, $edges) {
    // ваш код
}

echo topoSort($N, $edges);
```

# Тесты

```json
[
  {"stdin": "4 3\n1 2\n1 3\n3 4", "expected": "1 2 3 4"},
  {"stdin": "3 2\n3 1\n3 2", "expected": "3 1 2"},
  {"stdin": "2 2\n1 2\n2 1", "expected": "CYCLE"}
]
```
