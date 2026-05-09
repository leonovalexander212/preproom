---
id: cs-mid-longest-unique-substr
title: Подстрока без повторов
difficulty: medium
language: csharp
---

# Описание

Дана строка. Найдите длину самой длинной подстроки, в которой все символы уникальны (не повторяются).

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string s = Console.ReadLine();
        Console.WriteLine(LongestUniqueSubstring(s));
    }

    static int LongestUniqueSubstring(string s) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "abcabcbb", "expected": "3"},
  {"stdin": "bbbbb", "expected": "1"},
  {"stdin": "pwwkew", "expected": "3"},
  {"stdin": "a", "expected": "1"},
  {"stdin": "abcdef", "expected": "6"}
]
```