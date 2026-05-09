---
id: cs-sr-sliding-max
title: Максимум в скользящем окне
difficulty: hard
language: csharp
---

# Описание

Дан массив целых чисел и размер окна K. Найдите максимальное значение в каждом скользящем окне размера K при движении слева направо. Используйте деку для решения за линейное время.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var nums = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int k = int.Parse(Console.ReadLine());
        var result = new List<int>();
        var deque = new LinkedList<int>();
        // ваш код
        Console.WriteLine(string.Join(" ", result));
    }
}
```

# Тесты

```json
[
  {"stdin": "1 3 -1 -3 5 3 6 7\n3", "expected": "3 3 5 5 6 7"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "1 -1\n1", "expected": "1 -1"},
  {"stdin": "9 8 7 6 5\n2", "expected": "9 8 7 6"}
]
```