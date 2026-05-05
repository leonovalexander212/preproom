---
id: php-count-words
title: Количество слов
difficulty: medium
language: php
---

# Описание

На вход — одна строка. Выведи количество слов (последовательностей не-пробельных символов). Несколько подряд пробелов — один разделитель.

# Стартовый код

```php
<?php
$s = rtrim(file_get_contents("php://stdin"), "\n");

function countWords(string $s): int {
    // твой код
    return 0;
}

echo countWords($s);
```

# Тесты

```json
[
  {"stdin": "hello world", "expected": "2"},
  {"stdin": "  PHP   is   cool  ", "expected": "3"},
  {"stdin": "single", "expected": "1"},
  {"stdin": "", "expected": "0"},
  {"stdin": "a b c d e", "expected": "5"}
]
```