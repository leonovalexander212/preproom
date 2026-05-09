---
id: php-sr-merge-intervals
title: Слияние интервалов
difficulty: hard
language: php
---

# Описание

Дан набор интервалов. Объедините все перекрывающиеся интервалы и выведите результат в отсортированном порядке. Каждый интервал на отдельной строке.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$n = intval(trim($lines[0]));
$intervals = [];
for ($i = 1; $i <= $n; $i++) {
    $parts = explode(' ', trim($lines[$i]));
    $intervals[] = [intval($parts[0]), intval($parts[1])];
}

function mergeIntervals($intervals) {
    // ваш код
}

$result = mergeIntervals($intervals);
$output = [];
foreach ($result as $interval) {
    $output[] = $interval[0] . ' ' . $interval[1];
}
echo implode("\n", $output);
```

# Тесты

```json
[
  {"stdin": "3\n1 3\n2 6\n8 10", "expected": "1 6\n8 10"},
  {"stdin": "2\n1 4\n4 5", "expected": "1 5"},
  {"stdin": "1\n1 1", "expected": "1 1"},
  {"stdin": "3\n1 4\n0 4\n3 5", "expected": "0 5"}
]
```
