---
id: php-mid-spiral-matrix
title: Спиральный обход матрицы
difficulty: medium
language: php
---

# Описание

Дана матрица размером R x C. Выведите все элементы матрицы в порядке спирального обхода (по часовой стрелке, начиная с левого верхнего угла) через пробел.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$dims = explode(' ', trim($lines[0]));
$R = intval($dims[0]);
$C = intval($dims[1]);
$matrix = [];
for ($i = 1; $i <= $R; $i++) {
    $matrix[] = array_map('intval', explode(' ', trim($lines[$i])));
}

function spiralOrder($matrix) {
    // ваш код
}

echo implode(' ', spiralOrder($matrix));
```

# Тесты

```json
[
  {"stdin": "2 3\n1 2 3\n4 5 6", "expected": "1 2 3 6 5 4"},
  {"stdin": "3 3\n1 2 3\n4 5 6\n7 8 9", "expected": "1 2 3 6 9 8 7 4 5"},
  {"stdin": "1 1\n42", "expected": "42"}
]
```
