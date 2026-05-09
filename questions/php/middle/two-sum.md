---
id: php-mid-two-sum
title: Два слагаемых
difficulty: medium
language: php
---

# Описание

Дан массив целых чисел и целевое значение. Найдите два элемента, сумма которых равна целевому значению, и верните их индексы (0-based), меньший индекс первым.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$arr = array_map('intval', explode(' ', trim($lines[0])));
$target = intval(trim($lines[1]));

function twoSum($arr, $target) {
    // ваш код
}

echo twoSum($arr, $target);
```

# Тесты

```json
[
  {"stdin": "2 7 11 15\n9", "expected": "0 1"},
  {"stdin": "3 2 4\n6", "expected": "1 2"},
  {"stdin": "1 5 3 7\n8", "expected": "1 3"}
]
```
