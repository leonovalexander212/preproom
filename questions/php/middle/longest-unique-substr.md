---
id: php-mid-longest-unique-substr
title: Подстрока без повторов
difficulty: medium
language: php
---

# Описание

Дана строка. Найдите длину самой длинной подстроки, которая не содержит повторяющихся символов.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");

function lengthOfLongestSubstring($s) {
    // ваш код
}

echo lengthOfLongestSubstring($input);
```

# Тесты

```json
[
  {"stdin": "abcabcbb", "expected": "3"},
  {"stdin": "bbbbb", "expected": "1"},
  {"stdin": "pwwkew", "expected": "3"},
  {"stdin": "a", "expected": "1"},
  {"stdin": "abcdef", "expected": "6"}
]
```
