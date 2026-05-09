---
id: cs-mid-two-sum
title: Два слагаемых
difficulty: medium
language: csharp
---

# Описание

Дан массив целых чисел и целевая сумма. Найдите два индекса (0-based), элементы по которым дают целевую сумму. Выведите меньший индекс первым.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int[] nums = Console.ReadLine().Split(' ').Select(int.Parse).ToArray();
        int target = int.Parse(Console.ReadLine());
        int[] result = TwoSum(nums, target);
        Console.WriteLine(result[0] + " " + result[1]);
    }

    static int[] TwoSum(int[] nums, int target) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "2 7 11 15\n9", "expected": "0 1"},
  {"stdin": "3 2 4\n6", "expected": "1 2"},
  {"stdin": "1 5 3 7\n8", "expected": "1 3"}
]
```
