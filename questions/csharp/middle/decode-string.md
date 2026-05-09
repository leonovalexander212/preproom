---
id: cs-mid-decode-string
title: Декодирование строки
difficulty: medium
language: csharp
---

# Описание

Дана закодированная строка вида "3[ab]2[c]". Число перед скобками означает количество повторений содержимого. Скобки могут быть вложенными: "2[a3[b]]" раскрывается в "abbbabbb". Верните декодированную строку.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string encoded = Console.ReadLine();
        Console.WriteLine(DecodeString(encoded));
    }

    static string DecodeString(string s) {
        // ваш код
    }
}
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