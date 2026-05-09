---
id: php-sr-sliding-max
title: Максимум в скользящем окне
difficulty: hard
language: php
---

# Описание

Дан массив целых чисел и размер окна K. Для каждого положения скользящего окна размером K найдите максимальный элемент. Выведите все максимумы через пробел.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$arr = array_map('intval', explode(' ', trim($lines[0])));
$k = intval(trim($lines[1]));

function slidingMax($arr, $k) {
    // ваш код
}

echo implode(' ', slidingMax($arr, $k));
```

# Тесты

```json
[
  {"stdin": "1 3 -1 -3 5 3 6 7\n3", "expected": "3 3 5 5 6 7"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "1 -1\n1", "expected": "1 -1"},
  {"stdin": "9 8 7 6 5\n2", "expected": "9 8 7 6"}
]
```
