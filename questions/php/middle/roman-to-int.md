---
id: php-mid-roman-to-int
title: Римские числа
difficulty: medium
language: php
---

# Описание

Дана строка с римским числом. Преобразуйте его в целое число. Поддерживаются символы I, V, X, L, C, D, M и субтрактивные формы (IV, IX, XL, XC, CD, CM).

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");

function romanToInt($s) {
    // ваш код
}

echo romanToInt($input);
```

# Тесты

```json
[
  {"stdin": "III", "expected": "3"},
  {"stdin": "IV", "expected": "4"},
  {"stdin": "IX", "expected": "9"},
  {"stdin": "XLII", "expected": "42"},
  {"stdin": "MCMXCIV", "expected": "1994"}
]
```
