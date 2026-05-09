---
id: php-sr-edit-distance
title: Расстояние редактирования
difficulty: hard
language: php
---

# Описание

Даны две строки. Найдите расстояние Левенштейна -- минимальное количество операций (вставка, удаление, замена символа), необходимых для преобразования одной строки в другую.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$a = isset($lines[0]) ? $lines[0] : '';
$b = isset($lines[1]) ? $lines[1] : '';

function editDistance($a, $b) {
    // ваш код
}

echo editDistance($a, $b);
```

# Тесты

```json
[
  {"stdin": "kitten\nsitting", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "0"},
  {"stdin": "\nabc", "expected": "3"},
  {"stdin": "horse\nros", "expected": "3"}
]
```
