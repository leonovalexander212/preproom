---
id: php-sr-word-break
title: Разбиение строки
difficulty: hard
language: php
---

# Описание

Дана строка и словарь слов (через пробел). Определите, можно ли разбить строку на последовательность слов из словаря. Выведите "true" или "false".

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$s = trim($lines[0]);
$dict = explode(' ', trim($lines[1]));

function wordBreak($s, $dict) {
    // ваш код
}

echo wordBreak($s, $dict) ? "true" : "false";
```

# Тесты

```json
[
  {"stdin": "leetcode\nleet code", "expected": "true"},
  {"stdin": "applepenapple\napple pen", "expected": "true"},
  {"stdin": "catsandog\ncats dog sand and cat", "expected": "false"}
]
```
