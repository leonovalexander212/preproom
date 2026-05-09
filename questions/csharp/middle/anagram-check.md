---
id: cs-mid-anagram-check
title: Проверка анаграмм
difficulty: medium
language: csharp
---

# Описание

Даны две строки. Определите, являются ли они анаграммами друг друга (без учёта регистра). Выведите "true" или "false".

# Стартовый код

```csharp
using System;
using System.Linq;

class Program {
    static void Main() {
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        Console.WriteLine(IsAnagram(a, b) ? "true" : "false");
    }

    static bool IsAnagram(string a, string b) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "listen\nsilent", "expected": "true"},
  {"stdin": "Hello\nWorld", "expected": "false"},
  {"stdin": "abc\ncba", "expected": "true"},
  {"stdin": "a\na", "expected": "true"}
]
```
