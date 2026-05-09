---
id: cs-mid-max-subarray
title: Максимальный подмассив
difficulty: medium
language: csharp
---

# Описание

Дан массив целых чисел. Найдите непрерывный подмассив с максимальной суммой и выведите эту сумму. Используйте алгоритм Кадане.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int[] nums = Console.ReadLine().Split(' ').Select(int.Parse).ToArray();
        Console.WriteLine(MaxSubarraySum(nums));
    }

    static int MaxSubarraySum(int[] nums) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "-2 1 -3 4 -1 2 1 -5 4", "expected": "6"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "-1 -2 -3", "expected": "-1"},
  {"stdin": "5 -3 5", "expected": "7"}
]
```