---
id: php-sr-lcs
title: Наибольшая общая подпоследовательность
difficulty: hard
language: php
---

# Описание

Даны две строки. Найдите длину их наибольшей общей подпоследовательности (LCS). Подпоследовательность не обязана быть непрерывной.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$a = trim($lines[0]);
$b = trim($lines[1]);

function lcs($a, $b) {
    // ваш код
}

echo lcs($a, $b);
```

# Тесты

```json
[
  {"stdin": "abcde\nace", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "3"},
  {"stdin": "abc\ndef", "expected": "0"},
  {"stdin": "abcd\naecbd", "expected": "3"}
]
```
