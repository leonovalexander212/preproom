---
id: cs-mid-rotate-array
title: Ротация массива
difficulty: medium
language: csharp
---

# Описание

Дан массив целых чисел и число K. Выполните циклический сдвиг массива вправо на K позиций и выведите результат.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int[] nums = Console.ReadLine().Split(' ').Select(int.Parse).ToArray();
        int k = int.Parse(Console.ReadLine());
        int[] result = RotateArray(nums, k);
        Console.WriteLine(string.Join(" ", result));
    }

    static int[] RotateArray(int[] nums, int k) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "1 2 3 4 5\n2", "expected": "4 5 1 2 3"},
  {"stdin": "1 2 3\n1", "expected": "3 1 2"},
  {"stdin": "1\n5", "expected": "1"},
  {"stdin": "1 2 3 4\n4", "expected": "1 2 3 4"}
]
```