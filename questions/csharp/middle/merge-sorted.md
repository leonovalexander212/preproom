---
id: cs-mid-merge-sorted
title: Слияние отсортированных массивов
difficulty: medium
language: csharp
---

# Описание

Даны два отсортированных массива целых чисел. Объедините их в один отсортированный массив и выведите через пробел.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string line1 = Console.ReadLine() ?? "";
        string line2 = Console.ReadLine() ?? "";
        int[] a = string.IsNullOrWhiteSpace(line1) ? new int[0] : line1.Split(' ').Select(int.Parse).ToArray();
        int[] b = string.IsNullOrWhiteSpace(line2) ? new int[0] : line2.Split(' ').Select(int.Parse).ToArray();
        int[] merged = MergeSorted(a, b);
        Console.WriteLine(string.Join(" ", merged));
    }

    static int[] MergeSorted(int[] a, int[] b) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "1 3 5\n2 4 6", "expected": "1 2 3 4 5 6"},
  {"stdin": "1\n2", "expected": "1 2"},
  {"stdin": "1 2 3\n", "expected": "1 2 3"},
  {"stdin": "\n4 5 6", "expected": "4 5 6"}
]
```
