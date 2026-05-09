---
id: php-sr-expression-eval
title: Вычисление выражения
difficulty: hard
language: php
---

# Описание

Дано математическое выражение, содержащее целые числа, операторы +, -, * и скобки. Вычислите результат выражения. Целочисленное деление отбрасывает дробную часть к нулю.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");

function evaluate($expr) {
    // ваш код
}

echo evaluate($input);
```

# Тесты

```json
[
  {"stdin": "3+2*2", "expected": "7"},
  {"stdin": "(1+(4+5+2)-3)+(6+8)", "expected": "23"},
  {"stdin": "2*(5+5*2)/3+(6/2+8)", "expected": "21"},
  {"stdin": "1+1", "expected": "2"}
]
```
