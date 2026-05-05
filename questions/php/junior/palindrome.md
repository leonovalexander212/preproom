---
id: php-palindrome
title: Палиндром
difficulty: easy
language: php
---

# Описание

На вход — одна строка. Выведи "true" если палиндром (без учёта регистра, сравниваем как есть), иначе "false".

# Стартовый код

```php
<?php
$s = rtrim(file_get_contents("php://stdin"), "\n");

function isPalindrome(string $s): bool {
    // твой код
    return false;
}

echo isPalindrome($s) ? 'true' : 'false';
```

# Тесты

```json
[
  {"stdin": "level", "expected": "true"},
  {"stdin": "PHP", "expected": "false"},
  {"stdin": "AbBa", "expected": "true"},
  {"stdin": "x", "expected": "true"}
]
```