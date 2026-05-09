---
id: php-mid-anagram-check
title: Проверка анаграмм
difficulty: medium
language: php
---

# Описание

Даны две строки. Определите, являются ли они анаграммами друг друга (без учёта регистра). Выведите "true" или "false".

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$a = trim($lines[0]);
$b = trim($lines[1]);

function isAnagram($a, $b) {
    // ваш код
}

echo isAnagram($a, $b) ? "true" : "false";
```

# Тесты

```json
[
  {"stdin": "listen\nsilent", "expected": "true"},
  {"stdin": "Hello\nWorld", "expected": "false"},
  {"stdin": "abc\ncba", "expected": "true"},
  {"stdin": "a\na", "expected": "true"}
]
```
