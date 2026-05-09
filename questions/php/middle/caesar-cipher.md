---
id: php-mid-caesar-cipher
title: Шифр Цезаря
difficulty: medium
language: php
---

# Описание

Реализуйте шифр Цезаря. Сдвигайте только латинские буквы (a-z, A-Z) на заданное число позиций, остальные символы оставляйте без изменений.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$text = $lines[0];
$shift = intval(trim($lines[1]));

function caesarCipher($text, $shift) {
    // ваш код
}

echo caesarCipher($text, $shift);
```

# Тесты

```json
[
  {"stdin": "Hello World\n3", "expected": "Khoor Zruog"},
  {"stdin": "xyz\n3", "expected": "abc"},
  {"stdin": "ABC\n1", "expected": "BCD"},
  {"stdin": "Test 123!\n0", "expected": "Test 123!"}
]
```
