---
id: cs-reverse-string
title: Реверс строки
difficulty: easy
language: csharp
---

# Описание

Дана строка. Выведите её в обратном порядке.

# Стартовый код

```csharp
using System;

class Program {
    static void Main() {
        string input = Console.ReadLine();
        Console.WriteLine(Reverse(input));
    }

    static string Reverse(string s) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "hello", "expected": "olleh"},
  {"stdin": "a", "expected": "a"},
  {"stdin": "abcde", "expected": "edcba"},
  {"stdin": "12345", "expected": "54321"}
]
```
