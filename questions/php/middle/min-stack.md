---
id: php-mid-min-stack
title: Стек с минимумом
difficulty: medium
language: php
---

# Описание

Реализуйте стек, поддерживающий операции push, pop и получение текущего минимума за O(1). Для каждой операции "min" выведите текущий минимальный элемент в стеке.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$n = intval(trim($lines[0]));

function processMinStack($operations) {
    // ваш код
}

$ops = [];
for ($i = 1; $i <= $n; $i++) {
    $ops[] = trim($lines[$i]);
}

$results = processMinStack($ops);
echo implode("\n", $results);
```

# Тесты

```json
[
  {"stdin": "5\npush 3\npush 5\nmin\npush 1\nmin", "expected": "3\n1"},
  {"stdin": "3\npush 10\npush 20\nmin", "expected": "10"},
  {"stdin": "6\npush 2\npush 1\nmin\npop\nmin\npop", "expected": "1\n2"}
]
```
