---
id: php-sr-lis
title: Наибольшая возрастающая подпоследовательность
difficulty: hard
language: php
---

# Описание

Дан массив целых чисел. Найдите длину наибольшей строго возрастающей подпоследовательности (LIS).

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$arr = array_map('intval', explode(' ', trim($input)));

function lis($arr) {
    // ваш код
}

echo lis($arr);
```

# Тесты

```json
[
  {"stdin": "10 9 2 5 3 7 101 18", "expected": "4"},
  {"stdin": "0 1 0 3 2 3", "expected": "4"},
  {"stdin": "7 7 7 7", "expected": "1"},
  {"stdin": "1 2 3 4 5", "expected": "5"}
]
```
