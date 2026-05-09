---
id: cs-palindrome
title: Палиндром
difficulty: easy
language: csharp
---

# Описание

Дана строка. Определите, является ли она палиндромом (без учёта регистра). Выведите "true" или "false".

# Стартовый код

```csharp
using System;

class Program {
    static void Main() {
        string input = Console.ReadLine();
        Console.WriteLine(IsPalindrome(input) ? "true" : "false");
    }

    static bool IsPalindrome(string s) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "level", "expected": "true"},
  {"stdin": "CSharp", "expected": "false"},
  {"stdin": "AbBa", "expected": "true"},
  {"stdin": "x", "expected": "true"},
  {"stdin": "preproom", "expected": "false"}
]
```
