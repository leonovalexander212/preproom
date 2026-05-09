---
id: cs-sr-word-break
title: Разбиение строки
difficulty: hard
language: csharp
---

# Описание

Определите, можно ли разбить заданную строку на последовательность слов из данного словаря. Каждое слово словаря может использоваться многократно. Выведите "true" или "false".

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string s = Console.ReadLine();
        var dict = new HashSet<string>(Console.ReadLine().Split());
        // ваш код
        Console.WriteLine(result ? "true" : "false");
    }
}
```

# Тесты

```json
[
  {"stdin": "leetcode\nleet code", "expected": "true"},
  {"stdin": "applepenapple\napple pen", "expected": "true"},
  {"stdin": "catsandog\ncats dog sand and cat", "expected": "false"}
]
```