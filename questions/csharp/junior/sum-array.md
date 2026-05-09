---
id: cs-sum-array
title: Сумма массива
difficulty: easy
language: csharp
---

# Описание

Дана строка с целыми числами через пробел. Выведите их сумму.

# Стартовый код

```csharp
using System;
using System.Linq;

class Program {
    static void Main() {
        string line = Console.ReadLine();
        int[] nums = line.Split(' ').Select(int.Parse).ToArray();
        Console.WriteLine(Sum(nums));
    }

    static int Sum(int[] arr) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "1 2 3", "expected": "6"},
  {"stdin": "10", "expected": "10"},
  {"stdin": "-1 1", "expected": "0"},
  {"stdin": "100 200 300", "expected": "600"}
]
```
