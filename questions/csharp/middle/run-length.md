---
id: cs-mid-run-length
title: RLE-кодирование
difficulty: medium
language: csharp
---

# Описание

Реализуйте RLE-кодирование строки. Каждый символ заменяется на символ и количество его последовательных повторений, например "aaabbc" → "a3b2c1".

# Стартовый код

```csharp
using System;
using System.Text;

class Program {
    static void Main() {
        string input = Console.ReadLine();
        Console.WriteLine(RunLengthEncode(input));
    }

    static string RunLengthEncode(string s) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "aaabbc", "expected": "a3b2c1"},
  {"stdin": "a", "expected": "a1"},
  {"stdin": "aaa", "expected": "a3"},
  {"stdin": "abcd", "expected": "a1b1c1d1"},
  {"stdin": "aabbbcccc", "expected": "a2b3c4"}
]
```
