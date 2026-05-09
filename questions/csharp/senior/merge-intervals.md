---
id: cs-sr-merge-intervals
title: Слияние интервалов
difficulty: hard
language: csharp
---

# Описание

Дан список интервалов. Объедините все пересекающиеся интервалы и выведите результат в отсортированном порядке. Два интервала пересекаются, если конец одного не меньше начала другого.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        var intervals = new List<int[]>();

        for (int i = 0; i < n; i++) {
            var parts = Console.ReadLine().Split().Select(int.Parse).ToArray();
            intervals.Add(parts);
        }

        // ваш код
        foreach (var iv in merged)
            Console.WriteLine(iv[0] + " " + iv[1]);
    }
}
```

# Тесты

```json
[
  {"stdin": "3\n1 3\n2 6\n8 10", "expected": "1 6\n8 10"},
  {"stdin": "2\n1 4\n4 5", "expected": "1 5"},
  {"stdin": "1\n1 1", "expected": "1 1"},
  {"stdin": "3\n1 4\n0 4\n3 5", "expected": "0 5"}
]
```