---
id: cs-mid-binary-search
title: Бинарный поиск
difficulty: medium
language: csharp
---

# Описание

Дан отсортированный массив целых чисел и целевое значение. Найдите индекс целевого элемента или верните -1, если элемент не найден.

# Стартовый код

```csharp
using System;
using System.Linq;

class Program {
    static void Main() {
        int[] arr = Console.ReadLine().Split(' ').Select(int.Parse).ToArray();
        int target = int.Parse(Console.ReadLine());
        Console.WriteLine(BinarySearch(arr, target));
    }

    static int BinarySearch(int[] arr, int target) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "1 3 5 7 9\n5", "expected": "2"},
  {"stdin": "1 3 5 7 9\n6", "expected": "-1"},
  {"stdin": "10\n10", "expected": "0"},
  {"stdin": "1 2 3 4 5 6 7 8 9 10\n1", "expected": "0"}
]
```
