---
id: php-mid-valid-brackets
title: Валидные скобки
difficulty: medium
language: php
---

# Описание

Дана строка, содержащая символы '(', ')', '{', '}', '[' и ']'. Определите, является ли строка валидной. Строка валидна, если каждая открывающая скобка имеет соответствующую закрывающую скобку правильного типа и в правильном порядке.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");

function isValid($s) {
    // ваш код
}

echo isValid($input) ? "true" : "false";
```

# Тесты

```json
[
  {"stdin": "()", "expected": "true"},
  {"stdin": "()[]{}", "expected": "true"},
  {"stdin": "(]", "expected": "false"},
  {"stdin": "([)]", "expected": "false"},
  {"stdin": "{[]}", "expected": "true"},
  {"stdin": "", "expected": "true"}
]
```
