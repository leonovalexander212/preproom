---
id: php-mid-rotate-array
title: Ротация массива
difficulty: medium
language: php
---

# Описание

Дан массив целых чисел и число K. Выполните циклический сдвиг массива вправо на K позиций и выведите результат.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$arr = array_map('intval', explode(' ', trim($lines[0])));
$k = intval(trim($lines[1]));

function rotateArray($arr, $k) {
    // ваш код
}

echo implode(' ', rotateArray($arr, $k));
```

# Тесты

```json
[
  {"stdin": "1 2 3 4 5\n2", "expected": "4 5 1 2 3"},
  {"stdin": "1 2 3\n1", "expected": "3 1 2"},
  {"stdin": "1\n5", "expected": "1"},
  {"stdin": "1 2 3 4\n4", "expected": "1 2 3 4"}
]
```
