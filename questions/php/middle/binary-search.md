---
id: php-mid-binary-search
title: Бинарный поиск
difficulty: medium
language: php
---

# Описание

Дан отсортированный массив целых чисел и целевое значение. Найдите индекс целевого значения в массиве, используя бинарный поиск. Если элемент не найден, верните -1.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$arr = array_map('intval', explode(' ', trim($lines[0])));
$target = intval(trim($lines[1]));

function binarySearch($arr, $target) {
    // ваш код
}

echo binarySearch($arr, $target);
```

# Тесты

```json
[
  {"stdin": "1 3 5 7 9\n5", "expected": "2"},
  {"stdin": "1 3 5 7 9\n6", "expected": "-1"},
  {"stdin": "10\n10", "expected": "0"},
  {"stdin": "1 2 3 4 5 6 7 8 9 10\n1", "expected": "0"}
]
```
