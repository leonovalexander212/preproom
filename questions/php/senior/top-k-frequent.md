---
id: php-sr-top-k-frequent
title: Top-K частых элементов
difficulty: hard
language: php
---

# Описание

Дан массив целых чисел и число K. Найдите K самых часто встречающихся элементов. Выведите их в порядке убывания частоты. При одинаковой частоте меньший элемент идёт первым.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$arr = array_map('intval', explode(' ', trim($lines[0])));
$k = intval(trim($lines[1]));

function topKFrequent($arr, $k) {
    // ваш код
}

echo implode(' ', topKFrequent($arr, $k));
```

# Тесты

```json
[
  {"stdin": "1 1 1 2 2 3\n2", "expected": "1 2"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "4 4 4 1 1 2 2 2\n2", "expected": "4 2"}
]
```
