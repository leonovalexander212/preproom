---
id: php-mid-max-subarray
title: Максимальный подмассив
difficulty: medium
language: php
---

# Описание

Дан массив целых чисел. Найдите непрерывный подмассив с максимальной суммой и выведите эту сумму. Используйте алгоритм Кадане.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$arr = array_map('intval', explode(' ', trim($input)));

function maxSubarray($arr) {
    // ваш код
}

echo maxSubarray($arr);
```

# Тесты

```json
[
  {"stdin": "-2 1 -3 4 -1 2 1 -5 4", "expected": "6"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "-1 -2 -3", "expected": "-1"},
  {"stdin": "5 -3 5", "expected": "7"}
]
```
