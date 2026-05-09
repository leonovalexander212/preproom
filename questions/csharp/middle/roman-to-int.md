---
id: cs-mid-roman-to-int
title: Римские числа
difficulty: medium
language: csharp
---

# Описание

Дана строка с римским числом. Преобразуйте её в целое число. Поддерживаются символы I, V, X, L, C, D, M и вычитательные комбинации (IV, IX, XL, XC, CD, CM).

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string roman = Console.ReadLine();
        Console.WriteLine(RomanToInt(roman));
    }

    static int RomanToInt(string s) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "III", "expected": "3"},
  {"stdin": "IV", "expected": "4"},
  {"stdin": "IX", "expected": "9"},
  {"stdin": "XLII", "expected": "42"},
  {"stdin": "MCMXCIV", "expected": "1994"}
]
```