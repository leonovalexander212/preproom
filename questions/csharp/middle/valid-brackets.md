---
id: cs-mid-valid-brackets
title: Валидные скобки
difficulty: medium
language: csharp
---

# Описание

Дана строка, содержащая символы '(', ')', '{', '}', '[', ']'. Определите, является ли строка валидной (все скобки правильно закрыты). Выведите "true" или "false".

# Стартовый код

```csharp
using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        string input = Console.ReadLine() ?? "";
        Console.WriteLine(IsValid(input) ? "true" : "false");
    }

    static bool IsValid(string s) {
        // ваш код
    }
}
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
