---
id: php-mid-merge-sorted
title: Слияние отсортированных массивов
difficulty: medium
language: php
---

# Описание

Даны два отсортированных массива целых чисел. Объедините их в один отсортированный массив и выведите результат через пробел.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$a = trim($lines[0]) !== '' ? array_map('intval', explode(' ', trim($lines[0]))) : [];
$b = isset($lines[1]) && trim($lines[1]) !== '' ? array_map('intval', explode(' ', trim($lines[1]))) : [];

function mergeSorted($a, $b) {
    // ваш код
}

echo implode(' ', mergeSorted($a, $b));
```

# Тесты

```json
[
  {"stdin": "1 3 5\n2 4 6", "expected": "1 2 3 4 5 6"},
  {"stdin": "1\n2", "expected": "1 2"},
  {"stdin": "1 2 3\n", "expected": "1 2 3"},
  {"stdin": "\n4 5 6", "expected": "4 5 6"}
]
```
