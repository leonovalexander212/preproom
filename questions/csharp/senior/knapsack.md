---
id: cs-sr-knapsack
title: Задача о рюкзаке
difficulty: hard
language: csharp
---

# Описание

Решите задачу о рюкзаке 0/1: дано N предметов с весом и стоимостью и рюкзак грузоподъёмностью W. Найдите максимальную суммарную стоимость предметов, которые можно поместить в рюкзак, не превышая его грузоподъёмность.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var nw = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int n = nw[0], w = nw[1];
        var weights = new int[n];
        var values = new int[n];

        for (int i = 0; i < n; i++) {
            var parts = Console.ReadLine().Split().Select(int.Parse).ToArray();
            weights[i] = parts[0];
            values[i] = parts[1];
        }

        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "3 50\n10 60\n20 100\n30 120", "expected": "220"},
  {"stdin": "1 5\n10 100", "expected": "0"},
  {"stdin": "2 10\n5 50\n5 60", "expected": "110"}
]
```