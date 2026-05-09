---
id: php-sr-shortest-path
title: Кратчайший путь в графе
difficulty: hard
language: php
---

# Описание

Дан невзвешенный неориентированный граф. Найдите кратчайшее расстояние (количество рёбер) между двумя вершинами с помощью BFS. Если путь не существует, выведите -1.

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
    $edges[] = array_map('intval', explode(' ', trim($lines[$i])));
}
$query = explode(' ', trim($lines[$M + 1]));
$start = intval($query[0]);
$end = intval($query[1]);

function shortestPath($N, $edges, $start, $end) {
    // ваш код
}

echo shortestPath($N, $edges, $start, $end);
```

# Тесты

```json
[
  {"stdin": "4 4\n1 2\n2 3\n3 4\n1 3\n1 4", "expected": "2"},
  {"stdin": "3 1\n1 2\n1 3", "expected": "-1"},
  {"stdin": "2 1\n1 2\n1 2", "expected": "1"}
]
```
