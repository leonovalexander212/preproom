---
id: php-mid-decode-string
title: Декодирование строки
difficulty: medium
language: php
---

# Описание

Дана закодированная строка вида "3[ab]2[c]". Число перед скобками означает количество повторений содержимого скобок. Скобки могут быть вложенными. Декодируйте строку и выведите результат.

# Стартовый код

```php
<?php
$input = rtrim(file_get_contents("php://stdin"), "\n");

function decodeString($s) {
    // ваш код
}

echo decodeString($input);
```

# Тесты

```json
[
  {"stdin": "3[a]2[bc]", "expected": "aaabcbc"},
  {"stdin": "3[a2[c]]", "expected": "accaccacc"},
  {"stdin": "abc", "expected": "abc"},
  {"stdin": "2[abc]3[cd]ef", "expected": "abcabccdcdcdef"}
]
```
