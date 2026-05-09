---
id: php-sr-prefix-count
title: Поиск по префиксу
difficulty: hard
language: php
---

# Описание

Дан список слов и набор запросов-префиксов. Для каждого префикса определите, сколько слов из списка начинаются с этого префикса. Выведите количество для каждого запроса на отдельной строке.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$idx = 0;
$n = intval(trim($lines[$idx++]));
$words = [];
for ($i = 0; $i < $n; $i++) {
    $words[] = trim($lines[$idx++]);
}
$q = intval(trim($lines[$idx++]));
$prefixes = [];
for ($i = 0; $i < $q; $i++) {
    $prefixes[] = trim($lines[$idx++]);
}

function prefixCount($words, $prefixes) {
    // ваш код
}

$results = prefixCount($words, $prefixes);
echo implode("\n", $results);
```

# Тесты

```json
[
  {"stdin": "5\napple\napp\napricot\nbanana\nband\n3\nap\nban\nz", "expected": "3\n2\n0"},
  {"stdin": "2\nhello\nhelp\n1\nhel", "expected": "2"}
]
```
