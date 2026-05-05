---
id: php-sum-array
title: Сумма массива
difficulty: easy
language: php
---

# Описание

На первой строке — N. На второй — N чисел через пробел. Выведи их сумму.

# Стартовый код

```php
<?php
$lines = explode("\n", trim(file_get_contents("php://stdin")));
$n = (int)$lines[0];
$nums = array_map('intval', explode(' ', $lines[1] ?? ''));

function sumArr(array $a): int {
    // твой код
    return 0;
}

echo sumArr($nums);
```

# Тесты

```json
[
  {"stdin": "3\n1 2 3", "expected": "6"},
  {"stdin": "1\n42", "expected": "42"},
  {"stdin": "4\n10 20 30 40", "expected": "100"},
  {"stdin": "5\n-1 -2 -3 -4 -5", "expected": "-15"}
]
```