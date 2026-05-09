---
id: php-sr-coin-change
title: Размен монет
difficulty: hard
language: php
---

# Описание

Даны номиналы монет и целевая сумма. Найдите минимальное количество монет, необходимое для набора этой суммы. Каждый номинал можно использовать неограниченное число раз. Если набрать сумму невозможно, выведите -1.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");
$lines = explode("\n", $input);
$coins = array_map('intval', explode(' ', trim($lines[0])));
$amount = intval(trim($lines[1]));

function coinChange($coins, $amount) {
    // ваш код
}

echo coinChange($coins, $amount);
```

# Тесты

```json
[
  {"stdin": "1 5 10\n11", "expected": "2"},
  {"stdin": "2\n3", "expected": "-1"},
  {"stdin": "1\n0", "expected": "0"},
  {"stdin": "1 2 5\n11", "expected": "3"}
]
```
