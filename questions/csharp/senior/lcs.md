---
id: cs-sr-lcs
title: Наибольшая общая подпоследовательность
difficulty: hard
language: csharp
---

# Описание

Найдите длину наибольшей общей подпоследовательности (LCS) двух строк. Подпоследовательность — это последовательность символов, которая сохраняет порядок, но не обязательно идёт подряд.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "abcde\nace", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "3"},
  {"stdin": "abc\ndef", "expected": "0"},
  {"stdin": "abcd\naecbd", "expected": "3"}
]
```