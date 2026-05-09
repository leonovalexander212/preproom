---
id: php-mid-matrix-rotate
title: Поворот матрицы
difficulty: medium
language: php
---

# Описание

Дана квадратная матрица NxN. Поверните её на 90 градусов по часовой стрелке и выведите результат.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$matrix = [];
foreach ($lines as $line) {
    $matrix[] = array_map('intval', explode(' ', trim($line)));
}

function rotateMatrix($matrix) {
    // ваш код
}

$result = rotateMatrix($matrix);
$output = [];
foreach ($result as $row) {
    $output[] = implode(' ', $row);
}
echo implode("\n", $output);
```

# Тесты

```json
[
  {"stdin": "1 2\n3 4", "expected": "3 1\n4 2"},
  {"stdin": "1 2 3\n4 5 6\n7 8 9", "expected": "7 4 1\n8 5 2\n9 6 3"},
  {"stdin": "1", "expected": "1"}
]
```
