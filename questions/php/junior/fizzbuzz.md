---
id: php-fizzbuzz
title: FizzBuzz
difficulty: easy
language: php
---

# Описание

Прочитай N. Выведи N строк: 3→Fizz, 5→Buzz, 15→FizzBuzz, иначе число.

# Стартовый код

```php
<?php
$n = (int)trim(file_get_contents("php://stdin"));

$out = [];
for ($i = 1; $i <= $n; $i++) {
    // твой код
    $out[] = (string)$i;
}
echo implode("\n", $out);
```

# Тесты

```json
[
  {"stdin": "5", "expected": "1\n2\nFizz\n4\nBuzz"},
  {"stdin": "3", "expected": "1\n2\nFizz"},
  {"stdin": "15", "expected": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz"}
]
```